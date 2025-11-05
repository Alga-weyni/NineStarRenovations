import { sql } from "drizzle-orm";
import { pgTable, varchar, text, boolean, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const requests = pgTable("requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: varchar("type", { length: 20 }).notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  address: text("address").notNull(),
  unit: varchar("unit", { length: 50 }), // tenant only
  company: varchar("company", { length: 255 }), // landlord only
  requestType: varchar("request_type", { length: 50 }).notNull(),
  preferredDateTime: varchar("preferred_date_time", { length: 100 }), // landlord only
  accessInstructions: text("access_instructions"), // landlord only
  budgetRange: varchar("budget_range", { length: 50 }), // landlord only
  entryPermission: varchar("entry_permission", { length: 50 }), // tenant only
  description: text("description").notNull(),
  files: text("files"), // JSON string array or null
  consent: boolean("consent").notNull(),
  status: varchar("status", { length: 20 }).default("new"),
  ticketId: varchar("ticket_id", { length: 20 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertRequestSchema = createInsertSchema(requests).omit({
  id: true,
  ticketId: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export const landlordRequestSchema = insertRequestSchema.extend({
  type: z.literal("landlord"),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Property address is required"),
  company: z.string().optional(),
  requestType: z.enum(["emergency", "maintenance", "turnover", "renovation", "other"]),
  preferredDateTime: z.string().optional(),
  accessInstructions: z.string().optional(),
  budgetRange: z.enum(["under-500", "500-1000", "1000-2500", "2500-5000", "over-5000"]).optional(),
  description: z.string().min(1, "Description is required").max(1000, "Description too long"),
  files: z.string().optional(),
  consent: z.boolean().refine(val => val === true, "Consent is required"),
}).omit({ unit: true, entryPermission: true });

export const tenantRequestSchema = insertRequestSchema.extend({
  type: z.literal("tenant"),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Property address is required"),
  unit: z.string().min(1, "Unit number is required"),
  requestType: z.enum(["emergency", "plumbing", "electrical", "heating", "appliance", "maintenance", "other"]),
  entryPermission: z.enum(["yes-anytime", "yes-scheduled", "emergency-only", "no"]),
  description: z.string().min(1, "Description is required").max(1000, "Description too long"),
  files: z.string().optional(),
  consent: z.boolean().refine(val => val === true, "Consent is required"),
}).omit({ company: true, preferredDateTime: true, accessInstructions: true, budgetRange: true });

export type InsertRequest = z.infer<typeof insertRequestSchema>;
export type Request = typeof requests.$inferSelect;
export type LandlordRequest = z.infer<typeof landlordRequestSchema>;
export type TenantRequest = z.infer<typeof tenantRequestSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;
