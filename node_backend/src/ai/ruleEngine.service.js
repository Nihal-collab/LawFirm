/**
 * Rule-based fallback engine for when Groq AI is unavailable.
 * Mirrors the Python rule engine from the Django backend.
 */

const runRuleEngine = (message) => {
  const msg = message.toLowerCase();

  const RESPONSES = {
    patent: `**Patent Filing & Requirements:**
A patent protects new, non-obvious, and industrially useful inventions.
- **Key criteria:** Novelty, Inventive Step, and Utility.
- **Filing types:** Provisional Application (secures priority date for 12 months) and Complete Specification.
- **Term:** 20 years from the date of filing.`,

    trademark: `**Trademark Registration:**
A trademark protects brand names, logos, slogans, and symbols. It prevents confusion in the marketplace.
- **Key criteria:** Distinctiveness (avoid descriptive or generic terms).
- **Process:** Trade Mark Search → Filing → Examination → Publication → Registration.
- **Term:** 10 years, renewable indefinitely.`,

    copyright: `**Copyright Protection:**
Copyright protects original literary, dramatic, musical, artistic works, software code, and sound recordings.
- **Protection:** Exists automatically upon creation, but registration provides legal evidence in court.
- **Term:** Lifetime of the author plus 60 years (India) or 70 years (many other countries).`,

    cost: `**Fee & Cost Estimates:**
Registration and drafting fees vary based on project complexity:
- **Trademarks:** Search & filing starts from cost-effective rates per class.
- **Patents:** Prior art searches, draft preparation, and official filing fees vary by entity status (individual/startup/corporate).
Use our **Cost Calculator** on the navigation bar for interactive pricing estimates.`,

    consult: `**Scheduling a Consultation:**
You can book an official 30-minute session (Zoom or Google Meet) using the **Book Consultation** page. Our lawyers evaluate your technical drawings or brand names under strict NDA confidentiality.`,

    default: `Thank you for your enquiry. SR4IPR Partners provides comprehensive IPR services:
1. **Patents:** Search, drafting, filing, and prosecution.
2. **Trademarks:** Brand search, registration, and trademark opposition.
3. **Copyrights:** Software code and creative asset registrations.
4. **Litigation:** Enforcement against infringements.

Please book a consultation or send your details via our Contact form.`,
  };

  let responseBody = '';

  if (msg.includes('patent') || msg.includes('invent')) responseBody += RESPONSES.patent + '\n\n';
  if (msg.includes('trademark') || msg.includes('brand') || msg.includes('logo')) responseBody += RESPONSES.trademark + '\n\n';
  if (msg.includes('copyright') || msg.includes('software') || msg.includes('code') || msg.includes('author')) responseBody += RESPONSES.copyright + '\n\n';
  if (msg.includes('cost') || msg.includes('price') || msg.includes('fee') || msg.includes('charge') || msg.includes('estimate')) responseBody += RESPONSES.cost + '\n\n';
  if (msg.includes('book') || msg.includes('consult') || msg.includes('schedule') || msg.includes('zoom') || msg.includes('meet')) responseBody += RESPONSES.consult + '\n\n';

  return responseBody.trim() || RESPONSES.default.trim();
};

module.exports = { runRuleEngine };
