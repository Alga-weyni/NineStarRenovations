import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { Request } from "@shared/schema";

// Ensure PDF directory exists
const pdfDir = path.join(process.cwd(), "storage", "pdfs");
if (!fs.existsSync(pdfDir)) {
  fs.mkdirSync(pdfDir, { recursive: true });
}

export class PDFGenerator {
  static generateRequestPDF(request: Request): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const filename = `request-${request.ticketId}.pdf`;
        const filepath = path.join(pdfDir, filename);
        
        doc.pipe(fs.createWriteStream(filepath));

        // Header
        doc.fontSize(20).text('9★ 9 Star Renovations', 50, 50);
        doc.fontSize(12).text('Professional Property Maintenance', 50, 75);
        doc.text('(204) 481-4243 • info@9starrenovations.com • Serving Winnipeg', 50, 90);
        
        // Title
        const title = request.type === 'landlord' ? 'Landlord Service Request' : 'Tenant Maintenance Request';
        doc.fontSize(16).text(title, 50, 130);
        
        // Request details
        let yPosition = 160;
        
        doc.fontSize(12);
        doc.text(`Ticket ID: ${request.ticketId}`, 50, yPosition);
        yPosition += 20;
        
        doc.text(`Submitted: ${new Date(request.createdAt!).toLocaleString('en-US', {
          timeZone: 'America/Winnipeg',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })} (Winnipeg time)`, 50, yPosition);
        yPosition += 20;
        
        doc.text(`UTC: ${new Date(request.createdAt!).toISOString()}`, 50, yPosition);
        yPosition += 30;
        
        // Form fields
        doc.fontSize(14).text('Request Details:', 50, yPosition);
        yPosition += 25;
        
        doc.fontSize(12);
        doc.text(`Full Name: ${request.fullName}`, 50, yPosition);
        yPosition += 15;
        
        if (request.company) {
          doc.text(`Company: ${request.company}`, 50, yPosition);
          yPosition += 15;
        }
        
        doc.text(`Email: ${request.email}`, 50, yPosition);
        yPosition += 15;
        
        doc.text(`Phone: ${request.phone}`, 50, yPosition);
        yPosition += 15;
        
        doc.text(`Property Address: ${request.address}`, 50, yPosition);
        yPosition += 15;
        
        if (request.unit) {
          doc.text(`Unit/Apartment: ${request.unit}`, 50, yPosition);
          yPosition += 15;
        }
        
        doc.text(`Request Type: ${request.requestType}`, 50, yPosition);
        yPosition += 15;
        
        if (request.budgetRange) {
          doc.text(`Budget Range: ${request.budgetRange}`, 50, yPosition);
          yPosition += 15;
        }
        
        if (request.preferredDateTime) {
          doc.text(`Preferred Date/Time: ${request.preferredDateTime}`, 50, yPosition);
          yPosition += 15;
        }
        
        if (request.entryPermission) {
          doc.text(`Entry Permission: ${request.entryPermission}`, 50, yPosition);
          yPosition += 15;
        }
        
        if (request.accessInstructions) {
          doc.text(`Access Instructions: ${request.accessInstructions}`, 50, yPosition);
          yPosition += 15;
        }
        
        yPosition += 10;
        doc.text('Description:', 50, yPosition);
        yPosition += 15;
        
        // Wrap long description text
        const descriptionLines = doc.widthOfString(request.description) > 500 
          ? request.description.match(/.{1,80}(\s|$)/g) || [request.description]
          : [request.description];
          
        descriptionLines.forEach(line => {
          doc.text(line.trim(), 50, yPosition);
          yPosition += 15;
        });
        
        if (request.files) {
          yPosition += 10;
          doc.text('Attached Files:', 50, yPosition);
          yPosition += 15;
          
          const files = JSON.parse(request.files);
          files.forEach((file: string) => {
            doc.text(`• ${file}`, 70, yPosition);
            yPosition += 15;
          });
        }
        
        // Footer
        doc.fontSize(10).text(
          'This request was generated automatically. For urgent issues, please call (204) 481-4243.',
          50,
          doc.page.height - 100
        );

        doc.end();
        
        doc.on('end', () => {
          resolve(filepath);
        });
        
      } catch (error) {
        reject(error);
      }
    });
  }

  static async generateBlankPDF(type: 'landlord' | 'tenant'): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const filename = `${type}-blank.pdf`;
        const filepath = path.join(process.cwd(), 'public', 'forms', filename);
        
        // Ensure forms directory exists
        const formsDir = path.dirname(filepath);
        if (!fs.existsSync(formsDir)) {
          fs.mkdirSync(formsDir, { recursive: true });
        }
        
        doc.pipe(fs.createWriteStream(filepath));

        // Header
        doc.fontSize(20).text('9★ 9 Star Renovations', 50, 50);
        doc.fontSize(12).text('Professional Property Maintenance', 50, 75);
        doc.text('(204) 481-4243 • info@9starrenovations.com • Serving Winnipeg', 50, 90);
        
        // Title
        const title = type === 'landlord' ? 'Landlord Service Request Form' : 'Tenant Maintenance Request Form';
        doc.fontSize(16).text(title, 50, 130);
        
        let yPosition = 170;
        doc.fontSize(12);
        
        // Form fields
        const fields = type === 'landlord' ? [
          'Full Name: ________________________________',
          'Company: ________________________________',
          'Email: ________________________________',
          'Phone: ________________________________',
          'Property Address: ________________________________',
          'Request Type: ________________________________',
          'Budget Range: ________________________________',
          'Preferred Date/Time: ________________________________',
          'Access Instructions:',
          '________________________________________________',
          '________________________________________________',
          'Description:',
          '________________________________________________',
          '________________________________________________',
          '________________________________________________',
          '________________________________________________',
        ] : [
          'Full Name: ________________________________',
          'Email: ________________________________',
          'Phone: ________________________________',
          'Property Address: ________________________________',
          'Unit/Apartment #: ________________________________',
          'Issue Type: ________________________________',
          'Permission to Enter: ________________________________',
          'Description:',
          '________________________________________________',
          '________________________________________________',
          '________________________________________________',
          '________________________________________________',
        ];

        fields.forEach(field => {
          doc.text(field, 50, yPosition);
          yPosition += 25;
        });
        
        // Consent checkbox
        yPosition += 20;
        doc.text('☐ ', 50, yPosition);
        const consentText = type === 'landlord' 
          ? 'I confirm I am authorized to request service at this property.'
          : 'I confirm this request is accurate and authorize contact regarding this issue.';
        doc.text(consentText, 70, yPosition);

        // Footer
        doc.fontSize(10).text(
          'Complete this form and submit online at 9starrenovations.com or email to info@9starrenovations.com',
          50,
          doc.page.height - 100
        );

        doc.end();
        
        doc.on('end', () => {
          resolve(filepath);
        });
        
      } catch (error) {
        reject(error);
      }
    });
  }
}
