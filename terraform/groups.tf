data "azuread_client_config" "current" {}

resource "azuread_group" "managers" {
  display_name     = "Managers"
  owners           = [data.azuread_client_config.current.object_id]
  security_enabled = true
}

resource "azurerm_role_assignment" "managers" {
  scope                = data.azurerm_subscription.current.id
  role_definition_name = "Contributor"
  principal_id         = azuread_group.managers.object_id
}

resource "azuread_group" "sales_team" {
  display_name     = "Sales Team"
  owners           = [data.azuread_client_config.current.object_id]
  security_enabled = true
}

resource "azurerm_role_assignment" "sales_team" {
  scope                = data.azurerm_subscription.current.id
  role_definition_name = "Reader"
  principal_id         = azuread_group.sales_team.object_id
}