# SHHEER Case - Bank Guarantee Dispute Documentation Website

<p align="center">
  <img src="client/public/images/logo.png" alt="Nesma Barzan Logo" width="200">
</p>

<p align="center">
  <strong>A comprehensive legal documentation platform for the SHHEER (شهير) project bank guarantee dispute case</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#installation">Installation</a> •
  <a href="#database">Database</a> •
  <a href="#admin-panel">Admin Panel</a> •
  <a href="#case-overview">Case Overview</a>
</p>

---

## 📋 Project Overview

This website serves as a comprehensive documentation platform for the legal case concerning the failed bank guarantee transaction for the SHHEER (شهير) project. The case involves **Nesma Barzan Foundation** (Plaintiff) vs. **Al Rajhi Bank** (Defendant), documenting how operational failures and communication breakdowns led to the collapse of a **€120 million** investment deal.

### Case Reference
- **Guarantee Number:** JVA-PTVL-FIACL-TBTSCGL-25072013
- **Guarantee Value:** €300 Million
- **Lost Investment:** €120 Million
- **Critical Period:** October - November 2013

---

## ✨ Features

### Public Website
- **Hero Section** - Case overview with key statistics
- **Case Overview** - Parties involved (Plaintiff, Defendant, International Parties)
- **Interactive Timeline** - 17 chronological events with filtering by year and category
- **Evidence Archive** - 10+ documents with view/download functionality
- **Video Documentation** - Case summary videos
- **Responsive Design** - Mobile-friendly interface

### Admin Dashboard (`/admin`)
- **Dashboard Overview** - Statistics and quick access
- **Content Management:**
  - Header & Logo management
  - Hero Section editing
  - Case Parties management
  - Timeline Events (CRUD with evidence linking)
  - Evidence Items (CRUD with file management)
  - Videos management
  - Footer configuration
- **Category Management:**
  - Timeline Categories (Foundation, Investment Deal, SWIFT Operations, Critical Failure, Legal Proceedings)
  - Evidence Categories (Licenses, Emails, SWIFT, WhatsApp, Letters, Documents)
- **Evidence Linking** - Link documents to timeline events

---

## 🛠 Tech Stack

### Frontend
- **React 19** - UI Framework
- **TypeScript** - Type Safety
- **Tailwind CSS 4** - Styling
- **Shadcn/ui** - UI Components
- **Wouter** - Routing
- **Framer Motion** - Animations
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express** - Server Framework
- **Drizzle ORM** - Database ORM
- **MySQL** - Database
- **tRPC** - API Layer

### Development
- **Vite** - Build Tool
- **pnpm** - Package Manager
- **Vitest** - Testing

---

## 📦 Installation

### Prerequisites
- Node.js 18+
- pnpm
- MySQL Database

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/SHHEER-CASE.git
cd SHHEER-CASE
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. **Setup database**
```bash
# Push schema to database
pnpm db:push

# Seed initial data
mysql -u YOUR_USER -p YOUR_DATABASE < database/seed-data.sql
```

5. **Start development server**
```bash
pnpm dev
```

6. **Access the application**
- Public Website: `http://localhost:3000`
- Admin Panel: `http://localhost:3000/admin`

---

## 🗄 Database

### Schema Overview

| Table | Description |
|-------|-------------|
| `header_content` | Header configuration (logo, navigation) |
| `hero_section` | Hero section content |
| `overview_parties` | Case parties (Plaintiff, Defendant, Third Parties) |
| `timeline_events` | Timeline events with dates and categories |
| `timeline_categories` | Dynamic timeline categories |
| `evidence_items` | Evidence documents and files |
| `evidence_categories` | Dynamic evidence categories |
| `timeline_event_evidence` | Junction table linking events to evidence |
| `videos` | Video documentation |
| `footer_content` | Footer configuration |
| `site_settings` | General site settings |

### Database Files
- `drizzle/schema.ts` - Database schema definition
- `database/seed-data.sql` - Initial seed data

---

## 🔐 Admin Panel

Access the admin panel at `/admin` to manage all website content.

### Available Sections

| Section | Path | Description |
|---------|------|-------------|
| Dashboard | `/admin` | Overview statistics |
| Site Settings | `/admin/settings` | General settings |
| Header | `/admin/header` | Logo and navigation |
| Hero Section | `/admin/hero` | Main banner content |
| Case Parties | `/admin/parties` | Plaintiff, Defendant, Third Parties |
| Timeline Events | `/admin/timeline` | Case timeline management |
| Timeline Categories | `/admin/timeline-categories` | Category management |
| Evidence | `/admin/evidence` | Document management |
| Evidence Categories | `/admin/evidence-categories` | Category management |
| Videos | `/admin/videos` | Video management |
| Footer | `/admin/footer` | Footer content |

---

## 📁 Project Structure

```
shheer-case/
├── client/                 # Frontend application
│   ├── public/            # Static assets
│   │   ├── images/        # Logo and images
│   │   └── evidence/      # Evidence documents
│   └── src/
│       ├── components/    # React components
│       │   ├── admin/     # Admin panel components
│       │   └── ui/        # Shadcn UI components
│       ├── pages/         # Page components
│       │   └── admin/     # Admin pages
│       ├── hooks/         # Custom React hooks
│       ├── contexts/      # React contexts
│       └── data/          # Static data (fallback)
├── server/                # Backend server
│   ├── db.ts             # Database functions
│   ├── routers.ts        # API routes
│   └── index.ts          # Server entry
├── drizzle/              # Database
│   └── schema.ts         # Database schema
├── database/             # Database files
│   └── seed-data.sql     # Seed data
└── shared/               # Shared types
```

---

## 📅 Development Timeline

### Version 1.0 - Initial Release
- Basic website structure
- Static content display
- Evidence gallery with view/download

### Version 2.0 - Admin Dashboard
- Full admin panel implementation
- Database integration
- CRUD operations for all content
- Dynamic categories management
- Evidence linking to timeline events

### Version 2.1 - Enhancements
- Timeline filtering by year and category
- Category badges with colors
- View Evidence popup with linked documents
- Improved admin UI with file URL management

---

## 📜 Case Overview

### Parties Involved

**Plaintiff:** Nesma Barzan Foundation
- Representative: Abdulaziz Al-Amoudi
- Role: Project Owner & Rights Holder

**Defendant:** Al Rajhi Bank
- Role: Receiving Bank (MT 760)

**International Parties:**
- DAMA Investment Group (Investment Facilitator)
- UNICOMBANK Moldova (Bank Guarantee Issuer)
- SCC Simpatrans (Investment Company)

### Key Events Timeline

1. **2005** - SHHEER Project Licensed
2. **July 2013** - Investment Deal Initiated (€120M)
3. **October 2013** - Bank Guarantee Required
4. **October 14-15, 2013** - RMA Activation & Confirmation
5. **October 17, 2013** - MT 760 Guarantee Issued (€300M)
6. **October 22, 2013** - PKI Authentication Failure
7. **November 10, 2013** - Investment Deal Collapsed
8. **2014** - Legal Proceedings Initiated

### Evidence Categories
- Licenses & Official Documents
- Email Correspondence
- SWIFT Messages (MT 760)
- WhatsApp Communications
- Legal Letters

---

## 📄 License

This project is created for legal documentation purposes. All information presented is based on official documents and evidence submitted to the Banking Disputes Committee.

---

## 📞 Contact

**Nesma Barzan Foundation**
- Location: Riyadh, Kingdom of Saudi Arabia
- Website: www.nesmabarzan.com

---

<p align="center">
  <sub>Built with ❤️ for legal documentation and transparency</sub>
</p>
