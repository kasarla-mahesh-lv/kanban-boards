import api from "./Apiwrapper";

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: {
    id: string;
    email: string;
  };
};

// 🔥 Updated endpoint
export const loginApi = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const res = await api.post("/auth/login", payload);
  return res.data;
};
