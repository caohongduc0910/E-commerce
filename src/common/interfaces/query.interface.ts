export interface UserQuery {
  $or: Array<{
    firstName?: RegExp;
    lastName?: RegExp;
  }>;
  isActive: boolean;
  isDeleted: boolean;
}
