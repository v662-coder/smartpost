import nodemailer from "nodemailer";

let cachedTransporter = null;

const isEmailConfigured = () =>
  !!(process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS);

const getTransporter = () => {
  if (cachedTransporter) return cachedTransporter;
  cachedTransporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  return cachedTransporter;
};

/**
 * Sends an email if SMTP credentials are configured (EMAIL_HOST / EMAIL_USER / EMAIL_PASS
 * in server/.env). If they're not configured, this logs the content to the server console
 * instead of silently failing — useful for local development, and honest about the fact
 * that no email was actually delivered.
 *
 * Returns { delivered: boolean } so callers can adjust their response/UX accordingly.
 */
const sendEmail = async ({ to, subject, text, html }) => {
  if (!isEmailConfigured()) {
    console.log("\n================ EMAIL NOT SENT (SMTP not configured) ================");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(text || html);
    console.log("Set EMAIL_HOST / EMAIL_PORT / EMAIL_USER / EMAIL_PASS in server/.env to actually send this.");
    console.log("=========================================================================\n");
    return { delivered: false };
  }

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });
    return { delivered: true };
  } catch (error) {
    console.error("Failed to send email:", error.message);
    return { delivered: false };
  }
};

export default sendEmail;
