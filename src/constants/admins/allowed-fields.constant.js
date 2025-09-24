export const ALLOWED_FIELDS = {
  SUPER_ADMIN: {
    CREATE: {
      name: 'name',
      email: 'email',
      password: 'password',
      role: 'role'
    },
    UPDATE: {
      name: 'name',
      email: 'email',
      password: 'password',
      role: 'role',
      isBanned: 'is_banned',
      isDeleted: 'is_deleted'
    }
  },
  ADMIN: {
    UPDATE: {
      name: 'name',
      email: 'email'
    }
  },
  USER: {
    UPDATE: {
      name: 'name',
      email: 'email',
      password: 'password',
      isBanned: 'is_banned',
      isDeleted: 'is_deleted'
    }
  },
  PRODUCT: {
    CREATE: {
      name: 'name',
      description: 'description',
      price: 'price',
      image: 'image',
      stock: 'stock'
    },
    UPDATE: {
      name: 'name',
      description: 'description',
      price: 'price',
      image: 'image',
      stock: 'stock',
      status: 'status',
      isDeleted: 'is_deleted'
    }
  }
};