import { Preference, Sex } from "./enums";
import imagePlaceholder from "../assets/image-placeholder.svg";

export interface UserProfileDTO {
  username: string;
  login: string;
  sex: Sex;
  preference: Preference;
  hobbies: string[];
  description: string;
  city: string;
  photoUrls : string[],
  age: number;
  age_min: number;
  age_max: number;
}

export interface UserProfileUpdateDto {
  username: string;
  preference: string;
  hobbyIds: number[];
  description?: string;
  cityId: number;
  age: number;
  ageMin: number;
  ageMax: number;
}


export const emptyProfile: UserProfileDTO = {
  username: "",
  login: "",
  sex: Sex.Other,
  preference: Preference.Other,
  hobbies: [],
  description: "",
  city: "",
  photoUrls: [imagePlaceholder],
  age: 0,
  age_min: 0,
  age_max: 0,
};

export function mapToUpdateDto(
  formData: UserProfileDTO,
  hobbies: { id: number; label: string }[],
  cities: { id: number; name: string }[]
): UserProfileUpdateDto {
  const hobbyIds = formData.hobbies
    .map(label => hobbies.find(h => h.label === label)?.id)
    .filter((id): id is number => id !== undefined);

  const cityId = cities.find(city => city.name === formData.city)?.id;
  if (cityId === undefined) {
    throw new Error("City not found");
  }

  return {
    username: formData.username,
    preference: formData.preference,
    hobbyIds,
    description: formData.description,
    cityId,
    age: formData.age,
    ageMin: formData.age_min,
    ageMax: formData.age_max,
  };
}