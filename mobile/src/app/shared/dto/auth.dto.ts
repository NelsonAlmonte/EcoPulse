export interface LoginUserDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  id: string;
  email: string;
  token: string;
}

export interface SignupUserDto {
  name: string;
  last: string;
  email: string;
  password: string;
}
