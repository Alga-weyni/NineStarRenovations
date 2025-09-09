import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { requests, type Request, type InsertRequest } from "@shared/schema";
import { eq, desc, and, gte, lte } from "drizzle-orm";
import { randomUUID } from "crypto";
import * as fs from "fs";
import * as path from "path";

const dbPath = path.join(process.cwd(), "storage", "requests.db");

// Ensure storage directory exists
const storageDir = path.dirname(dbPath);
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

const sqlite = new Database(dbPath);
const db = drizzle(sqlite);

// Initialize database with schema
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS requests (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    type TEXT NOT NULL CHECK (type IN ('landlord', 'tenant')),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    unit TEXT,
    company TEXT,
    request_type TEXT NOT NULL,
    preferred_date_time TEXT,
    access_instructions TEXT,
    budget_range TEXT,
    entry_permission TEXT,
    description TEXT NOT NULL,
    files TEXT,
    consent INTEGER NOT NULL CHECK (consent IN (0, 1)),
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in-progress', 'closed')),
    ticket_id TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )
`);

export interface IStorage {
  createRequest(request: Omit<InsertRequest, 'ticketId'>): Promise<Request>;
  getRequest(id: string): Promise<Request | undefined>;
  getRequestByTicketId(ticketId: string): Promise<Request | undefined>;
  getAllRequests(filters?: {
    type?: 'landlord' | 'tenant' | 'all';
    dateFrom?: string;
    dateTo?: string;
  }): Promise<Request[]>;
  updateRequestStatus(id: string, status: 'new' | 'in-progress' | 'closed'): Promise<void>;
}

export class SqliteStorage implements IStorage {
  async createRequest(requestData: Omit<InsertRequest, 'ticketId'>): Promise<Request> {
    const ticketId = `9SR-${Date.now().toString(36).toUpperCase()}-${randomUUID().slice(0, 8).toUpperCase()}`;
    
    const request = {
      ...requestData,
      ticketId,
      files: Array.isArray(requestData.files) ? JSON.stringify(requestData.files) : 
             requestData.files ? requestData.files : null,
    };

    const result = await db.insert(requests).values(request).returning();
    return result[0];
  }

  async getRequest(id: string): Promise<Request | undefined> {
    const result = await db.select().from(requests).where(eq(requests.id, id));
    return result[0];
  }

  async getRequestByTicketId(ticketId: string): Promise<Request | undefined> {
    const result = await db.select().from(requests).where(eq(requests.ticketId, ticketId));
    return result[0];
  }

  async getAllRequests(filters?: {
    type?: 'landlord' | 'tenant' | 'all';
    dateFrom?: string;
    dateTo?: string;
  }): Promise<Request[]> {
    const conditions = [];
    
    if (filters?.type && filters.type !== 'all') {
      conditions.push(eq(requests.type, filters.type));
    }
    
    if (filters?.dateFrom) {
      conditions.push(gte(requests.createdAt, filters.dateFrom));
    }
    
    if (filters?.dateTo) {
      conditions.push(lte(requests.createdAt, filters.dateTo));
    }
    
    if (conditions.length > 0) {
      return await db.select().from(requests)
        .where(and(...conditions))
        .orderBy(desc(requests.createdAt));
    }
    
    return await db.select().from(requests).orderBy(desc(requests.createdAt));
  }

  async updateRequestStatus(id: string, status: 'new' | 'in-progress' | 'closed'): Promise<void> {
    await db.update(requests).set({ 
      status, 
      updatedAt: new Date().toISOString() 
    }).where(eq(requests.id, id));
  }
}

export const storage = new SqliteStorage();
