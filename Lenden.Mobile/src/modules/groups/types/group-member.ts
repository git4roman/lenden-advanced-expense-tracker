// export type GroupMember = {
//   userId: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   userImageUri: string;
// };

export type Group = {
  id: string;
  name: string;
  imageUrl: string;
  updatedAt?: string;
  members: GroupMember[];
  createdBy?: number;
};

export type GroupMember = {
  id: string;
  email: string;
  givenName: string;
  familyName: string;
  netBalance?: number;
};
