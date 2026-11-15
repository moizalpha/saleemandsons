export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  compareAt?: number;
  badge?: string;
  art: "carryall" | "journal" | "tray" | "weekender";
  colors: string[];
  material: string;
};

// Demonstration inventory only. Replace names, prices, materials and images with the
// actual Saleem & Sons catalogue before launch.
export const products: Product[] = [
  {
    id: "carryall-01",
    name: "The Heritage Carryall",
    category: "Carry",
    description: "A considered everyday companion, shaped in supple full-grain leather with thoughtful, lasting details.",
    price: 18900,
    compareAt: 21900,
    badge: "Signature",
    art: "carryall",
    colors: ["Cognac", "Espresso", "Olive"],
    material: "Full-grain leather",
  },
  {
    id: "field-notes-02",
    name: "The Field Journal",
    category: "Workspace",
    description: "A tactile home for good ideas, finished with a leather wrap and archival-quality pages.",
    price: 5400,
    art: "journal",
    colors: ["Tobacco", "Ink", "Sand"],
    material: "Leather & paper",
  },
  {
    id: "desk-tray-03",
    name: "The Foundry Tray",
    category: "Objects",
    description: "A quiet landing place for the things you reach for every day. Cast, finished and made to patina.",
    price: 7800,
    art: "tray",
    colors: ["Antique brass", "Dark bronze"],
    material: "Cast metal",
  },
  {
    id: "weekender-04",
    name: "The Weekender 48H",
    category: "Travel",
    description: "An uncomplicated travel piece with generous space, sturdy handles and a considered silhouette.",
    price: 26500,
    badge: "Travel edit",
    art: "weekender",
    colors: ["Walnut", "Black"],
    material: "Waxed canvas & leather",
  },
];

export const categories = [
  { name: "Carry", note: "Made for the everyday", number: "01", art: "carryall" as const },
  { name: "Workspace", note: "Room for good ideas", number: "02", art: "journal" as const },
  { name: "Objects", note: "The details matter", number: "03", art: "tray" as const },
  { name: "Travel", note: "Go a little further", number: "04", art: "weekender" as const },
];

export const timeline = [
  {
    year: "FOUNDATION",
    eyebrow: "Start with what matters",
    title: "A promise made with purpose.",
    body: "Every lasting collection begins with a point of view: choose materials honestly, respect the work behind each piece and make usefulness the first measure.",
  },
  {
    year: "EVOLUTION",
    eyebrow: "A wider point of view",
    title: "Tradition, with room to evolve.",
    body: "Function leads; thoughtful proportions and quiet details follow. The goal isn't more for its own sake, but a collection that feels coherent, useful and considered.",
  },
  {
    year: "NEXT",
    eyebrow: "The next chapter",
    title: "Made for the life ahead.",
    body: "A modern point of view, grounded in quality, clarity and care. Every detail is an invitation to buy with intention and keep what you choose.",
  },
];

export const formatPrice = (price: number, currency: "PKR" | "USD") => {
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price / 280);
  }
  return `Rs. ${new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 }).format(price)}`;
};
