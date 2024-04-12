terraform {
  required_providers {
    azuread = {
      source = "hashicorp/azuread"
      version = "2.48.0"
    }
    azurerm = {
      source = "hashicorp/azurerm"
      version = "3.99.0"
    }
  }
}

provider "azuread" {
  tenant_id = "bfd45559-6ec1-4f4c-8d7d-c4b725b8ad6e"
}

provider "azurerm" {
  features {
    
  }
}

data "azurerm_subscription" "current"{

}

data "azurerm_client_config" "current" {
}