export interface LoginRequest {
  email: string;
  pnr: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  expiresIn: number;
}
