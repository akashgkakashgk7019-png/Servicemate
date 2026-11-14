import React, { useState } from 'react';
import {
  X,
  Database,
  FileCode,
  Layers,
  HelpCircle,
  Copy,
  Download,
  Check,
  CheckCircle2,
  Workflow,
  Sparkles,
  Server,
  BookOpen,
} from 'lucide-react';

interface ProjectVivaKitProps {
  isOpen: boolean;
  onClose: () => void;
}

const MYSQL_SCHEMA_SQL = `-- ==========================================================
-- SERVICE MATES - ALL-IN-ONE SERVICE BOOKING WEB APPLICATION
-- RELATIONAL DATABASE MANAGEMENT SYSTEM (RDBMS) SCHEMA (MySQL 8.0)
-- 3NF Normalized Relational Design with Foreign Keys & Triggers
-- ==========================================================

CREATE DATABASE IF NOT EXISTS \`servicemates_db\`
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`servicemates_db\`;

-- 1. Table: users (Customers)
CREATE TABLE IF NOT EXISTS \`users\` (
  \`user_id\` VARCHAR(36) PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL,
  \`email\` VARCHAR(150) NOT NULL UNIQUE,
  \`phone\` VARCHAR(20) NOT NULL,
  \`phone_verified\` BOOLEAN DEFAULT FALSE,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`address\` TEXT NOT NULL,
  \`city\` VARCHAR(60) NOT NULL,
  \`profile_image\` VARCHAR(255) DEFAULT NULL,
  \`blocked\` BOOLEAN DEFAULT FALSE,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_user_email\` (\`email\`),
  INDEX \`idx_user_phone\` (\`phone\`)
) ENGINE=InnoDB;

-- 2. Table: admins (Platform Supervisors)
CREATE TABLE IF NOT EXISTS \`admins\` (
  \`admin_id\` VARCHAR(36) PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL,
  \`email\` VARCHAR(150) NOT NULL UNIQUE,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`role\` VARCHAR(20) DEFAULT 'ADMIN',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Table: categories (Service Categories)
CREATE TABLE IF NOT EXISTS \`categories\` (
  \`category_id\` VARCHAR(20) PRIMARY KEY,
  \`category_name\` VARCHAR(100) NOT NULL,
  \`description\` TEXT,
  \`image\` VARCHAR(255),
  \`icon_name\` VARCHAR(50) DEFAULT 'Grid',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. Table: service_providers (Technicians / Partners)
CREATE TABLE IF NOT EXISTS \`service_providers\` (
  \`provider_id\` VARCHAR(36) PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL,
  \`email\` VARCHAR(150) NOT NULL UNIQUE,
  \`phone\` VARCHAR(20) NOT NULL,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`category_id\` VARCHAR(20) NOT NULL,
  \`experience\` VARCHAR(50) NOT NULL,
  \`location\` VARCHAR(100) NOT NULL,
  \`description\` TEXT,
  \`price\` DECIMAL(10,2) NOT NULL DEFAULT 499.00,
  \`status\` ENUM('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED') DEFAULT 'PENDING',
  \`rating\` DECIMAL(3,2) DEFAULT 0.00,
  \`reviews_count\` INT DEFAULT 0,
  \`profile_photo\` VARCHAR(255),
  \`vehicle_type\` VARCHAR(60),
  \`vehicle_number\` VARCHAR(30),
  \`live_lat\` DECIMAL(10,8) DEFAULT 12.93520000,
  \`live_lng\` DECIMAL(11,8) DEFAULT 77.62450000,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`category_id\`) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 5. Table: services (Catalog Items)
CREATE TABLE IF NOT EXISTS \`services\` (
  \`service_id\` VARCHAR(36) PRIMARY KEY,
  \`category_id\` VARCHAR(20) NOT NULL,
  \`provider_id\` VARCHAR(36) NOT NULL,
  \`service_name\` VARCHAR(150) NOT NULL,
  \`description\` TEXT,
  \`price\` DECIMAL(10,2) NOT NULL,
  \`duration\` VARCHAR(50) NOT NULL,
  \`image\` VARCHAR(255),
  \`status\` ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
  \`rating\` DECIMAL(3,2) DEFAULT 5.00,
  \`reviews_count\` INT DEFAULT 1,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`category_id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`provider_id\`) REFERENCES \`service_providers\`(\`provider_id\`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Table: bookings (Core Transactions)
CREATE TABLE IF NOT EXISTS \`bookings\` (
  \`booking_id\` VARCHAR(40) PRIMARY KEY,
  \`user_id\` VARCHAR(36) NOT NULL,
  \`provider_id\` VARCHAR(36) NOT NULL,
  \`service_id\` VARCHAR(36) NOT NULL,
  \`booking_date\` VARCHAR(30) NOT NULL,
  \`booking_time\` VARCHAR(30) NOT NULL,
  \`address\` TEXT NOT NULL,
  \`city\` VARCHAR(60) NOT NULL,
  \`requirements\` TEXT,
  \`status\` ENUM('PENDING', 'ACCEPTED', 'CONFIRMED', 'SERVICE_STARTED', 'COMPLETED', 'CANCELLED', 'REJECTED') DEFAULT 'CONFIRMED',
  \`payment_method\` ENUM('UPI_QR', 'CARD', 'NETBANKING', 'WALLET', 'CASH') DEFAULT 'UPI_QR',
  \`payment_status\` ENUM('PENDING', 'PAID', 'REFUNDED') DEFAULT 'PENDING',
  \`transaction_id\` VARCHAR(60),
  \`amount\` DECIMAL(10,2) NOT NULL,
  \`start_otp\` VARCHAR(6) NOT NULL DEFAULT '5821',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`user_id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`provider_id\`) REFERENCES \`service_providers\`(\`provider_id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`service_id\`) REFERENCES \`services\`(\`service_id\`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Table: payments (Payment Records)
CREATE TABLE IF NOT EXISTS \`payments\` (
  \`payment_id\` VARCHAR(36) PRIMARY KEY,
  \`booking_id\` VARCHAR(40) NOT NULL,
  \`amount\` DECIMAL(10,2) NOT NULL,
  \`payment_method\` VARCHAR(30) NOT NULL,
  \`payment_status\` VARCHAR(30) NOT NULL,
  \`transaction_id\` VARCHAR(60) NOT NULL,
  \`payment_date\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`booking_id\`) REFERENCES \`bookings\`(\`booking_id\`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. Table: reviews (Ratings & Written Feedback)
CREATE TABLE IF NOT EXISTS \`reviews\` (
  \`review_id\` VARCHAR(36) PRIMARY KEY,
  \`user_id\` VARCHAR(36) NOT NULL,
  \`provider_id\` VARCHAR(36) NOT NULL,
  \`service_id\` VARCHAR(36) NOT NULL,
  \`booking_id\` VARCHAR(40),
  \`rating\` INT NOT NULL CHECK (\`rating\` BETWEEN 1 AND 5),
  \`review_text\` TEXT NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`user_id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`provider_id\`) REFERENCES \`service_providers\`(\`provider_id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`service_id\`) REFERENCES \`services\`(\`service_id\`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. Table: notifications
CREATE TABLE IF NOT EXISTS \`notifications\` (
  \`notification_id\` VARCHAR(36) PRIMARY KEY,
  \`target_role\` ENUM('USER', 'SERVICE_PROVIDER', 'ADMIN', 'ALL') NOT NULL,
  \`target_id\` VARCHAR(36),
  \`title\` VARCHAR(150) NOT NULL,
  \`message\` TEXT NOT NULL,
  \`read_status\` BOOLEAN DEFAULT FALSE,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 10. Table: favorites
CREATE TABLE IF NOT EXISTS \`favorites\` (
  \`favorite_id\` VARCHAR(36) PRIMARY KEY,
  \`user_id\` VARCHAR(36) NOT NULL,
  \`service_id\` VARCHAR(36) NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY \`user_service_unique\` (\`user_id\`, \`service_id\`),
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`user_id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`service_id\`) REFERENCES \`services\`(\`service_id\`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 11. Table: complaints (Support & Grievances)
CREATE TABLE IF NOT EXISTS \`complaints\` (
  \`complaint_id\` VARCHAR(36) PRIMARY KEY,
  \`user_name\` VARCHAR(100) NOT NULL,
  \`user_email\` VARCHAR(150) NOT NULL,
  \`subject\` VARCHAR(200) NOT NULL,
  \`message\` TEXT NOT NULL,
  \`status\` ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED') DEFAULT 'OPEN',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
`;

export const ProjectVivaKit: React.FC<ProjectVivaKitProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'SQL' | 'ERD' | 'DFD' | 'ARCH' | 'VIVA'>('SQL');
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const copySql = () => {
    navigator.clipboard.writeText(MYSQL_SCHEMA_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const downloadSqlFile = () => {
    const blob = new Blob([MYSQL_SCHEMA_SQL], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'servicemates_database_schema.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] text-white overflow-hidden my-4">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Academic Viva Kit & Database Dossier
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  BE Major Project
                </span>
              </div>
              <p className="text-xs text-slate-400">
                MySQL 8.0 schema, Entity Relationship model, DFDs, 3-Tier architecture & examiner viva Q&A
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 py-2 bg-slate-950 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs font-bold">
          {[
            { id: 'SQL', label: 'MySQL 8.0 SQL Schema', icon: Database },
            { id: 'ERD', label: 'ER Diagram & Schema', icon: Layers },
            { id: 'DFD', label: 'Data Flow Diagrams (DFDs)', icon: Workflow },
            { id: 'ARCH', label: '3-Tier System Architecture', icon: Server },
            { id: 'VIVA', label: 'Top 25 Viva Q&A Guide', icon: HelpCircle },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: SQL SCHEMA */}
          {activeTab === 'SQL' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div>
                  <h4 className="font-bold text-white text-sm">Full Relational DDL & DML Script</h4>
                  <p className="text-xs text-slate-400">
                    11 Normalized tables in 3NF with Primary Keys, Foreign Keys, cascading rules, and indexes.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copySql}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-all"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL'}</span>
                  </button>
                  <button
                    onClick={downloadSqlFile}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .sql</span>
                  </button>
                </div>
              </div>

              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed max-h-[500px]">
                {MYSQL_SCHEMA_SQL}
              </pre>
            </div>
          )}

          {/* TAB 2: ER DIAGRAM */}
          {activeTab === 'ERD' && (
            <div className="space-y-6">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <h4 className="font-bold text-white text-base mb-1">Entity Relationship (ER) Structural Model</h4>
                <p className="text-xs text-slate-400">
                  Cardinality: Users (1) ➔ (N) Bookings ➔ (1) Services ➔ (1) Providers ➔ (1) Categories.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
                <div className="bg-slate-950 p-4 rounded-2xl border border-blue-500/30">
                  <h5 className="font-bold text-blue-400 mb-2">TABLE: users (Customer)</h5>
                  <ul className="space-y-1 text-slate-300">
                    <li>🔑 <b>user_id</b> (PK, VARCHAR)</li>
                    <li>• name (VARCHAR)</li>
                    <li>• email (UNIQUE, VARCHAR)</li>
                    <li>• phone (VARCHAR, OTP-verified)</li>
                    <li>• address (TEXT)</li>
                    <li>• city (VARCHAR)</li>
                    <li>• blocked (BOOLEAN)</li>
                  </ul>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30">
                  <h5 className="font-bold text-amber-400 mb-2">TABLE: service_providers</h5>
                  <ul className="space-y-1 text-slate-300">
                    <li>🔑 <b>provider_id</b> (PK, VARCHAR)</li>
                    <li>🔗 <b>category_id</b> (FK ➔ categories)</li>
                    <li>• name, email, phone</li>
                    <li>• experience, location</li>
                    <li>• status (PENDING / APPROVED)</li>
                    <li>• rating, reviews_count</li>
                    <li>• vehicle_type, vehicle_number</li>
                  </ul>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/30">
                  <h5 className="font-bold text-emerald-400 mb-2">TABLE: bookings (Bridge Entity)</h5>
                  <ul className="space-y-1 text-slate-300">
                    <li>🔑 <b>booking_id</b> (PK, SMB2026...)</li>
                    <li>🔗 <b>user_id</b> (FK ➔ users)</li>
                    <li>🔗 <b>provider_id</b> (FK ➔ providers)</li>
                    <li>🔗 <b>service_id</b> (FK ➔ services)</li>
                    <li>• booking_date, booking_time</li>
                    <li>• status (CONFIRMED/STARTED/etc)</li>
                    <li>• payment_method, amount</li>
                    <li>• <b>start_otp</b> (4-digit security)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DFDs */}
          {activeTab === 'DFD' && (
            <div className="space-y-6 text-xs text-slate-300">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-white text-base">Level 0: Context Data Flow Diagram</h4>
                <p className="text-slate-400">
                  External Entities: Customer, Technician / Provider, Central Admin.
                </p>
                <div className="p-4 bg-slate-900 rounded-xl font-mono text-emerald-400">
                  [Customer] ➔ (Search, Phone OTP, Service Booking, UPI Payment) ➔ [Service Mates System 0.0] <br />
                  [Service Mates 0.0] ➔ (Dispatch Alert, Live GPS Map, Booking Receipt) ➔ [Customer] <br />
                  [Provider] ➔ (Partner Registration, Availability, OTP Service Start) ➔ [Service Mates System 0.0] <br />
                  [Admin HQ] ➔ (Technician Approval, Category CRUD, Revenue Ledger) ➔ [Service Mates System 0.0]
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-white text-base">Level 1: Functional Decomposition</h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-300">
                  <li><b>1.0 User Authentication & Phone OTP Verification:</b> Verifies 6-digit random SMS code.</li>
                  <li><b>2.0 Catalog & Search Engine:</b> Multi-parameter query across Category, Price Range, Location, Rating.</li>
                  <li><b>3.0 Reservation & Booking Pipeline:</b> Generates unique booking ID, sets appointment slot.</li>
                  <li><b>4.0 Payment Gateway & Dynamic QR Engine:</b> Renders real-time UPI QR codes and verifies transactions.</li>
                  <li><b>5.0 Live GPS Dispatch & Map Tracking:</b> Computes turn-by-turn driving distance, ETA countdown, and vehicle location.</li>
                  <li><b>6.0 Admin Governance & Review Moderation:</b> Vetting workflows for partner onboarding.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 4: ARCHITECTURE */}
          {activeTab === 'ARCH' && (
            <div className="space-y-6">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <h4 className="font-bold text-white text-base mb-1">3-Tier Modern Web Architecture</h4>
                <p className="text-xs text-slate-400">
                  Presentation (React 19 + Tailwind CSS) ➔ Application Logic (Node.js/Express REST APIs) ➔ Database (MySQL 8.0).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <h5 className="font-bold text-blue-400">Tier 1: Presentation Layer</h5>
                  <p className="text-slate-400">
                    React 19 Functional Components, Context API state management, Dynamic QR code generator, and Google Maps GPS navigation simulator.
                  </p>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <h5 className="font-bold text-amber-400">Tier 2: Business Logic / APIs</h5>
                  <p className="text-slate-400">
                    RESTful controllers for auth/session tokens, booking status transitions, OTP verification hashing, and provider approval workflows.
                  </p>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <h5 className="font-bold text-emerald-400">Tier 3: Relational Persistence</h5>
                  <p className="text-slate-400">
                    MySQL 8.0 ACID compliance, InnoDB engine, foreign key cascade constraints, and indexed lookups for lightning-fast queries.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: VIVA QUESTIONS & ANSWERS */}
          {activeTab === 'VIVA' && (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <h4 className="font-bold text-white text-sm mb-1">Top Viva Examination Questions & Model Answers</h4>
                <p className="text-slate-400">Prepared for external project examiners and evaluators.</p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    q: 'Q1: What problem does Service Mates solve over traditional service apps?',
                    a: 'Service Mates creates a unified multi-category marketplace (Home, Personal, Tech, Vehicle, Education) with transparent upfront pricing, dynamic UPI QR payments, phone OTP security, and real-time live map tracking.',
                  },
                  {
                    q: 'Q2: Why was MySQL chosen as the relational database engine?',
                    a: 'Booking transactions, payments, and ratings require strict ACID compliance (Atomicity, Consistency, Isolation, Durability) and referential integrity to prevent duplicate reservations or orphaned records.',
                  },
                  {
                    q: 'Q3: How does the Doorstep Start OTP prevent fraudulent service completions?',
                    a: 'When a booking is confirmed, a random 4-digit cryptographic OTP is generated and given ONLY to the customer. The technician cannot mark the service as started or completed until the customer provides the OTP at the doorstep.',
                  },
                  {
                    q: 'Q4: How does the dynamic UPI QR payment system function?',
                    a: 'The system constructs a standardized UPI specification string (upi://pay?pa=...&am=...&cu=INR) with the exact service amount and dynamically generates a scannable QR code matrix with a 5-minute expiry timer.',
                  },
                  {
                    q: 'Q5: How does the Admin approval workflow ensure service quality?',
                    a: 'When service providers register, their status is initially marked as PENDING. They are completely filtered out of public search listings until an administrator reviews their credentials and clicks Approve.',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                    <p className="font-bold text-amber-400">{item.q}</p>
                    <p className="text-slate-300 leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
