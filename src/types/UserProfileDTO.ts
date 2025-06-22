import { Hobby, Preference, Sex } from "./enums";

export interface UserProfileDTO {
  username: string;
  login: string;
  sex: Sex;
  preference: Preference;
  hobbies: string[];
  description: string;
  localization: string;
  age: number;
  age_min: number;
  age_max: number;
}

export const emptyProfile: UserProfileDTO = {
  username: "",
  login: "",
  sex: Sex.Other,
  preference: Preference.Other,
  hobbies: [],
  description: "",
  localization: "",
  age: 0,
  age_min: 0,
  age_max: 0,
};
