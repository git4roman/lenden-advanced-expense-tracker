import { Repayment } from "./group-slice.type";

export interface GroupExpenses {
  id: string;
  groupId: string;
  description: string;
  receipt: Receipt | null;
  creationMethod: `${CreationMethod}`;
  categoryKey: `${CategoryKey}`;
  cost: number;
  date: string;
  createdAt: string;
  updatedAt: string;
  createdBy: CreatedBy;
  repayments: Repayment[];
  users: User[];
}

export enum CategoryKey {
  Accommodation = "Accommodation",
  Groceries = "Groceries",
  Household = "Household",
  Personal = "Personal",
  Travel = "Travel",
}

export interface CreatedBy {
  id: string;
  email: string;
  givenName: string;
  familyName: string;
  avatar: string;
}

export enum CreationMethod {
  Equal = "Equal",
  Unequal = "Unequal",
}

export interface Receipt {
  large: string;
  original: string;
}

export interface User {
  id: string;
  email: string;
  givenName: string;
  familyName: string;
  avatar: null;
  paidAmount: number;
  splitAmount: number;
  netBalance: number;
}
