export enum Hobby {
    // Sztuka i kreatywność
    Drawing = "Drawing",
    Painting = "Painting",
    Photography = "Photography",
    Writing = "Writing",
    DIY = "DIY / Crafts",
    PlayingInstrument = "Playing an Instrument",
    Dancing = "Dancing",
    Singing = "Singing",
    GraphicDesign = "Graphic Design",

    // Sport i aktywność fizyczna
    Gym = "Gym",
    Running = "Running",
    Cycling = "Cycling",
    Swimming = "Swimming",
    Yoga = "Yoga",
    TeamSports = "Team Sports",
    Climbing = "Climbing",
    MartialArts = "Martial Arts",
    Fitness = "Fitness",
    Hiking = "Hiking",

    // Na świeżym powietrzu i podróże
    Camping = "Camping",
    Fishing = "Fishing",
    Gardening = "Gardening",
    Traveling = "Traveling",
    CityExploration = "City Exploration",
    Stargazing = "Stargazing",
    Picnics = "Picnics",

    // Kultura i rozrywka
    Reading = "Reading",
    Movies = "Movies",
    BoardGames = "Board Games",
    VideoGames = "Video Games",
    Theater = "Theater",
    Music = "Listening to Music",
    Anime = "Anime / Manga",
    Cooking = "Cooking",
    LanguageLearning = "Learning Languages",

    // Intelektualne i technologiczne
    Programming = "Programming",
    Science = "Science",
    Puzzles = "Logic Puzzles",
    ModelBuilding = "Model Building",
    Podcasts = "Podcasts",
    OnlineLearning = "Online Learning"
}

export const hobbies: string[] = Object.values(Hobby);