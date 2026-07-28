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

const sendDirectBookingNotification = async (booking) => {
  const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
  const adminSubject = `New Consultation Request: ${booking.name} — ${booking.serviceArea || 'General'}`;
  
  const adminText = `
A new direct consultation has been requested. Details are as follows:

Customer & Session Details:
- Booking Reference ID: ${booking._id}
- Customer Name: ${booking.name}
- Email Address: ${booking.email}
- Phone Number: ${booking.phone || 'Not provided'}
- Company Name: ${booking.company || 'Not provided'}
- Practice Area: ${booking.serviceArea || 'General'}
- Preferred Date: ${booking.consultationDate}
- Preferred Time Slot: ${booking.consultationTime}

Quick Actions:
- View Booking: ${frontendOrigin}/admin
- Reply via Email: mailto:${booking.email}?subject=Regarding your ROOTS-ip booking: ${booking._id}

ROOTS-ip Admin Portal Automation
  `.trim();

  const adminHtml = `
<div style="font-family: Arial, sans-serif; background-color: #09111F; color: #C8D3E2; padding: 30px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255, 255, 255, 0.08);">
  <div style="text-align: center; margin-bottom: 20px;">
    <h2 style="font-family: Georgia, serif; color: #FFFFFF; font-size: 24px; margin: 0;">ROOTS<span style="color: #0A4DFF;">-ip</span> Dashboard</h2>
    <p style="font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: #A7B2C3; margin: 5px 0 0 0;">New Consultation Request</p>
  </div>
  <hr style="border: 0; border-top: 1px solid rgba(255, 255, 255, 0.08); margin: 20px 0;" />
  
  <p style="font-size: 14px; line-height: 1.6; color: #FFFFFF;">A new direct consultation has been requested. Details are as follows:</p>
  
  <div style="background-color: #0B132B; padding: 20px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05); margin: 20px 0;">
    <h3 style="font-size: 12px; text-transform: uppercase; color: #FFFFFF; letter-spacing: 1px; margin-top: 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 8px;">Customer & Session Details</h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
      <tr><td style="padding: 6px 0; color: #94A3B8; width: 40%;">Booking Reference ID:</td><td style="padding: 6px 0; color: #FFFFFF; font-weight: bold;">${booking._id}</td></tr>
      <tr><td style="padding: 6px 0; color: #94A3B8;">Customer Name:</td><td style="padding: 6px 0; color: #FFFFFF; font-weight: bold;">${booking.name}</td></tr>
      <tr><td style="padding: 6px 0; color: #94A3B8;">Email Address:</td><td style="padding: 6px 0; color: #FFFFFF;"><a href="mailto:${booking.email}" style="color: #0A4DFF; text-decoration: none;">${booking.email}</a></td></tr>
      <tr><td style="padding: 6px 0; color: #94A3B8;">Phone Number:</td><td style="padding: 6px 0; color: #FFFFFF;">${booking.phone || 'Not provided'}</td></tr>
      <tr><td style="padding: 6px 0; color: #94A3B8;">Company Name:</td><td style="padding: 6px 0; color: #FFFFFF;">${booking.company || 'Not provided'}</td></tr>
      <tr><td style="padding: 6px 0; color: #94A3B8;">Practice Area:</td><td style="padding: 6px 0; color: #FFFFFF;">${booking.serviceArea || 'General'}</td></tr>
      <tr><td style="padding: 6px 0; color: #94A3B8;">Preferred Date:</td><td style="padding: 6px 0; color: #FFFFFF;">${booking.consultationDate}</td></tr>
      <tr><td style="padding: 6px 0; color: #94A3B8;">Preferred Time Slot:</td><td style="padding: 6px 0; color: #FFFFFF;">${booking.consultationTime}</td></tr>
    </table>
  </div>

  <div style="text-align: center; margin: 30px 0;">
    <p style="font-size: 12px; color: #94A3B8; margin-bottom: 15px;">Quick Actions</p>
    <a href="${frontendOrigin}/admin" style="display: inline-block; background: linear-gradient(90deg, #0057D9, #0A4DFF); color: #FFFFFF; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; padding: 12px 24px; border-radius: 20px; text-decoration: none; margin: 0 5px; box-shadow: 0 4px 15px rgba(10,77,255,0.35);">View Booking</a>
    <a href="mailto:${booking.email}?subject=Regarding your ROOTS-ip booking: ${booking._id}" style="display: inline-block; border: 1px solid #0A4DFF; color: #0A4DFF; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; padding: 11px 23px; border-radius: 20px; text-decoration: none; margin: 0 5px;">Reply via Email</a>
  </div>
  
  <hr style="border: 0; border-top: 1px solid rgba(255, 255, 255, 0.08); margin: 20px 0;" />
  <div style="text-align: center; font-size: 11px; color: #A7B2C3;">
    <p style="margin: 5px 0;">ROOTS-ip Admin Portal Automation</p>
  </div>
</div>
  `.trim();

  const clientSubject = 'Consultation Request Received — SR4IPR Partners';
  const clientText = `
Dear ${booking.name},

Your consultation request has been received successfully. Our team will review your request and contact you shortly to confirm your appointment.

Booking Details:
- Booking Reference ID: ${booking._id}
- Practice Area: ${booking.serviceArea || 'General'}
- Preferred Date: ${booking.consultationDate}
- Preferred Time Slot: ${booking.consultationTime}
- Company Name: ${booking.company || 'Not provided'}
- Phone Number: ${booking.phone || 'Not provided'}

Sincerely,
SR4IPR Partners Team
https://www.sr4ipr.com
  `.trim();

  const clientHtml = `
<div style="font-family: Arial, sans-serif; background-color: #09111F; color: #C8D3E2; padding: 30px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255, 255, 255, 0.08);">
  <div style="text-align: center; margin-bottom: 20px;">
    <h2 style="font-family: Georgia, serif; color: #FFFFFF; font-size: 24px; margin: 0;">ROOTS<span style="color: #0A4DFF;">-ip</span></h2>
    <p style="font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: #A7B2C3; margin: 5px 0 0 0;">Intellectual Property Counsel</p>
  </div>
  <hr style="border: 0; border-top: 1px solid rgba(255, 255, 255, 0.08); margin: 20px 0;" />
  <p style="font-size: 15px; color: #FFFFFF; font-weight: bold;">Dear ${booking.name},</p>
  <p style="font-size: 14px; line-height: 1.6; color: #C8D3E2;">Your consultation request has been received successfully. Our team will review your request and contact you shortly to confirm your appointment.</p>
  
  <div style="background-color: #0B132B; padding: 20px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05); margin: 20px 0;">
    <h3 style="font-size: 12px; text-transform: uppercase; color: #FFFFFF; letter-spacing: 1px; margin-top: 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 8px;">Booking Summary</h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
      <tr><td style="padding: 6px 0; color: #94A3B8; width: 40%;">Booking Reference ID:</td><td style="padding: 6px 0; color: #FFFFFF; font-weight: bold;">${booking._id}</td></tr>
      <tr><td style="padding: 6px 0; color: #94A3B8;">IPR Practice Area:</td><td style="padding: 6px 0; color: #FFFFFF;">${booking.serviceArea || 'General'}</td></tr>
      <tr><td style="padding: 6px 0; color: #94A3B8;">Preferred Date:</td><td style="padding: 6px 0; color: #FFFFFF;">${booking.consultationDate}</td></tr>
      <tr><td style="padding: 6px 0; color: #94A3B8;">Preferred Time Slot:</td><td style="padding: 6px 0; color: #FFFFFF;">${booking.consultationTime}</td></tr>
      <tr><td style="padding: 6px 0; color: #94A3B8;">Company Name:</td><td style="padding: 6px 0; color: #FFFFFF;">${booking.company || 'Not provided'}</td></tr>
      <tr><td style="padding: 6px 0; color: #94A3B8;">Phone Number:</td><td style="padding: 6px 0; color: #FFFFFF;">${booking.phone || 'Not provided'}</td></tr>
    </table>
  </div>
  
  <p style="font-size: 13px; line-height: 1.6; color: #94A3B8; text-align: center; margin-top: 30px;">Our team will review your request and contact you shortly to confirm your appointment.</p>
  <hr style="border: 0; border-top: 1px solid rgba(255, 255, 255, 0.08); margin: 20px 0;" />
  <div style="text-align: center; font-size: 12px; color: #A7B2C3;">
    <p style="margin: 5px 0;">Sincerely,</p>
    <p style="margin: 5px 0; color: #FFFFFF; font-weight: bold;">SR4IPR Partners Team</p>
    <p style="margin: 5px 0;"><a href="https://www.sr4ipr.com" style="color: #0A4DFF; text-decoration: none;">www.sr4ipr.com</a></p>
  </div>
</div>
  `.trim();

  await Promise.all([
    sendEmail({
      to: process.env.ADMIN_EMAIL || 'consult@sr4ipr.com',
      subject: adminSubject,
      text: adminText,
      html: adminHtml
    }),
    sendEmail({
      to: booking.email,
      subject: clientSubject,
      text: clientText,
      html: clientHtml
    })
  ]);
};

const sendPaymentConfirmationNotification = async (booking) => {
  const currencySymbol = booking.paymentCurrency === 'INR' ? 'INR ' : '$';
  
  const adminSubject = `Payment Confirmed: ${booking.name} — ${booking.serviceArea || 'General'}`;
  const adminText = `
Payment confirmation received for booking ${booking._id}.

Payment Details:
- Customer Name: ${booking.name}
- Email: ${booking.email}
- Amount: ${currencySymbol}${booking.paymentAmount} ${booking.paymentCurrency || 'USD'}
- Payment Method: ${booking.paymentMethod || 'PayPal'}
- Transaction ID: ${booking.paypalTransactionId || 'N/A'}
- Order ID: ${booking.paypalOrderId || 'N/A'}
- Date: ${booking.paymentDate || new Date()}

ROOTS-ip Admin Portal Automation
  `.trim();

  const clientSubject = 'Payment Confirmed — SR4IPR Partners';
  const clientText = `
Dear ${booking.name},

Thank you for choosing SR4IPR Partners. We have successfully received your payment of ${currencySymbol}${booking.paymentAmount} ${booking.paymentCurrency || 'USD'} for Booking Reference ID: ${booking._id}.

Payment Details:
- Reference ID: ${booking._id}
- Transaction ID: ${booking.paypalTransactionId || 'N/A'}
- Amount: ${currencySymbol}${booking.paymentAmount} ${booking.paymentCurrency || 'USD'}
- Date: ${booking.paymentDate || new Date()}

Sincerely,
SR4IPR Partners Team
https://www.sr4ipr.com
  `.trim();

  await Promise.all([
    sendEmail({
      to: process.env.ADMIN_EMAIL || 'consult@sr4ipr.com',
      subject: adminSubject,
      text: adminText,
    }),
    sendEmail({
      to: booking.email,
      subject: clientSubject,
      text: clientText,
    })
  ]);
};

module.exports = {
  sendEmail,
  sendContactNotification,
  sendDirectBookingNotification,
  sendPaymentConfirmationNotification,
};
