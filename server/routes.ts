import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { landlordRequestSchema, tenantRequestSchema } from "@shared/schema";
import { PDFGenerator } from "./services/pdfGenerator";
import { EmailService } from "./services/emailService";
import { createRateLimiter } from "./middleware/rateLimiter";
import { upload } from "./middleware/upload";
import { z } from "zod";
import path from "path";
import fs from "fs";

const rateLimiter = createRateLimiter();
const emailService = new EmailService();

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Static file serving for forms
  app.get("/forms/:filename", (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(process.cwd(), "public", "forms", filename);
    
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ error: "File not found" });
    }
  });

  // Generate blank PDFs on startup
  try {
    await PDFGenerator.generateBlankPDF('landlord');
    await PDFGenerator.generateBlankPDF('tenant');
  } catch (error) {
    console.error("Error generating blank PDFs:", error);
  }

  // Landlord request submission
  app.post("/api/requests/landlord", rateLimiter, upload.array('files', 3), async (req: Request, res) => {
    try {
      // Parse form data
      const formData = { ...req.body };
      if (formData.consent === 'true') formData.consent = true;
      if (formData.consent === 'false') formData.consent = false;
      
      // Add uploaded files
      const files = req.files as Express.Multer.File[] | undefined;
      const fileNames = files ? files.map(file => file.filename) : [];
      
      // Validate request data
      const validatedData = landlordRequestSchema.parse({
        ...formData,
        files: fileNames.length > 0 ? JSON.stringify(fileNames) : undefined
      });
      
      // Create request
      const request = await storage.createRequest(validatedData);
      
      // Generate PDF
      const pdfPath = await PDFGenerator.generateRequestPDF(request);
      
      // Send emails (don't fail if email sending fails)
      try {
        await Promise.all([
          emailService.sendOperationsNotification(request, pdfPath),
          emailService.sendAutoReply(request),
        ]);
      } catch (emailError) {
        console.error("Email sending failed (non-fatal):", emailError);
      }
      
      res.json({ 
        success: true, 
        ticketId: request.ticketId,
        message: "Request submitted successfully"
      });
      
    } catch (error) {
      console.error("Landlord request error:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Validation error", 
          details: error.errors 
        });
      }
      
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Tenant request submission
  app.post("/api/requests/tenant", rateLimiter, upload.array('files', 3), async (req: Request, res) => {
    try {
      // Parse form data
      const formData = { ...req.body };
      if (formData.consent === 'true') formData.consent = true;
      if (formData.consent === 'false') formData.consent = false;
      
      // Add uploaded files
      const files = req.files as Express.Multer.File[] | undefined;
      const fileNames = files ? files.map(file => file.filename) : [];
      
      // Validate request data
      const validatedData = tenantRequestSchema.parse({
        ...formData,
        files: fileNames.length > 0 ? JSON.stringify(fileNames) : undefined
      });
      
      // Create request
      const request = await storage.createRequest(validatedData);
      
      // Generate PDF
      const pdfPath = await PDFGenerator.generateRequestPDF(request);
      
      // Send emails (don't fail if email sending fails)
      try {
        await Promise.all([
          emailService.sendOperationsNotification(request, pdfPath),
          emailService.sendAutoReply(request),
        ]);
      } catch (emailError) {
        console.error("Email sending failed (non-fatal):", emailError);
      }
      
      res.json({ 
        success: true, 
        ticketId: request.ticketId,
        message: "Request submitted successfully"
      });
      
    } catch (error) {
      console.error("Tenant request error:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Validation error", 
          details: error.errors 
        });
      }
      
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Admin authentication middleware
  const requireAdminAuth = (req: any, res: any, next: any) => {
    const { password } = req.query;
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    
    if (password !== adminPassword) {
      return res.status(401).json({ error: "Invalid admin password" });
    }
    next();
  };

  // Admin: Get all requests
  app.get("/api/admin/requests", requireAdminAuth, async (req, res) => {
    try {
      const { type = 'all', date_from, date_to } = req.query as {
        type?: 'landlord' | 'tenant' | 'all';
        date_from?: string;
        date_to?: string;
      };
      
      const requests = await storage.getAllRequests({
        type,
        dateFrom: date_from,
        dateTo: date_to,
      });
      
      res.json(requests);
    } catch (error) {
      console.error("Admin requests error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Admin: Export CSV
  app.get("/api/admin/requests/export.csv", requireAdminAuth, async (req, res) => {
    try {
      const { type = 'all', date_from, date_to } = req.query as {
        type?: 'landlord' | 'tenant' | 'all';
        date_from?: string;
        date_to?: string;
      };
      
      const requests = await storage.getAllRequests({
        type,
        dateFrom: date_from,
        dateTo: date_to,
      });
      
      // Generate CSV
      const headers = [
        'ID', 'Type', 'Ticket ID', 'Name', 'Email', 'Phone', 'Address', 'Unit', 
        'Company', 'Request Type', 'Status', 'Created At', 'Description'
      ];
      
      const csvRows = [headers.join(',')];
      
      requests.forEach(req => {
        const row = [
          req.id,
          req.type,
          req.ticketId,
          `"${req.fullName}"`,
          req.email,
          req.phone,
          `"${req.address}"`,
          req.unit || '',
          req.company || '',
          req.requestType,
          req.status,
          req.createdAt,
          `"${req.description.replace(/"/g, '""')}"`
        ];
        csvRows.push(row.join(','));
      });
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=requests-export-${Date.now()}.csv`);
      res.send(csvRows.join('\n'));
      
    } catch (error) {
      console.error("CSV export error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Admin: Download PDF
  app.get("/api/admin/requests/:id.pdf", requireAdminAuth, async (req, res) => {
    try {
      const request = await storage.getRequest(req.params.id);
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }
      
      const pdfPath = path.join(process.cwd(), "storage", "pdfs", `request-${request.ticketId}.pdf`);
      
      if (fs.existsSync(pdfPath)) {
        res.sendFile(pdfPath);
      } else {
        // Regenerate PDF if not found
        const newPdfPath = await PDFGenerator.generateRequestPDF(request);
        res.sendFile(newPdfPath);
      }
      
    } catch (error) {
      console.error("PDF download error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Admin: Update request status
  app.patch("/api/admin/requests/:id/status", requireAdminAuth, async (req, res) => {
    try {
      const { status } = req.body;
      
      if (!['new', 'in-progress', 'closed'].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      
      await storage.updateRequestStatus(req.params.id, status);
      res.json({ success: true });
      
    } catch (error) {
      console.error("Status update error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
