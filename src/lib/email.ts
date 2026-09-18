import nodemailer from "nodemailer";

const host = process.env.EMAIL_HOST || "smtp.gmail.com";
const port = Number(process.env.EMAIL_PORT) || 587;
const user = process.env.EMAIL_HOST_USER || "supportshopsphere@gmail.com";
const pass = process.env.EMAIL_HOST_PASSWORD || "vefw tdis lewq lpso";
const fromEmail = process.env.DEFAULT_FROM_EMAIL || "vs2734514@gmail.com";

/**
 * Creates and returns Nodemailer transporter
 */
export function getEmailTransporter() {
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports like 587
    auth: {
      user: user.trim(),
      pass: pass.trim(),
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
}

/**
 * Send an email via SMTP
 */
export async function sendEmail(options: SendEmailOptions) {
  const transporter = getEmailTransporter();
  const mailOptions = {
    from: options.from || `"CAConnect" <${user.trim()}>`,
    replyTo: fromEmail,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html || (options.text ? options.text.replace(/\n/g, "<br/>") : ""),
    cc: options.cc,
    bcc: options.bcc,
  };

  return transporter.sendMail(mailOptions);
}
