import { apiRequest } from "./index";

export type CityDTO = {
  id: number;
  name: string;
};

export const getCities = () => {
  return apiRequest<CityDTO[]>("/cities");
};
