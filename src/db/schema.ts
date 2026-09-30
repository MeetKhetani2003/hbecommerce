import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  numeric,
  jsonb,
} from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------ */
/* Catalog                                                             */
/* ------------------------------------------------------------------ */

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull().default(""),
  description: text("description").notNull().default(""),
  image: text("image").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  sku: text("sku").notNull().unique(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  brand: text("brand").notNull().default("HB Lifecare"),
  categorySlug: text("category_slug").notNull(),
  shortDescription: text("short_description").notNull().default(""),
  description: text("description").notNull().default(""),
  image: text("image").notNull().default(""),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  // Prices stored in whole rupees. Placeholder pricing — CMS-editable.
  price: integer("price").notNull().default(0),
  compareAtPrice: integer("compare_at_price"),
  gstRate: numeric("gst_rate", { precision: 5, scale: 2 }).notNull().default("12"),
  hsnCode: text("hsn_code").notNull().default(""),
  stock: integer("stock").notNull().default(0),
  rating: numeric("rating", { precision: 3, scale: 2 }).notNull().default("0"),
  reviewCount: integer("review_count").notNull().default(0),
  badges: jsonb("badges").$type<string[]>().notNull().default([]),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  ingredients: jsonb("ingredients").$type<string[]>().notNull().default([]),
  usage: text("usage").notNull().default(""),
  benefits: jsonb("benefits").$type<string[]>().notNull().default([]),
  shippingInfo: text("shipping_info").notNull().default(""),
  returnInfo: text("return_info").notNull().default(""),
  featured: boolean("featured").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/* Services & bookings                                                 */
/* ------------------------------------------------------------------ */

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  sku: text("sku").notNull().unique(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  shortDescription: text("short_description").notNull().default(""),
  description: text("description").notNull().default(""),
  duration: integer("duration").notNull().default(45),
  // 0 means "price on consultation" — CMS-editable
  price: integer("price").notNull().default(0),
  serviceType: text("service_type").notNull().default("IN_CLINIC"), // IN_CLINIC | VIRTUAL
  practitioner: text("practitioner").notNull().default("Dr. Sanjeev Jagdishma Vashisht"),
  bookingEnabled: boolean("booking_enabled").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  serviceId: integer("service_id").notNull(),
  serviceTitle: text("service_title").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().default(""),
  phone: text("phone").notNull(),
  preferredDate: text("preferred_date").notNull(),
  preferredTime: text("preferred_time").notNull(),
  notes: text("notes").notNull().default(""),
  // Consultation-to-product workflow status
  status: text("status").notNull().default("PENDING_PRACTITIONER_REVIEW"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/* Users & auth                                                        */
/* ------------------------------------------------------------------ */

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull().default(""),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("customer"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  token: text("token").notNull().unique(),
  userId: integer("user_id").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const addresses = pgTable("addresses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  label: text("label").notNull().default("Home"),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  line1: text("line1").notNull(),
  line2: text("line2").notNull().default(""),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pincode: text("pincode").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/* Orders                                                              */
/* ------------------------------------------------------------------ */

export type OrderAddress = {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
};

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  userId: integer("user_id"),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  customerName: text("customer_name").notNull(),
  shippingAddress: jsonb("shipping_address").$type<OrderAddress>().notNull(),
  subtotal: integer("subtotal").notNull(),
  discount: integer("discount").notNull().default(0),
  gst: integer("gst").notNull(),
  // CGST/SGST for Punjab, IGST otherwise — computed server-side
  gstBreakdown: jsonb("gst_breakdown")
    .$type<{ cgst: number; sgst: number; igst: number }>()
    .notNull()
    .default({ cgst: 0, sgst: 0, igst: 0 }),
  shipping: integer("shipping").notNull().default(0),
  total: integer("total").notNull(),
  paymentMethod: text("payment_method").notNull().default("COD"),
  paymentStatus: text("payment_status").notNull().default("PENDING"),
  orderStatus: text("order_status").notNull().default("PLACED"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  productName: text("product_name").notNull(),
  productImage: text("product_image").notNull().default(""),
  unitPrice: integer("unit_price").notNull(),
  quantity: integer("quantity").notNull(),
  gstRate: numeric("gst_rate", { precision: 5, scale: 2 }).notNull().default("12"),
  lineTotal: integer("line_total").notNull(),
});

/* ------------------------------------------------------------------ */
/* Content (CMS-editable)                                              */
/* ------------------------------------------------------------------ */

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  productOrService: text("product_or_service").notNull(),
  rating: integer("rating").notNull().default(5),
  review: text("review").notNull(),
  verified: boolean("verified").notNull().default(false),
  // Placeholder testimonials are shown with a "sample" marker until
  // the business supplies real, approved customer reviews.
  isPlaceholder: boolean("is_placeholder").notNull().default(true),
  isActive: boolean("is_active").notNull().default(true),
});

export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().default(""),
  phone: text("phone").notNull().default(""),
  subject: text("subject").notNull().default(""),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Simple key/value settings so business admins can edit contact info,
// WhatsApp number, disclaimers, GST config etc. without code changes.
export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});
