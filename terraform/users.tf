resource "azuread_user" "john_manager" {
  user_principal_name = "john_manager@colingreens.dev"
  display_name = "Manager John"
  mail_nickname = "Heres_Johnny"
  password = random_password.john_manager.result
}

resource "azuread_group_member" "add_john_to_group" {
  group_object_id  = azuread_group.managers.id 
  member_object_id = azuread_user.john_manager.id
}

resource "random_password" "john_manager" { 
    length = 16
    special = true
    min_lower = 2
    min_special = 2
    min_numeric = 2
    min_upper = 2
}

resource "azuread_user" "jim_sales" {
  user_principal_name = "jim_sales@colingreens.dev"
  display_name = "Sales Jim"
  mail_nickname = "Big_Jim"
  password = random_password.jim_sales.result
}

resource "azuread_group_member" "add_jim_to_group" {
  group_object_id  = azuread_group.sales_team.id
  member_object_id = azuread_user.jim_sales.id
}

resource "random_password" "jim_sales" { 
    length = 16
    special = true
    min_lower = 2
    min_special = 2
    min_numeric = 2
    min_upper = 2
}

