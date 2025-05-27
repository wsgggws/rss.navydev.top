import api from "../utils/axios";

// 登录参数
export interface LoginRequest {
  username: string;
  password: string;
}

export interface UserItem {
  username: string;
  email: string;
}

// 登录响应
export interface LoginResponse {
  access_token: string;
  token_type: string;
  username: string;
}

// 注册参数
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

// 注册响应（可根据实际 API 返回字段修改）
export interface RegisterResponse {
  id: string;
  username: string;
}

/**
 * 登录接口
 */
export async function userLogin(data: LoginRequest): Promise<LoginResponse> {
  const formData = new FormData();
  formData.append("username", data.username);
  formData.append("password", data.password);

  const res = await api.post("/api/v1/user/token", formData);
  return res.data;
}

/**
 * 注册接口
 */
export async function userRegister(
  data: RegisterRequest,
): Promise<RegisterResponse> {
  const res = await api.post("/api/v1/user/register", data);
  return res.data;
}
