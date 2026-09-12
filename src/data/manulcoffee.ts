export type MenuCategory = "Hot" | "Cold" | "Breakfast" | "Sweet Pastries" | "Savoury Pastries";

export type MenuItem = {
  name: string;
  description: string;
  price: string;
  category: MenuCategory;
  tag?: "Popular" | "New" | "Vegan" | "Vegetarian";
};

export const menuCategories: MenuCategory[] = [
  "Hot",
  "Cold",
  "Breakfast",
  "Sweet Pastries",
  "Savoury Pastries",
];

export const menuItems: MenuItem[] = [
  { name: "Espresso", description: "Bright, syrupy double shot", price: "€2.80", category: "Hot", tag: "Popular" },
  { name: "Americano", description: "Espresso lengthened with hot water", price: "€3.20", category: "Hot" },
  { name: "Cappuccino", description: "Espresso, steamed milk, fine foam", price: "€3.90", category: "Hot", tag: "Popular" },
  { name: "Flat White", description: "Double ristretto and silky milk", price: "€4.20", category: "Hot" },
  { name: "Caffè Latte", description: "Soft espresso with textured milk", price: "€4.30", category: "Hot" },
  { name: "Mocha", description: "Single-origin cacao and espresso", price: "€4.60", category: "Hot" },
  { name: "Matcha Latte", description: "Ceremonial matcha, milk of choice", price: "€4.80", category: "Hot", tag: "Vegetarian" },
  { name: "Iced Latte", description: "Espresso, cold milk and crystal ice", price: "€4.40", category: "Cold", tag: "Popular" },
  { name: "Cold Brew", description: "Eighteen-hour steep, chocolate finish", price: "€4.20", category: "Cold", tag: "Vegan" },
  { name: "Iced Matcha", description: "Ceremonial matcha over cold milk", price: "€4.90", category: "Cold" },
  { name: "Espresso Tonic", description: "Double espresso, tonic, citrus", price: "€4.70", category: "Cold", tag: "New" },
  { name: "Homemade Lemonade", description: "Lemon, verbena and sparkling water", price: "€4.20", category: "Cold", tag: "Vegan" },
  { name: "Avocado Toast", description: "Sourdough, avocado, herbs, soft egg", price: "€8.90", category: "Breakfast", tag: "Popular" },
  { name: "Eggs Benedict", description: "Poached eggs, brioche, brown butter hollandaise", price: "€10.50", category: "Breakfast" },
  { name: "Granola Bowl", description: "House granola, yoghurt, berries, honey", price: "€7.20", category: "Breakfast", tag: "Vegetarian" },
  { name: "Croissant Breakfast", description: "Croissant, egg, mature cheese, greens", price: "€8.40", category: "Breakfast" },
  { name: "Cinnamon Roll", description: "Cardamom dough and brown sugar glaze", price: "€4.10", category: "Sweet Pastries", tag: "Popular" },
  { name: "Almond Croissant", description: "Twice-baked with almond frangipane", price: "€4.50", category: "Sweet Pastries" },
  { name: "Chocolate Croissant", description: "Laminated pastry, dark chocolate", price: "€4.20", category: "Sweet Pastries" },
  { name: "Basque Cheesecake", description: "Burnished top, soft vanilla centre", price: "€5.80", category: "Sweet Pastries", tag: "New" },
  { name: "Carrot Cake", description: "Walnut, spice and cream cheese", price: "€5.50", category: "Sweet Pastries" },
  { name: "Ham & Cheese Croissant", description: "Smoked ham, Gruyère, Dijon", price: "€5.90", category: "Savoury Pastries" },
  { name: "Spinach Feta Pastry", description: "Baby spinach, feta and dill", price: "€5.40", category: "Savoury Pastries", tag: "Vegetarian" },
  { name: "Tomato Mozzarella Pastry", description: "Roasted tomato, mozzarella, basil", price: "€5.60", category: "Savoury Pastries", tag: "Vegetarian" },
];

export const favorites = [
  { name: "Cloud Cappuccino", description: "Our signature espresso with impossibly silky milk.", price: "€4.20", tag: "Popular" },
  { name: "Citrus Cold Brew", description: "Slow-steeped coffee, orange and house tonic.", price: "€4.80", tag: "Seasonal" },
  { name: "Almond Croissant", description: "Twice-baked each morning with rich frangipane.", price: "€4.50", tag: "Favorite" },
];

export const locations = [
  {
    name: "ManulCoffee Old Town",
    address: "Miesnieku iela 8, Riga, LV-1050",
    hours: { weekday: "08:00–20:00", weekend: "09:00–21:00" },
    description: "A quiet corner in the old city, framed by cobblestones and morning light.",
    mapUrl: "https://www.google.com/maps?q=Miesnieku%20iela%208%20Riga&output=embed",
    directionsUrl: "https://www.google.com/maps/search/?api=1&query=Miesnieku+iela+8+Riga",
  },
  {
    name: "ManulCoffee Centre",
    address: "Baznīcas iela 24, Riga, LV-1010",
    hours: { weekday: "07:30–20:00", weekend: "09:00–20:00" },
    description: "Our bright city room for working lunches, long conversations and a second cup.",
    mapUrl: "https://www.google.com/maps?q=Baznicas%20iela%2024%20Riga&output=embed",
    directionsUrl: "https://www.google.com/maps/search/?api=1&query=Baznicas+iela+24+Riga",
  },
];

export const reviews = [
  { name: "Elza K.", rating: 5, text: "Beautiful room, genuinely thoughtful coffee and the kindest team. The flat white is exceptional." },
  { name: "Mārtiņš L.", rating: 5, text: "My slow Saturday ritual. Excellent beans, calm music and pastries that are always worth arriving early for." },
  { name: "Sofia R.", rating: 5, text: "A warm, considered place that feels special without trying too hard. Loved the espresso tonic." },
  { name: "Tomass V.", rating: 4, text: "Careful service and a beautifully balanced filter coffee. An easy place to stay for one cup more." },
];

export const creators = [
  { name: "Mara Ozola", role: "Ceramic artist", quote: "My favourite table for sketching new forms — with a cappuccino close by." },
  { name: "Nils Bergs", role: "Photographer", quote: "The light, the people, the first espresso. ManulCoffee gets mornings right." },
  { name: "Lina Vītola", role: "Food writer", quote: "Quietly ambitious coffee and pastries with real personality." },
];