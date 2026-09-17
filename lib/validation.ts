import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(120),
  phone: z.string().trim().min(7, "Phone number is too short").max(30),
  email: z.string().trim().email("Invalid email address"),
  destination: z.string().trim().max(60).optional().default(""),
  service: z.string().trim().max(80).optional().default(""),
  message: z.string().trim().max(2000).optional().default(""),
  // Honeypot field — real users never fill this in.
  company_website: z.string().max(0).optional().default(""),
});

export const newsletterSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const testimonialSchema = z.object({
  name: z.string().trim().min(2).max(120),
  program: z.string().trim().max(160).optional().default(""),
  university: z.string().trim().max(160).optional().default(""),
  country: z.string().trim().max(80).optional().default(""),
  flagCode: z.string().trim().max(5).optional().default(""),
  year: z.coerce.number().int().optional(),
  quote: z.string().trim().min(5).max(2000),
  avatar: z.string().trim().max(500).optional().default(""),
  rating: z.coerce.number().min(1).max(5).default(5),
  isFeatured: z.boolean().optional().default(false),
  order: z.coerce.number().optional().default(0),
});

// What a public visitor can submit — no isFeatured/order/approved (those
// are admin-only decisions), and includes an honeypot field.
export const publicTestimonialSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(120),
  email: z.string().trim().email("Invalid email address"),
  program: z.string().trim().max(160).optional().default(""),
  university: z.string().trim().max(160).optional().default(""),
  country: z.string().trim().max(80).optional().default(""),
  year: z.coerce.number().int().optional(),
  quote: z.string().trim().min(20, "Please share a bit more detail (at least 20 characters)").max(2000),
  avatar: z.string().trim().max(500).optional().default(""),
  rating: z.coerce.number().min(1).max(5).default(5),
  company_website: z.string().max(0).optional().default(""),
});

export const blogSchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z.string().trim().min(3).max(200).optional(),
  excerpt: z.string().trim().max(500).optional().default(""),
  content: z.string().trim().min(10),
  coverImage: z.string().trim().max(500).optional().default(""),
  author: z.string().trim().max(120).optional().default("Kingsland Abroad Team"),
  tags: z.array(z.string()).optional().default([]),
  published: z.boolean().optional().default(false),
});

export const leadStatusSchema = z.object({
  status: z.enum(["new", "contacted", "in-progress", "converted", "closed"]),
});
