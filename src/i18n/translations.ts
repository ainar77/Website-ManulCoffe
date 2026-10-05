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
  [K in keyof T]: T[K] extends string ? string : DeepString<T[K]>;
};

export type TranslationDictionary = DeepString<
  (typeof translations)["en"]
>;
