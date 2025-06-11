import { apiRequest } from "./index";

export const login = (login: string, password: string) => {
  return apiRequest<{ token: string; username: string; id: number }>("/login", {
    method: "POST",
    body: JSON.stringify({ login, password }),
  });
};

export type RegisterRequestDTO = {
  username: string;
  login: string;
  password: string;
  sex: "Male" | "Female" | "Other";
  preference: "Men" | "Women" | "Both" | "Other";
  description: string;
  age: number;
  age_min: number;
  age_max: number;
  localization: string;
};

export const register = (register_data: RegisterRequestDTO) => {
  return apiRequest<{ message: string }>("/register", {
    method: "POST",
    body: JSON.stringify(register_data),
  });
};

export {}