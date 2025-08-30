import { apiRequest } from "./index";

export type HobbyDTO = {
  id: number;
  name: string;
  label: string;
};

export const getHobbies = () => {
  return apiRequest<HobbyDTO[]>("/hobbies");
};

