export type Product = {
  id: number;
  sku: string;
  slug: string;
  name: string;
  brand: string;
  categorySlug: string;
  shortDescription: string;
  description: string;
  image: string;
  images: string[];
  price: number;
  compareAtPrice: number | null;
  gstRate: string;
  hsnCode: string;
  stock: number;
  rating: string;
  reviewCount: number;
  badges: string[];
  tags: string[];
  ingredients: string[];
  usage: string;
  benefits: string[];
  shippingInfo: string;
  returnInfo: string;
  featured: boolean;
  isActive: boolean;
};

export type Category = {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  sortOrder: number;
};

export type Service = {
  id: number;
  sku: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  duration: number;
  price: number;
  serviceType: string;
  practitioner: string;
  bookingEnabled: boolean;
  sortOrder: number;
};

export type CartLine = {
  productId: number;
  slug: string;
  name: string;
  image: string;
  price: number;
  compareAtPrice: number | null;
  gstRate: string;
  quantity: number;
  categorySlug: string;
};

export type WishlistItem = {
  productId: number;
  slug: string;
};

export const BRAND = {
  name: "HB Lifecare",
  sloganPa: "ਸਿਹਤਮੰਦ ਅਤੇ ਦਿਵਯਤਾ",
  sloganEn: "Health and Divinity",
  practitioner: "Dr. Sanjeev Jagdishma Vashisht",
  practitionerPa: "ਡਾ: ਸੰਜੀਵ ਜਗਦੀਸ਼ਮਾ ਵਸ਼ਿਸਟ",
  address: "Shop No. 46A, New Dana Mandi, Faridkot, Punjab, India",
  phones: ["75278-06146", "77105-13989"],
  headOffice: "91156-98677",
  gstin: "03AATFH0751Q1ZX",
  whatsapp: "917527806146",
  disclaimer:
    "Information on this website is provided for general informational and wellness purposes. Product information and traditional-use descriptions should not be interpreted as a substitute for professional medical diagnosis or treatment. Consult an appropriately qualified healthcare professional regarding medical conditions, medications, pregnancy, allergies, or other health concerns.",
} as const;
