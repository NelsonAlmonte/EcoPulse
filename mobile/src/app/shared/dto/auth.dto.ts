export interface LoginUserDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  id: string;
  email: string;
  access_token: string;
  refresh_token: string;
}

export interface SignupUserDto {
  name: string;
  last: string;
  email: string;
  password: string;
}

export interface RefreshUserSessionDto {
  refresh_token: string;
}
