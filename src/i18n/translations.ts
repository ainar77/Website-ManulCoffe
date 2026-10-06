export type Language = "en" | "lv";

export const translations = {
  en: {
    nav: {
      menu: "Menu",
      locations: "Locations",
      reviews: "Reviews",
      contacts: "Contacts",
      reserve: "Reserve a Table",
    },
    hero: {
      eyebrow: "Specialty coffee · Riga",
      viewMenu: "View menu",
      findLocation: "Find a location",
      scrollLabel: "Scroll to seasonal selection",
    },
    favorites: {
      eyebrow: "For right now",
      title: "Seasonal selection",
    },
    menu: {
      eyebrow: "Made throughout the day",
      title: "Menu",
      intro:
        "Espresso-led classics, seasonal ideas and food made for unrushed mornings.",
      categoriesLabel: "Menu categories",
      loading: "Loading menu…",
      loadError: "We couldn't load the menu right now.",
      categories: {
        Hot: "Hot",
        Cold: "Cold",
        Breakfast: "Breakfast",
        "Sweet Pastries": "Sweet Pastries",
        "Savoury Pastries": "Savoury Pastries",
      },
    },
    locations: {
      eyebrow: "Two rooms in Riga",
      title: "Locations",
      loading: "Loading locations…",
      loadError: "We couldn't load the locations.",
      hoursError: "We couldn't load the opening hours.",
      openNow: "Open now",
      closed: "Closed",
      getDirections: "Get directions",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    reviews: {
      eyebrow: "Kind words, shared slowly",
      title: "Notes from our tables",
      starsOutOfFive: "out of 5 stars",
      demoReview: "Fictional demo review",
      communityEyebrow: "Community favorites",
      communityTitle: "Loved by creators",
      communityIntro:
        "A meeting place for the people shaping Riga’s thoughtful, independent culture.",
      creatorImageAlt: "Fictional Riga creator enjoying coffee:",
    },
    reservation: {
      receivedTitle: "Reservation received",
      receivedDescription:
        "Thank you, your table request has been sent. We'll confirm your reservation by email shortly.",
      done: "Done",
      title: "Reserve a table",
      description:
        "Tell us when you'd like to visit and we'll set a table aside for you.",
      name: "Name",
      fullNamePlaceholder: "Your full name",
      email: "Email",
      phone: "Phone",
      location: "Location",
      loadingLocations: "Loading locations...",
      chooseCafe: "Choose a café",
      noLocations: "No locations are currently available.",
      date: "Date",
      time: "Time",
      checkingTimes: "Checking times...",
      chooseTime: "Choose a time",
      booked: "Booked",
      checkingAvailableTimes: "Checking available times...",
      noTimes: "No reservation times are available for this date.",
      guests: "Guests",
      sending: "Sending your reservation…",
      confirm: "Confirm reservation",
      locationsError: "We couldn't load the locations. Please try again.",
      availabilityError:
        "We couldn't check availability right now. Please try again.",
      nameRequired: "Please enter your name.",
      emailRequired: "Please enter your email.",
      emailInvalid: "Please enter a valid email address.",
      phoneRequired: "Please enter your phone number.",
      phoneInvalid: "Please enter exactly 8 digits.",
      locationRequired: "Please choose a location.",
      dateRequired: "Please choose a date.",
      datePast: "Please choose a date that is not in the past.",
      timeRequired: "Please choose a time.",
      timeUnavailable: "This reservation time is no longer available.",
      guestsRequired: "Please enter the number of guests.",
      guestsInvalid: "Please enter a number of guests from 1 to 8.",
      slotTaken:
        "That time was just booked by another guest. Please choose another available time.",
      saveError:
        "We couldn't save your reservation just now. Please try again in a moment.",
      privacyNotice:
        "We use your personal data to manage your reservation and contact you about it.",
      privacyPolicy: "Privacy Policy",
    },
    story: {
      eyebrow: "Our approach",
      title: "Coffee, crafted with intention.",
      closing: "Sourced thoughtfully. Served warmly.",
    },
    contacts: {
      eyebrow: "Say hello",
      title: "Contacts",
      intro:
        "Questions, collaborations, or just want to say hello? We’d love to hear from you.",
      website: "Website",
    },
    footer: {
      rights: "All rights reserved.",
      demo: "Fictional concept for portfolio presentation.",
      privacy: "Privacy Policy",
    },
    common: {
      seeOpeningHours: "See opening hours",
      weekdays: "Mon–Fri",
    },
  },
  lv: {
    nav: {
      menu: "Ēdienkarte",
      locations: "Lokācijas",
      reviews: "Atsauksmes",
      contacts: "Kontakti",
      reserve: "Rezervēt galdiņu",
    },
    hero: {
      eyebrow: "Specializētā kafija · Rīga",
      viewMenu: "Skatīt ēdienkarti",
      findLocation: "Atrast lokāciju",
      scrollLabel: "Ritināt līdz sezonas piedāvājumam",
    },
    favorites: {
      eyebrow: "Šobrīd aktuāls",
      title: "Sezonas piedāvājums",
    },
    menu: {
      eyebrow: "Gatavots visas dienas garumā",
      title: "Ēdienkarte",
      intro:
        "Espresso klasika, sezonālas idejas un ēdieni nesteidzīgiem rītiem.",
      categoriesLabel: "Ēdienkartes kategorijas",
      loading: "Ielādē ēdienkarti…",
      loadError: "Pašlaik neizdevās ielādēt ēdienkarti.",
      categories: {
        Hot: "Karstie dzērieni",
        Cold: "Aukstie dzērieni",
        Breakfast: "Brokastis",
        "Sweet Pastries": "Saldie konditorejas izstrādājumi",
        "Savoury Pastries": "Sāļie konditorejas izstrādājumi",
      },
    },
    locations: {
      eyebrow: "Divas vietas Rīgā",
      title: "Lokācijas",
      loading: "Ielādē lokācijas…",
      loadError: "Neizdevās ielādēt lokācijas.",
      hoursError: "Neizdevās ielādēt darba laiku.",
      openNow: "Atvērts",
      closed: "Slēgts",
      getDirections: "Saņemt norādes",
      days: ["P", "O", "T", "C", "Pk", "S", "Sv"],
    },
    reviews: {
      eyebrow: "Silti vārdi, nesteidzīgi dalīti",
      title: "Atsauksmes no mūsu galdiņiem",
      starsOutOfFive: "no 5 zvaigznēm",
      demoReview: "Izdomāta demonstrācijas atsauksme",
      communityEyebrow: "Kopienas favorīti",
      communityTitle: "Radītāju iecienīta vieta",
      communityIntro:
        "Tikšanās vieta cilvēkiem, kuri veido Rīgas pārdomāto un neatkarīgo kultūru.",
      creatorImageAlt: "Izdomāts Rīgas satura veidotājs bauda kafiju:",
    },
    reservation: {
      receivedTitle: "Rezervācija saņemta",
      receivedDescription:
        "Paldies! Jūsu galdiņa rezervācijas pieprasījums ir nosūtīts. Drīzumā apstiprināsim rezervāciju e-pastā.",
      done: "Gatavs",
      title: "Rezervēt galdiņu",
      description:
        "Norādiet, kad vēlaties mūs apmeklēt, un mēs rezervēsim jums galdiņu.",
      name: "Vārds",
      fullNamePlaceholder: "Jūsu vārds un uzvārds",
      email: "E-pasts",
      phone: "Tālrunis",
      location: "Lokācija",
      loadingLocations: "Ielādē lokācijas...",
      chooseCafe: "Izvēlieties kafejnīcu",
      noLocations: "Pašlaik nav pieejamu lokāciju.",
      date: "Datums",
      time: "Laiks",
      checkingTimes: "Pārbauda laikus...",
      chooseTime: "Izvēlieties laiku",
      booked: "Aizņemts",
      checkingAvailableTimes: "Pārbauda pieejamos laikus...",
      noTimes: "Šajā datumā nav pieejamu rezervācijas laiku.",
      guests: "Viesi",
      sending: "Nosūta rezervāciju…",
      confirm: "Apstiprināt rezervāciju",
      locationsError: "Neizdevās ielādēt lokācijas. Lūdzu, mēģiniet vēlreiz.",
      availabilityError:
        "Pašlaik neizdevās pārbaudīt pieejamību. Lūdzu, mēģiniet vēlreiz.",
      nameRequired: "Lūdzu, ievadiet savu vārdu.",
      emailRequired: "Lūdzu, ievadiet savu e-pastu.",
      emailInvalid: "Lūdzu, ievadiet derīgu e-pasta adresi.",
      phoneRequired: "Lūdzu, ievadiet savu tālruņa numuru.",
      phoneInvalid: "Lūdzu, ievadiet tieši 8 ciparus.",
      locationRequired: "Lūdzu, izvēlieties lokāciju.",
      dateRequired: "Lūdzu, izvēlieties datumu.",
      datePast: "Lūdzu, izvēlieties datumu, kas nav pagātnē.",
      timeRequired: "Lūdzu, izvēlieties laiku.",
      timeUnavailable: "Šis rezervācijas laiks vairs nav pieejams.",
      guestsRequired: "Lūdzu, ievadiet viesu skaitu.",
      guestsInvalid: "Lūdzu, ievadiet viesu skaitu no 1 līdz 8.",
      slotTaken:
        "Šo laiku tikko rezervēja cits viesis. Lūdzu, izvēlieties citu pieejamu laiku.",
      saveError:
        "Pašlaik neizdevās saglabāt rezervāciju. Lūdzu, pēc brīža mēģiniet vēlreiz.",
      privacyNotice:
        "Mēs izmantojam jūsu personas datus, lai pārvaldītu rezervāciju un sazinātos ar jums par to.",
      privacyPolicy: "Privātuma politika",
    },
    story: {
      eyebrow: "Mūsu pieeja",
      title: "Kafija, kas radīta ar rūpību.",
      closing: "Rūpīgi izvēlēts. Sirsnīgi pasniegts.",
    },
    contacts: {
      eyebrow: "Sazinies ar mums",
      title: "Kontakti",
      intro:
        "Jautājumi, sadarbības piedāvājumi vai vienkārši vēlies sasveicināties? Priecāsimies no Tevis dzirdēt.",
      website: "Mājaslapa",
    },
    footer: {
      rights: "Visas tiesības aizsargātas.",
      demo: "Izdomāta koncepcija portfolio prezentācijai.",
      privacy: "Privātuma politika",
    },
    common: {
      seeOpeningHours: "Skatīt darba laiku",
      weekdays: "P–Pk",
    },
  },
} as const;

type DeepString<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends readonly string[]
      ? readonly string[]
      : DeepString<T[K]>;
};

export type TranslationDictionary = DeepString<
  (typeof translations)["en"]
>;
