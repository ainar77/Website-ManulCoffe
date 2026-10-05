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
