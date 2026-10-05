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
      demoNotice:
        "All contact details and social profiles shown are fictional demo content.",
    },
    footer: {
      description:
        "Specialty coffee and thoughtful food, made for unhurried moments in Riga.",
      rights: "All rights reserved.",
      demo: "Fictional concept for portfolio presentation.",
    },
    common: {
      seeOpeningHours: "See opening hours",
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
      demoNotice:
        "Visa norādītā kontaktinformācija un sociālo tīklu profili ir izdomāts demonstrācijas saturs.",
    },
    footer: {
      description:
        "Specializētā kafija un pārdomāts ēdiens nesteidzīgiem mirkļiem Rīgā.",
      rights: "Visas tiesības aizsargātas.",
      demo: "Izdomāta koncepcija portfolio prezentācijai.",
    },
    common: {
      seeOpeningHours: "Skatīt darba laiku",
    },
  },
} as const;

export type TranslationDictionary = (typeof translations)["en"];
