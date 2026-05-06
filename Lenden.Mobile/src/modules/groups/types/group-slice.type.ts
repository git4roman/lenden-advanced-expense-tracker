export interface GroupSummaryResponse {
  id: string;
  name: string;
  imageUrl: string;
  members: GroupMembersSummary[];
  memberCount: number;
  createdAt: string;
}
export interface GroupMembersSummary {
  id: string;
  givenName: string;
  familyName: string;
  imageUrl: string;
}

export interface GroupBalanceResponse {
  from: string;
  fromUserId: string;
  to: string;
  toUserId: string;
  amount: number;
}

export interface GroupDetailedResponse {
  id: string;
  name: string;
  imageUrl: string;
  members: GroupMemberDetailedResponse[];
}

export interface GroupMemberDetailedResponse {
  id: string;
  email: string;
  imgUrl: string;
  givenName: string;
  familyName: string;
}

export interface CreateGroupRequest {
  name: string;
  imageUrl: string;
  requestedUsers: CreateGroupRequestRequestedUser[];
}

export interface CreateGroupRequestRequestedUser {
  phoneNumber: string;
  email: string;
  fullName: string;
}

export interface UpdateGroupRequest {
  name: string;
  imageUrl: string;
}

export interface AddMembersRequest {
  requestedUsers: AddMembersRequestedUserRequest[];
}

export interface AddMembersRequestedUserRequest {
  phoneNumber: string;
  email: string;
  fullName: string;
}
