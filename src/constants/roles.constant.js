export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  GENERAL_ADMIN: 'general_admin',
  PRODUCT_MANAGER: 'product_manager',
  ORDER_MANAGER: 'order_manager',
  USER_MANAGER: 'user_manager',
  USER: 'user',
  ALL_ADMINS: 'admins_profile_update',
  VIEW_ONLY_ADMIN: 'view_only_admin'
};

export const ROLE_HIERARCHY = {
  general_admin: [
    ROLES.GENERAL_ADMIN, ROLES.PRODUCT_MANAGER,
    ROLES.ORDER_MANAGER, ROLES.USER_MANAGER, ROLES.USER, ROLES.ALL_ADMINS
  ],
  product_manager: [ROLES.PRODUCT_MANAGER, ROLES.USER, ROLES.ALL_ADMINS],
  order_manager: [ROLES.ORDER_MANAGER, ROLES.USER, ROLES.ALL_ADMINS],
  user_manager: [ROLES.USER_MANAGER, ROLES.USER, ROLES.ALL_ADMINS]
};

export const FIELDS_TO_REMOVE = {
  SUPER_ADMIN: ['password'],
  ADMIN: ['password', 'created_by', 'updated_by'],
  PUBLIC: [
    'password', 'last_login', 'is_banned', 'is_deleted',
    'is_visible', 'created_at', 'updated_at', 'created_by', 'updated_by'
  ]
};