import { User } from '@prisma/client';

type UserFields = {
  [K in keyof User]: boolean;
};

const createUserSelect = (): UserFields => {
  const userFields: UserFields = {
    id: true,
    email: true,
    passwordHash: false,
    createdAt: true,
    updatedAt: true,
  };
  return userFields;
};

export const UserSelect = createUserSelect();
