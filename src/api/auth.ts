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
  ageMin: number;
  ageMax: number;
  cityId: number;
  hobbyIds: number[];
  photos: (File | string)[];
};

export const register = (register_data: RegisterRequestDTO) => {
  const formData = new FormData();

  const { photos, ...data } = register_data;
  formData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));

  photos.forEach((photo) => {
    if (photo instanceof File) {
      formData.append("photos", photo);
    }
  });

  return apiRequest<{ message: string }>("/register", {
    method: "POST",
    body: formData,
  });
};

export {};
