export interface SuccessLoginResponse {
  message: string
  token: string
  user: {
    _id: string
    name: string
    email: string
    role: string
  }
}
export interface FailedLoginResponse {
  message: string;
  statusMsg: string;
}

export interface UserResponse {
  _id: string
  name: string
  email: string
  role: string
}