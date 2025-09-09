import nodemailer from "nodemailer";
import { Request } from "@shared/schema";

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || "test@example.com",
        pass: process.env.SMTP_PASS || "password",
      },
    });
  }

  async sendOperationsNotification(request: Request, pdfPath: string): Promise<void> {
    const subject = `[New ${request.type === 'landlord' ? 'Landlord' : 'Tenant'} Request] ${request.address} — ${request.fullName}`;
    
    const html = `
      <h2>New ${request.type === 'landlord' ? 'Landlord' : 'Tenant'} Service Request</h2>
      
      <h3>Request Details:</h3>
      <ul>
        <li><strong>Ticket ID:</strong> ${request.ticketId}</li>
        <li><strong>Name:</strong> ${request.fullName}</li>
        ${request.company ? `<li><strong>Company:</strong> ${request.company}</li>` : ''}
        <li><strong>Email:</strong> ${request.email}</li>
        <li><strong>Phone:</strong> ${request.phone}</li>
        <li><strong>Address:</strong> ${request.address}</li>
        ${request.unit ? `<li><strong>Unit:</strong> ${request.unit}</li>` : ''}
        <li><strong>Type:</strong> ${request.requestType}</li>
        ${request.budgetRange ? `<li><strong>Budget:</strong> ${request.budgetRange}</li>` : ''}
        ${request.preferredDateTime ? `<li><strong>Preferred Time:</strong> ${request.preferredDateTime}</li>` : ''}
        ${request.entryPermission ? `<li><strong>Entry Permission:</strong> ${request.entryPermission}</li>` : ''}
        <li><strong>Submitted:</strong> ${new Date(request.createdAt!).toLocaleString('en-US', {
          timeZone: 'America/Winnipeg'
        })} (Winnipeg time)</li>
      </ul>
      
      ${request.accessInstructions ? `
      <h3>Access Instructions:</h3>
      <p>${request.accessInstructions}</p>
      ` : ''}
      
      <h3>Description:</h3>
      <p>${request.description}</p>
      
      ${request.files ? `
      <h3>Attached Files:</h3>
      <ul>
        ${JSON.parse(request.files).map((file: string) => `<li>${file}</li>`).join('')}
      </ul>
      ` : ''}
      
      <p><a href="${process.env.BASE_URL || 'http://localhost:5000'}/admin/requests/${request.id}.pdf">Download PDF</a></p>
    `;

    await this.transporter.sendMail({
      from: process.env.SMTP_USER || "noreply@9starrenovations.com",
      to: "info@9starrenovations.com",
      subject,
      html,
      attachments: [
        {
          filename: `request-${request.ticketId}.pdf`,
          path: pdfPath,
        },
      ],
    });
  }

  async sendAutoReply(request: Request): Promise<void> {
    const subject = "9 Star Renovations — Request Received";
    
    const html = `
      <h2>Thank you for your service request!</h2>
      
      <p>Dear ${request.fullName},</p>
      
      <p>We've received your ${request.type} service request and will be in touch shortly.</p>
      
      <p><strong>Your Ticket ID:</strong> ${request.ticketId}</p>
      
      <p><strong>For emergencies, please call (204) 481-4243 immediately.</strong></p>
      
      <p>We'll review your request and contact you within 24 hours to schedule service.</p>
      
      <p>Thank you for choosing 9 Star Renovations!</p>
      
      <hr>
      <p>
        <strong>9 Star Renovations</strong><br>
        (204) 481-4243<br>
        info@9starrenovations.com<br>
        Serving Winnipeg
      </p>
    `;

    await this.transporter.sendMail({
      from: process.env.SMTP_USER || "noreply@9starrenovations.com",
      to: request.email,
      subject,
      html,
    });
  }
}
