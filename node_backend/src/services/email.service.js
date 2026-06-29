const nodemailer = require('nodemailer');

const createTransporter = () => {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  // Development: log to console
  return null;
};

const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = createTransporter();

  if (!transporter) {
    // Dev mode: log to console
    console.log('\n📧 [EMAIL LOG - Dev Mode]');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n${text || html}`);
    console.log('─'.repeat(50));
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@sr4ipr.com',
      to,
      subject,
      text,
      html,
    });
  } catch (err) {
    console.error('[Email Error]', err.message);
    // Don't throw — email failure shouldn't break the request
  }
};

const sendContactNotification = async (contact) => {
  const isConsultation = contact.type === 'CONSULTATION';
  const adminSubject = isConsultation
    ? `New Consultation Request: ${contact.name} — ${contact.serviceArea || 'General'}`
    : `New Contact Form Submission: ${contact.name}`;

  const adminBody = `
${isConsultation ? 'CONSULTATION REQUEST' : 'CONTACT FORM SUBMISSION'}
================================

Name: ${contact.name}
Email: ${contact.email}
Phone: ${contact.phone || 'Not provided'}
${contact.company ? `Company: ${contact.company}` : ''}
${isConsultation ? `Service: ${contact.serviceArea || 'Not specified'}` : `Subject: ${contact.subject || 'Not specified'}`}
${isConsultation ? `Preferred Date: ${contact.consultationDate}\nPreferred Time: ${contact.consultationTime}` : ''}

Message:
${contact.message}

Manage at: http://localhost:5174/admin
  `.trim();

  const clientSubject = isConsultation
    ? 'Consultation Request Received — SR4IPR Partners'
    : 'Thank you for contacting SR4IPR Partners';

  const clientBody = isConsultation
    ? `Dear ${contact.name},\n\nThank you for reaching out to SR4IPR Partners. We have received your consultation request.\n\nBooking Details:\n- Practice Area: ${contact.serviceArea || 'General'}\n- Requested Date: ${contact.consultationDate}\n- Requested Time: ${contact.consultationTime}\n\nOne of our IP specialists will contact you shortly to confirm your session.\n\nSincerely,\nSR4IPR Partners Team\nhttps://www.sr4ipr.com`
    : `Dear ${contact.name},\n\nThank you for your message. We have received your enquiry and will respond within 1-2 business days.\n\nSincerely,\nSR4IPR Partners Team\nhttps://www.sr4ipr.com`;

  await Promise.all([
    sendEmail({
      to: process.env.ADMIN_EMAIL || 'consult@sr4ipr.com',
      subject: adminSubject,
      text: adminBody,
    }),
    sendEmail({
      to: contact.email,
      subject: clientSubject,
      text: clientBody,
    }),
  ]);
};

module.exports = { sendEmail, sendContactNotification };
