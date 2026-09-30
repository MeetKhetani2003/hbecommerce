import type { Product, Category, Service } from "./types";

const mockProducts: Product[] = [
  {
    id: 1,
    sku: "CR-500-01",
    slug: "cr-500-drops",
    name: "CR 500 Drops",
    brand: "HB Lifecare",
    categorySlug: "herbal-care",
    shortDescription: "Our flagship herbal formulation for daily wellness.",
    description: "Developed under practitioner guidance for convenient daily use as part of a holistic wellness routine.",
    image: "/images/cr500.jpg",
    images: ["/images/cr500.jpg"],
    price: 1499,
    compareAtPrice: 1999,
    gstRate: "12%",
    hsnCode: "30049011",
    stock: 150,
    rating: "4.8",
    reviewCount: 124,
    badges: ["Best Seller"],
    tags: ["wellness", "daily", "drops"],
    ingredients: ["Ashwagandha", "Tulsi", "Giloy", "Ginger"],
    usage: "Take 10 drops twice a day with warm water.",
    benefits: ["Boosts immunity", "Reduces stress", "Enhances energy levels"],
    shippingInfo: "Ships within 24 hours.",
    returnInfo: "101% Money Back Guarantee*",
    featured: true,
    isActive: true,
  },
  {
    id: 2,
    sku: "ECO-BB-01",
    slug: "eco-bamboo-brush",
    name: "Eco Bamboo Toothbrush",
    brand: "Herbivia Botanica",
    categorySlug: "eco-hygiene",
    shortDescription: "Sustainable bamboo toothbrush with BPA-free bristles.",
    description: "Make a better choice for the planet with our biodegradable bamboo toothbrush. Soft bristles for gentle cleaning.",
    image: "/images/bamboo.jpg",
    images: ["/images/bamboo.jpg"],
    price: 199,
    compareAtPrice: 249,
    gstRate: "18%",
    hsnCode: "96032100",
    stock: 500,
    rating: "4.9",
    reviewCount: 89,
    badges: ["Eco Friendly"],
    tags: ["bamboo", "hygiene", "sustainable"],
    ingredients: ["Bamboo", "Nylon-4 bristles"],
    usage: "Use twice daily. Replace every 3 months.",
    benefits: ["Biodegradable handle", "BPA-free", "Gentle on gums"],
    shippingInfo: "Ships within 24 hours.",
    returnInfo: "7 days return policy",
    featured: true,
    isActive: true,
  },
  {
    id: 3,
    sku: "HERB-CAP-01",
    slug: "ayurvedic-capsules",
    name: "Ayurvedic Wellness Capsules",
    brand: "HB Lifecare",
    categorySlug: "herbal-care",
    shortDescription: "Traditional formulation for overall vitality.",
    description: "A potent blend of ancient herbs packed into convenient capsules for your daily wellness needs.",
    image: "/images/capsules.jpg",
    images: ["/images/capsules.jpg"],
    price: 899,
    compareAtPrice: null,
    gstRate: "12%",
    hsnCode: "30049011",
    stock: 200,
    rating: "4.7",
    reviewCount: 56,
    badges: ["New"],
    tags: ["capsules", "vitality"],
    ingredients: ["Shilajit", "Safed Musli", "Gokshura"],
    usage: "Take 1 capsule twice daily after meals.",
    benefits: ["Improves stamina", "Supports joint health"],
    shippingInfo: "Ships within 24 hours.",
    returnInfo: "7 days return policy",
    featured: true,
    isActive: true,
  },
  {
    id: 4,
    sku: "HERB-OIL-01",
    slug: "therapeutic-herbal-oil",
    name: "Therapeutic Herbal Oil",
    brand: "HB Lifecare",
    categorySlug: "wellness",
    shortDescription: "Soothing massage oil for muscle relief.",
    description: "An authentic ayurvedic massage oil that helps relieve muscle stiffness and promotes relaxation.",
    image: "/images/oil.jpg",
    images: ["/images/oil.jpg"],
    price: 549,
    compareAtPrice: 699,
    gstRate: "12%",
    hsnCode: "33049990",
    stock: 120,
    rating: "4.6",
    reviewCount: 42,
    badges: [],
    tags: ["oil", "massage", "relief"],
    ingredients: ["Sesame Oil", "Mahanarayan Taila", "Eucalyptus"],
    usage: "Massage gently on affected areas.",
    benefits: ["Relieves muscle pain", "Improves blood circulation"],
    shippingInfo: "Ships within 24 hours.",
    returnInfo: "7 days return policy",
    featured: true,
    isActive: true,
  },
  {
    id: 5,
    sku: "SKIN-CRM-01",
    slug: "radiance-skincare-cream",
    name: "Radiance Herbal Skincare Cream",
    brand: "HB Lifecare",
    categorySlug: "herbal-care",
    shortDescription: "Natural glow cream enriched with botanical extracts.",
    description: "Nourish your skin with the goodness of nature. Free from harsh chemicals.",
    image: "/images/skincare.jpg",
    images: ["/images/skincare.jpg"],
    price: 749,
    compareAtPrice: 899,
    gstRate: "18%",
    hsnCode: "33049910",
    stock: 80,
    rating: "4.5",
    reviewCount: 31,
    badges: [],
    tags: ["skincare", "glow", "natural"],
    ingredients: ["Aloe Vera", "Sandalwood", "Turmeric"],
    usage: "Apply evenly on face and neck.",
    benefits: ["Brightens skin", "Reduces blemishes", "Hydrates"],
    shippingInfo: "Ships within 24 hours.",
    returnInfo: "7 days return policy",
    featured: true,
    isActive: true,
  },
  {
    id: 6,
    sku: "SYRUP-01",
    slug: "immune-boost-syrup",
    name: "Immune Boost Syrup",
    brand: "HB Lifecare",
    categorySlug: "wellness",
    shortDescription: "Tasty herbal syrup to keep infections at bay.",
    description: "A comprehensive formulation suitable for all age groups to support respiratory and immune health.",
    image: "/images/syrup.jpg",
    images: ["/images/syrup.jpg"],
    price: 349,
    compareAtPrice: 399,
    gstRate: "12%",
    hsnCode: "30049011",
    stock: 300,
    rating: "4.8",
    reviewCount: 77,
    badges: ["Popular"],
    tags: ["syrup", "immunity", "family"],
    ingredients: ["Tulsi", "Mulethi", "Honey", "Vasaka"],
    usage: "1-2 teaspoons twice daily.",
    benefits: ["Soothes throat", "Boosts immunity"],
    shippingInfo: "Ships within 24 hours.",
    returnInfo: "7 days return policy",
    featured: true,
    isActive: true,
  },
];

const mockCategories: Category[] = [
  {
    id: 1,
    slug: "herbal-care",
    name: "Herbal Care",
    tagline: "Traditional Formulations",
    description: "Explore our range of traditional herbal formulations for vitality.",
    image: "/images/skincare.jpg",
    sortOrder: 1,
  },
  {
    id: 2,
    slug: "eco-hygiene",
    name: "Eco Hygiene",
    tagline: "Sustainable Essentials",
    description: "Better choices for you & the planet.",
    image: "/images/bamboo.jpg",
    sortOrder: 2,
  },
  {
    id: 3,
    slug: "wellness",
    name: "Wellness",
    tagline: "Everyday Wellbeing",
    description: "Products designed to seamlessly integrate into your daily wellness routine.",
    image: "/images/capsules.jpg",
    sortOrder: 3,
  }
];

export async function getAllProducts(): Promise<Product[]> {
  return mockProducts;
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  return mockProducts.filter(p => p.featured).slice(0, limit);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return mockProducts.find(p => p.slug === slug) || null;
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  return mockProducts.filter(p => p.categorySlug === categorySlug);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  return mockProducts.filter(p => p.slug !== product.slug).slice(0, limit);
}

export async function getCategories(): Promise<Category[]> {
  return mockCategories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return mockCategories.find(c => c.slug === slug) || null;
}

export async function getServices(): Promise<Service[]> {
  return [
    {
      id: 1,
      sku: "SRV-01",
      slug: "advance-acupressure-therapy",
      title: "Advance Acupressure Therapy",
      shortDescription: "In-clinic wellness consultations at the Faridkot centre.",
      description: "Experience professional acupressure therapy designed to align your energy and alleviate physical discomfort.",
      duration: 60,
      price: 1500,
      serviceType: "In-Clinic",
      practitioner: "Dr. Sanjeev Jagdishma Vashisht",
      bookingEnabled: true,
      sortOrder: 1,
    }
  ];
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const services = await getServices();
  return services.find(s => s.slug === slug) || null;
}

export async function getFaqs() {
  return [
    { question: "What is CR 500 Drops?", answer: "It is our flagship herbal formulation developed for daily wellness." },
    { question: "Are your products eco-friendly?", answer: "Yes, our Herbivia Botanica range features sustainable and biodegradable hygiene essentials." },
    { question: "How can I book a consultation?", answer: "You can book a consultation directly through our Services page for either in-clinic or remote sessions." }
  ];
}

export async function getTestimonials() {
  return [
    {
      id: 1,
      customerName: "Rahul Sharma",
      rating: 5,
      review: "The CR 500 drops have significantly improved my energy levels throughout the day.",
      productOrService: "CR 500 Drops",
      verified: true,
      isPlaceholder: false
    },
    {
      id: 2,
      customerName: "Priya Singh",
      rating: 5,
      review: "Absolutely love the bamboo toothbrushes! Soft on the gums and great for the environment.",
      productOrService: "Eco Bamboo Toothbrush",
      verified: true,
      isPlaceholder: false
    }
  ];
}
