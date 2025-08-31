import { apiRequest } from "./apiRequest";
import { CityDTO } from "../types/CityDTO";

export const getCities = () => {
  return apiRequest<CityDTO[]>("/cities");
};
