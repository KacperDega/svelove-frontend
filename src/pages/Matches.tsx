import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Sex, Preference } from '../types/enums';

const translateSex = (sex: Sex) => {
  switch (sex) {
    case Sex.Male:
      return 'Mężczyzna';
    case Sex.Female:
      return 'Kobieta';
    case Sex.Other:
    default:
      return 'Inna / Nieokreślona';
  }
};

const translatePreference = (preference: Preference) => {
  switch (preference) {
    case Preference.Men:
      return 'Mężczyzn';
    case Preference.Women:
      return 'Kobiet';
    case Preference.Both:
      return 'Mężczyzn i Kobiet';
    case Preference.Other:
    default:
      return 'Inne / Brak preferencji';
  }
};


const profiles = [
  {
    id: 1,
    username: "Anna",
    sex: Sex.Female,
    age: 27,
    localization: "Warszawa",
    preference: Preference.Men,
    hobbies: ["Sztuka", "Podróże", "Muzyka"],
    description: "Miłośniczka sztuki współczesnej, uwielbia podróże po Europie i słuchać jazzu w wolnym czasie."
  },
  {
    id: 2,
    username: "Kasia",
    sex: Sex.Female,
    age: 30,
    localization: "Kraków",
    preference: Preference.Men,
    hobbies: ["Kino", "Fitness", "Góry"],
    description: "Filmowa pasjonatka, która w weekendy zdobywa tatrzańskie szczyty i testuje nowe przepisy fit."
  },
  {
    id: 3,
    username: "Julia",
    sex: Sex.Female,
    age: 25,
    localization: "Gdańsk",
    preference: Preference.Men,
    hobbies: ["Technologia", "Gotowanie", "Książki"],
    description: "Frontend developerka z pasją do kuchni włoskiej i literatury fantasy."
  }
];

const Matches = () => {
  const [index, setIndex] = useState(0);
  const user = profiles[index];

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % profiles.length);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-base-100 px-4 py-8">
        <div className="card w-full max-w-2xl bg-neutral shadow-2xl border border-secondary">
          <figure className="h-[550px] overflow-hidden">
            <img
              src={`https://thispersondoesnotexist.com`}
              alt={user.username}
              className="object-cover w-full h-full"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title text-3xl text-primary flex items-end gap-2">
              {user.username}, {user.age}
              <span className="text-primary text-lg">
                ({translateSex(user.sex)} →{" "}
                {translatePreference(user.preference)})
              </span>
            </h2>

            <p className="text-lg">
              <strong className="text-primary">Miasto:</strong> {user.localization}
            </p>
            <p className="text-lg">
              <strong className="text-primary">Zainteresowania:</strong> {user.hobbies.join(", ")}
            </p>
            <p className="text-lg font-medium italic mt-2 text-secondary">{user.description}</p>
            <div className="card-actions justify-between mt-6 mx-4">
              <button onClick={handleNext} className="btn btn-outline btn-secondary btn-wide text-lg">Pomiń ▷▷</button>
              <button onClick={handleNext} className="btn btn-primary btn-wide text-lg">Polub ✓</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Matches;
