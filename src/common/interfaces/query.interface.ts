export interface UserQuery {
  $or: Array<{
    firstName?: RegExp;
    lastName?: RegExp;
  }>;
  isActive: boolean;
  isDeleted: boolean;
}

export interface ProductQuery {
  title?: RegExp;
  category?: string;
  vendor?: string;
  collection?: string;
  isDeleted: boolean;
}

export interface OrderQuery {
  userId?: string;
  name?: RegExp;
  status?: string;
}
