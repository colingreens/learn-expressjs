//@ts-nocheck
import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import * as msal from "@azure/msal-node";

dotenv.config();

const port = process.env.PORT || 3000;
const host = process.env.HOST!;
const tenantId = process.env.TENANT_ID!;
const clientId = process.env.CLIENT_ID!;
const clientSecret = process.env.CLIENT_SECRET!;
const cloudInstance = process.env.CLOUD_INSTANCE!;

const widgetHtmlForSales = "<h1>Welcome Sales!</h1>";
const widgetHtmlForManager = "<h1>Welcome Manager!</h1>";
const widgetHtmlForAuthorized = "<h1>Welcome Person Without a Role!</h1>";
const widgetHtmlForUnAuthorized = "<h1>Welcome Stranger!</>";

const groupMap = {
  manager: "f3013f67-0214-47bd-a5ad-21f3ec7e987e",
  sales: "5484d501-e0bc-4bde-ba28-cdd90be1ef48",
};

const msalConfig: msal.Configuration = {
  auth: {
    clientId,
    authority: cloudInstance + tenantId,
    clientSecret: clientSecret,
  },
};

const pca = new msal.PublicClientApplication(msalConfig);

const app: Express = express();

function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  pca.getAllAccounts().then((accounts) => {
    const isAuthenticated: boolean = accounts.length > 0;
    if (isAuthenticated) {
      return next();
    } else {
      res.send(widgetHtmlForUnAuthorized);
    }
  });
}

function checkUserRole(req: Request, res: Response, next: NextFunction) {
  pca.getAllAccounts().then((accounts) => {
    const group: string = accounts[0].idTokenClaims?.groups[0];
    if (group === groupMap.manager) {
      res.send(widgetHtmlForManager);
    } else if (group === groupMap.sales) {
      res.send(widgetHtmlForSales);
    } else return next();
  });
}

app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Hi, visit /signin to login</h1>");
});

app.get("/signin", (req: Request, res: Response) => {
  const authCodeUrlParameters: msal.AuthorizationUrlRequest = {
    scopes: ["user.read"],
    redirectUri: `http://${host}:${port}/redirect`,
  };
  pca
    .getAuthCodeUrl(authCodeUrlParameters)
    .then((response) => {
      res.redirect(response);
    })
    .catch((error) => console.log(JSON.stringify(error)));
});

app.get("/redirect", (req: Request, res: Response) => {
  const tokenRequest: msal.AuthorizationCodeRequest = {
    code: req.query.code as string,
    redirectUri: `http://${host}:${port}/redirect`,
    scopes: ["user.read"],
  };
  pca.acquireTokenByCode(tokenRequest).then((response) => {
    res.redirect("/widget");
  });
});

app.get(
  "/widget",
  [isAuthenticated, checkUserRole],
  (req: Request, res: Response) => {
    res.send(widgetHtmlForAuthorized);
  }
);

app.get("/logout", (req: Request, res: Response) => {
  pca
    .getTokenCache()
    .getAllAccounts()
    .then((response) => {
      const account = response[0];
      pca
        .getTokenCache()
        .removeAccount(account)
        .then(() => {
          res.sendStatus(200);
        })
        .catch((error) => {
          res.status(500).send({ error });
        });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://${host}:${port}`);
});
