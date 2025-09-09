import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const requests = sqliteTable("requests", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  type: text("type", { enum: ["landlord", "tenant"] }).notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  unit: text("unit"), // tenant only
  company: text("company"), // landlord only
  requestType: text("request_type").notNull(),
  preferredDateTime: text("preferred_date_time"), // landlord only
  accessInstructions: text("access_instructions"), // landlord only
  budgetRange: text("budget_range"), // landlord only
  entryPermission: text("entry_permission"), // tenant only
  description: text("description").notNull(),
  files: text("files"), // JSON string array or null
  consent: integer("consent", { mode: "boolean" }).notNull(),
  status: text("status", { enum: ["new", "in-progress", "closed"] }).default("new"),
  ticketId: text("ticket_id").notNull(),
  createdAt: text("created_at").default(sql`datetime('now')`),
  updatedAt: text("updated_at").default(sql`datetime('now')`),
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
  files: z.union([z.array(z.string()), z.string()]).optional(),
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
  files: z.union([z.array(z.string()), z.string()]).optional(),
  consent: z.boolean().refine(val => val === true, "Consent is required"),
}).omit({ company: true, preferredDateTime: true, accessInstructions: true, budgetRange: true });

export type InsertRequest = z.infer<typeof insertRequestSchema>;
export type Request = typeof requests.$inferSelect;
export type LandlordRequest = z.infer<typeof landlordRequestSchema>;
export type TenantRequest = z.infer<typeof tenantRequestSchema>;
