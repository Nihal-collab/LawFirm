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

const formatPaymentDetails = (contact) => {
  if (contact.status !== 'Payment Successful') return '';

  const formatDigits = (num) => String(num).padStart(2, '0');
  let dateStr = 'N/A';
  if (contact.paymentDate) {
    const d = new Date(contact.paymentDate);
    const day = formatDigits(d.getDate());
    const month = formatDigits(d.getMonth() + 1);
    const year = d.getFullYear();
    const hours = formatDigits(d.getHours());
    const minutes = formatDigits(d.getMinutes());
    dateStr = `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  const currencySymbol = contact.paymentCurrency === 'INR' ? 'INR ' : '$';

  return `
Payment Details
-------------------------
Payment Status : Successful
Payment Method : ${contact.paymentMethod || 'PayPal'}
Transaction ID : ${contact.paypalTransactionId || 'N/A'}
Order ID       : ${contact.paypalOrderId || 'N/A'}
Amount Paid    : ${currencySymbol}${contact.paymentAmount || '0'}
Currency       : ${contact.paymentCurrency || 'USD'}
Payment Date   : ${dateStr}
Payer Email    : ${contact.payerEmail || 'N/A'}
`.trim();
};

const sendContactNotification = async (contact) => {
  const isConsultation = contact.type === 'CONSULTATION';
  const adminSubject = isConsultation
    ? `New Consultation Request: ${contact.name} — ${contact.serviceArea || 'General'}`
    : `New Contact Form Submission: ${contact.name}`;

  let adminBody;
  if (isConsultation) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let dateAndDay = contact.consultationDate || '';
    if (contact.consultationDate) {
      try {
        const parts = contact.consultationDate.split('-');
        if (parts.length === 3) {
          const year = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1;
          const day = parseInt(parts[2], 10);
          const dateObj = new Date(year, month, day);
          const dayOfWeek = days[dateObj.getDay()];
          if (dayOfWeek) {
            dateAndDay = `${contact.consultationDate} (${dayOfWeek})`;
          }
        }
      } catch (err) {
        // Fallback to original date
      }
    }

    const payDetails = formatPaymentDetails(contact);

    const lines = [
      `${contact.name} booked a session on ${dateAndDay} at ${contact.consultationTime || ''}.he wants to book session regarding ${contact.serviceArea || 'General'}.`,
      `Email: ${contact.email}`,
      `Phone: ${contact.phone || 'Not provided'}`,
      `Company: ${contact.company || 'Not provided'}`,
      '',
      payDetails ? payDetails : 'Payment details not available.'
    ].filter(line => line !== null && line !== undefined);

    adminBody = lines.join('\n');
  } else {
    adminBody = `
New Contact Form Submission: ${contact.name}
================================

Name: ${contact.name}
Email: ${contact.email}
Phone: ${contact.phone || 'Not provided'}
${contact.company ? `Company: ${contact.company}` : ''}
Subject: ${contact.subject || 'Not specified'}

Message:
${contact.message}

Manage at: http://localhost:5174/admin
    `.trim();
  }

  const clientSubject = isConsultation
    ? 'Consultation Request Received — SR4IPR Partners'
    : 'Thank you for contacting SR4IPR Partners';

  let clientBody;
  if (isConsultation) {
    const payDetails = formatPaymentDetails(contact);
    clientBody = `Dear ${contact.name},\n\nThank you for reaching out to SR4IPR Partners. Your consultation has been booked successfully, and payment has been received successfully.\n\nBooking Details:\n- Practice Area: ${contact.serviceArea || 'General'}\n- Requested Date: ${contact.consultationDate}\n- Requested Time: ${contact.consultationTime}\n\n${payDetails}\n\nOne of our IP specialists will contact you shortly to confirm your session.\n\nSincerely,\nSR4IPR Partners Team\nhttps://www.sr4ipr.com`;
  } else {
    clientBody = `Dear ${contact.name},\n\nThank you for your message. We have received your enquiry and will respond within 1-2 business days.\n\nSincerely,\nSR4IPR Partners Team\nhttps://www.sr4ipr.com`;
  }

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
