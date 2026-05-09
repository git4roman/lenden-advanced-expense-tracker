export interface SettlementRequest {
  groupId: string;
  requestedBy: string;
  debtorId: string;
}

export interface SettlementResponse {
  settlementId: string;
  requestedBy: string;
  debtorId: string;
  amount: number;
}
export interface RequestSettlementRequest {
  groupId: string;
  requestedBy: string;
  creditorId: string;
}

export interface RequestSettlementResponse {
  settlementId: string;
  requestedBy: string;
  creditorId: string;
  amount: number;
}

export interface Settlements {
  settlementId: string;
  groupId: string;
  creditorId: string;
  debtorId: string;
  amount: number;
  status: SettlementStatus;
  createdAt: Date;
}

export interface ConfirmSettlementRequest {
  groupId: string;
  settlementId: string;
}

export enum SettlementStatus {
  Completed = "Completed",
  Pending = "Pending",
}
