import { Preference, Sex } from "./enums";

export interface MatchProfile {
  id: number;
  username: string;
  sex: Sex;
  age: number;
  city: string;
  preference: Preference;
  hobbies: string[];
  description: string;
  photoUrls: string[];
}