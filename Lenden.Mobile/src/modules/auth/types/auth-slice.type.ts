export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
  deviceInfo: string;
  ipAddress: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  dateOfBirth: Date;
  imageUrl: string;
  deviceInfo: string;
  ipAddress: string;
}

export interface GoogleRequest {
  idToken: string;
  deviceInfo: string;
  ipAddress: string;
}

export interface RegisterResponse extends LoginResponse {}
export interface GoogleResponse extends LoginResponse {}
