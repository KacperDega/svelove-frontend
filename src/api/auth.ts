import { apiRequest } from "./index";

export const login = (login: string, password: string) => {
  return apiRequest<{ token: string; username: string; id: number }>("/login", {
    method: "POST",
    body: JSON.stringify({ login, password }),
  });
};

export const register = (register_data: {
  username: string;
  login: string;
  password: string;
}) => {
  return apiRequest<{ message: string }>("/register", {
    method: "POST",
    body: JSON.stringify(register_data),
  });
};

export {}