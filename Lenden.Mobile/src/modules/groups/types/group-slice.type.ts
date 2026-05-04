export interface GroupSummaryResponse {
  id: string;
  name: string;
  imageUrl: string;
  memberImgUrls: string[];
  memberCount: number;
  createdAt: string;
}

export interface GroupBalanceResponse {
  from: string;
  fromUserId: string;
  to: string;
  toUserId: string;
  amount: number;
}
