import { apiRequest } from "./apiRequest";
import { HobbyDTO } from "../types/HobbyDTO";

export const getHobbies = () => {
  return apiRequest<HobbyDTO[]>("/hobbies");
};

