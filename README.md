# ROOTS-ip Partners Law Firm Portal

A premium, state-of-the-art web application and administration portal built for **ROOTS-ip Partners** law firm. This system coordinates global patent prosecution workflows, trademark clearance tracking, copyright registrations, and administrative client consulting inquiries.

---

## 📂 Project Structure

The project is structured as a monorepo consisting of two primary components:

* **frontend/**: High-performance client-side Single Page Application (SPA).
* **node_backend/**: Secure REST API service driving database persistence, authentication pipelines, and analytical logging.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 (harmonious premium dark theme)
- **Transitions & Animation**: Framer Motion 12 (spring-physics layout interactions)
- **Icons**: Lucide React
- **Routing**: React Router 7

### Backend
- **Platform**: Node.js & Express
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet headers, NoSQL injection sanitizers, and Rate-Limiter policies
- **Utilities**: CORS, compression, and Morgan HTTP request logger

---

## ✨ Features & Architecture

1. **Premium Responsive Design**:
   - Locked into a Harmonious Dark Theme.
   - Clean top header navbar fixed to the viewport on all device screen sizes.
   - Reduced scroll height on mobile layouts by 35% with streamlined hero paddings.
2. **Interactive Swipe Carousels (Mobile)**:
   - Horizontal touch-swipe carousels for the Case Studies, Testimonials, and Attorney Showcase grids on mobile viewport widths using Framer Motion gestures and dot navigation.
   - Integrated browser-default vertical scrolling (`touch-pan-y`) to prevent drag blocks.
3. **Practice Directory Grid**:
   - Configured into a compact 2-column mobile layout.
4. **Consultation & Booking Flow**:
   - Supports automated booking, payment statuses, and detailed consulting logs.
5. **Admin Portal CMS**:
   - Secure dashboard allowing dynamic status edits, lawyer assignments, and administrative logging.
   - Consultation table features collapsible "View More" details and centered Load More row pagination limiting visible requests to 5 rows initially.

---

## 🚀 Installation & Local Development

### 1. Backend Configuration
Navigate to `node_backend/` and copy the configuration environment file:
```bash
cd node_backend
# Configure your .env parameters:
# PORT, MONGODB_URI, JWT_SECRET, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, etc.
npm install
npm run dev
```

### 2. Frontend Configuration
Navigate to `frontend/` and configure client endpoints:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` to view the application.

### 3. Production Build
To package the client-side files for deployment:
```bash
cd frontend
npm run build
```
The optimized production bundle will build inside `frontend/dist/`.
