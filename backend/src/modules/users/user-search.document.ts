import { UserDocument } from './schemas/user.schema';

export const USER_SEARCH_INDEX = 'users';

export interface UserSearchDocument {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

export function toUserSearchDocument(user: UserDocument): UserSearchDocument {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
  };
}
