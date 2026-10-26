import { 
  EventDetails, 
  WorkOrder, 
  VerificationChecklists, 
  Attendee, 
  ItineraryItem, 
  FeedbackItem, 
  RoomStatus, 
  Incident 
} from "./types";

export const INITIAL_EVENT: EventDetails = {
  id: "evt-101",
  name: "Google AI Studio Developer Hackathon",
  date: "2026-07-15",
  timeWindow: "09:00 AM - 06:00 PM",
  organizer: "Hack2Skill Global Lead",
  venueName: "Google Singapore - Hall of Cloud (L30)",
  venueAdmin: "Google Office Operations (Admins)",
  status: "Draft",
};

export const INITIAL_WORK_ORDERS: WorkOrder[] = [
  {
    id: "wo-1",
    title: "Verify heavy-duty power lines for high-end server demo laptops",
    category: "AV",
    status: "Pending",
    assignee: "Alex (Facilities Engineer)",
    description: "Ensure the presentation stage has dedicated, surge-protected 30A circuitry to support deep learning demonstration boxes.",
    updatedAt: "2026-07-10 14:30",
  },
  {
    id: "wo-2",
    title: "Guest Wi-Fi Speed & Bandwidth Load Capacity Verification",
    category: "AV",
    status: "In Progress",
    assignee: "Sandeep (IT Support)",
    description: "Perform multiple speed tests on the guest network 'GoogleGuest' to guarantee at least 250 Mbps down/up and clear ports for gRPC/WebSockets.",
    updatedAt: "2026-07-10 15:45",
  },
  {
    id: "wo-3",
    title: "Sanitize washrooms & ensure continuous soap dispenser replenishment",
    category: "Facilities",
    status: "In Progress",
    assignee: "Maria (Cleaning Operations Coordinator)",
    description: "Maintain peak sanitation standard throughout the high-traffic 12-hour duration. Inspect hand dryer functionality.",
    updatedAt: "2026-07-10 16:10",
  },
  {
    id: "wo-4",
    title: "Replenish catering fridge, hydration lines & tea-coffee pantry stock",
    category: "Facilities",
    status: "Pending",
    assignee: "Dave (Pantry Services)",
    description: "Prepare 150 bottles of cold brew, energy drinks, snacks, and water. Set up the catering desk by 08:30 AM.",
    updatedAt: "2026-07-10 11:20",
  },
  {
    id: "wo-5",
    title: "Seating blueprint deployment: Arrange 120 chairs for RSVP attendees",
    category: "Seating",
    status: "Pending",
    assignee: "Google Facilities Crew",
    description: "Set up seating with appropriate walkways. Deploy table structures in the rear for project mentoring desks.",
    updatedAt: "2026-07-10 10:00",
  },
];

export const INITIAL_CHECKLISTS: VerificationChecklists = {
  av: {
    powerCheck: false,
    wifiSpeedMbps: 0,
    wifiVerified: false,
    projectorMicTest: false,
    photoUrl: null,
  },
  facilities: {
    washroomClean: false,
    pantryStockLevel: 45,
    pantryVerified: false,
    photoUrl: null,
  },
  seating: {
    chairsDeployed: 0,
    rsvpCount: 120,
    seatingVerified: false,
    photoUrl: null,
  },
  signOff: {
    venueAdminSigned: false,
    signedBy: "",
    signedAt: null,
  },
};

export const INITIAL_ATTENDEES: Attendee[] = [
  { id: "att-1", name: "David Chen", email: "david.chen@techcorp.io", company: "Aether AI", ticketCode: "H2S-A492B", role: "Attendee", status: "Registered", checkInTime: null, badgePrinted: false },
  { id: "att-2", name: "Sarah Jenkins", email: "sarah.j@google.com", company: "Google Developers", ticketCode: "H2S-G391X", role: "Speaker", status: "Checked-in", checkInTime: "08:45 AM", badgePrinted: true },
  { id: "att-3", name: "Muhammad Rizwan", email: "rizwan@dataincept.com", company: "DataIncept", ticketCode: "H2S-D721A", role: "VIP", status: "Registered", checkInTime: null, badgePrinted: false },
  { id: "att-4", name: "Amara Okeke", email: "amara@devforge.net", company: "DevForge Studio", ticketCode: "H2S-F833Q", role: "Attendee", status: "Checked-in", checkInTime: "08:52 AM", badgePrinted: true },
  { id: "att-5", name: "Hiroshi Sato", email: "hiroshi.s@cybernexus.jp", company: "CyberNexus KK", ticketCode: "H2S-C119W", role: "Attendee", status: "Registered", checkInTime: null, badgePrinted: false },
  { id: "att-6", name: "Elena Rostova", email: "elena.r@neuralpulse.ai", company: "NeuralPulse", ticketCode: "H2S-N581P", role: "VIP", status: "Registered", checkInTime: null, badgePrinted: false },
  { id: "att-7", name: "Dr. Catherine Vance", email: "catherine.v@deepmind.com", company: "Google DeepMind", ticketCode: "H2S-V100S", role: "Speaker", status: "Checked-in", checkInTime: "08:30 AM", badgePrinted: true },
  { id: "att-8", name: "Marcus Aurelius", email: "marcus.a@stoictech.com", company: "StoicTech Solutions", ticketCode: "H2S-S999Z", role: "Staff", status: "Checked-in", checkInTime: "08:15 AM", badgePrinted: true },
  { id: "att-9", name: "Lily Dupont", email: "lily.d@creativespark.fr", company: "CreativeSpark Labs", ticketCode: "H2S-C822V", role: "Attendee", status: "Registered", checkInTime: null, badgePrinted: false },
];

export const INITIAL_ROOMS: RoomStatus[] = [
  {
    id: "room-1",
    name: "Auditorium Alpha (Stage Hall)",
    code: "AUD-L30",
    floor: "Level 30 Central",
    capacity: 150,
    currentOccupancy: 84,
    avStatus: "Ready",
    temperatureC: 21.5,
    leadTechnician: "Marcus (Stage AV Lead)",
    micChecked: true,
    projectorChecked: true,
    screenResolution: "4K UHD Main LED Wall",
    notes: "Lapel mics recharged. Stage confidence monitor active.",
  },
  {
    id: "room-2",
    name: "Workshop Hall Beta",
    code: "WS-W30",
    floor: "Level 30 West Wing",
    capacity: 60,
    currentOccupancy: 42,
    avStatus: "Ready",
    temperatureC: 22.0,
    leadTechnician: "Sandeep (IT Support)",
    micChecked: true,
    projectorChecked: true,
    screenResolution: "Dual 1080p Sony Beamers",
    notes: "Surge-protected power strips deployed at all 15 project tables.",
  },
  {
    id: "room-3",
    name: "Catering & Atrium Lounge",
    code: "ATR-N30",
    floor: "Level 30 North Terrace",
    capacity: 180,
    currentOccupancy: 65,
    avStatus: "Ready",
    temperatureC: 23.0,
    leadTechnician: "Dave (Pantry Services)",
    micChecked: false,
    projectorChecked: false,
    screenResolution: "Digital Signage Displays",
    notes: "Espresso bars online. Cold brew fridges 100% stocked.",
  },
  {
    id: "room-4",
    name: "Speaker Greenroom",
    code: "GR-E30",
    floor: "Level 30 Executive Suite",
    capacity: 20,
    currentOccupancy: 6,
    avStatus: "Ready",
    temperatureC: 20.5,
    leadTechnician: "Alex (Facilities)",
    micChecked: true,
    projectorChecked: true,
    screenResolution: "65-inch 4K Preview Display",
    notes: "Private high-speed network for deck revisions and AV checks.",
  },
  {
    id: "room-5",
    name: "Registration Foyer",
    code: "REG-L30",
    floor: "Level 30 Lobby",
    capacity: 100,
    currentOccupancy: 28,
    avStatus: "Ready",
    temperatureC: 22.2,
    leadTechnician: "Maria (Front Desk Lead)",
    micChecked: false,
    projectorChecked: false,
    screenResolution: "Welcome Kiosks",
    notes: "Thermal badge printers connected to high-speed guest network.",
  },
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: "inc-1",
    title: "Projector HDMI handshake latency on Stage Alpha",
    severity: "P2",
    location: "Auditorium Alpha",
    status: "Investigating",
    reportedBy: "Marcus (Stage AV)",
    reportedAt: "09:42 AM",
    affectedSession: "Technical Session (Dr. Catherine)",
    resolutionNotes: "Calibrating 4K matrix switch port 3.",
  },
  {
    id: "inc-2",
    title: "Level 30 pantry oat milk replenishment",
    severity: "P2",
    location: "Catering & Atrium",
    status: "Resolved",
    reportedBy: "Maria (Facilities)",
    reportedAt: "09:15 AM",
    resolutionNotes: "Restocked 6 cartons from central cold storage.",
  },
];


export const INITIAL_ITINERARY: ItineraryItem[] = [
  {
    id: "it-1",
    originalTime: "09:00",
    title: "Opening Keynote & Event Kickoff",
    speaker: "Hack2Skill Host & Google Lead Developer Advocate",
    durationMinutes: 30,
    deckUploaded: true,
    deckFileName: "Google_AI_Studio_Hackathon_Kickoff_v3.pdf",
    status: "upcoming",
    notes: "Welcoming remarks, API key distributions, and core tracks announcement.",
  },
  {
    id: "it-2",
    originalTime: "09:30",
    title: "Technical Session: Prompt Engineering and Function Calling via @google/genai SDK",
    speaker: "Dr. Catherine Vance (Senior AI Research Engineer)",
    durationMinutes: 45,
    deckUploaded: false,
    deckFileName: null,
    status: "upcoming",
    notes: "Detailed walkthrough of the new TypeScript client, standard structures, and streaming response patterns.",
  },
  {
    id: "it-3",
    originalTime: "10:15",
    title: "Idea Pitching, Team Formations, and Sandbox Provisioning",
    speaker: "Hack2Skill Mentorship Lead",
    durationMinutes: 45,
    deckUploaded: true,
    deckFileName: "Hacking_Rules_Sandbox_Access.pdf",
    status: "upcoming",
    notes: "Rapid 60-second ideas pitch on stage. Matching developers to teams of up to 4 members.",
  },
  {
    id: "it-4",
    originalTime: "11:00",
    title: "Hackathon Phase 1 Begins: Architecture Design & API Setup",
    speaker: "All Dev Teams",
    durationMinutes: 120,
    deckUploaded: false,
    deckFileName: null,
    status: "upcoming",
    notes: "First-round mentoring on database selection, API route structures, and full-stack integration.",
  },
  {
    id: "it-5",
    originalTime: "13:00",
    title: "Lunch Networking & Vendor Catering Showcase",
    speaker: "Gourmet Partners & Host Facilities",
    durationMinutes: 60,
    deckUploaded: false,
    deckFileName: null,
    status: "upcoming",
    notes: "Vegetarian, Vegan, and Halal options served at central pantry Hall.",
  },
];

export const INITIAL_FEEDBACK: FeedbackItem[] = [
  {
    id: "fb-1",
    role: "Attendee",
    rating: 5,
    feedbackText: "The real-time delay tracking saved me from standing around! I knew exactly when the technical session shifted.",
    timestamp: "2026-07-10 18:22",
  },
  {
    id: "fb-2",
    role: "Presenter",
    rating: 4,
    feedbackText: "Loved the dedicated deck upload panel. The 5-minutes-remaining visual was clearly visible on the speaker display console.",
    timestamp: "2026-07-10 18:35",
  },
  {
    id: "fb-3",
    role: "Organizer",
    rating: 5,
    feedbackText: "Checklist sign-offs kept Google Office Admin and Hack2Skill aligned perfectly. No confusion about who approved the high-capacity Wi-Fi.",
    timestamp: "2026-07-10 19:02",
  },
];

export const TECH_STACK_RECOMMENDATION = {
  frontend: [
    { name: "React 19 & Vite", description: "Blazing fast hot reloads, lightweight bundles, and modern functional component architectures." },
    { name: "Tailwind CSS v4", description: "Highly modular, utility-first UI design supporting robust system design, dark-mode variations, and consistent responsive layouts." },
    { name: "Motion (framer-motion)", description: "For fluid route transitions, interactive slide-overs, and visual feedback for wait-time alert popups." },
    { name: "Lucide React", description: "Consistent, professional, highly customizable vector iconography library." },
  ],
  backend: [
    { name: "Node.js (Express Framework)", description: "Lightweight routing and real-time middleware management, hosting API routes and handling file storage uploads safely." },
    { name: "Socket.io / WebSockets", description: "Enables sub-second live state synchronization across distinct physical browser screens (Super Admin, Presenters, Volunteers)." },
    { name: "Firebase (Firestore DB & Auth)", description: "The gold standard for instant real-time data sync via onSnapshot listeners, combined with robust, secure authentication scopes." },
  ],
  hosting: [
    { name: "Google Cloud Run", description: "Serverless, highly scalable containerized hosting, ideal for spinning up Node.js socket servers that automatically scale down during off-event hours." },
    { name: "Cloud Storage Bucket", description: "For secure, edge-replicated presenter deck uploads and PDF hosting, linked with Cloud CDN." },
  ]
};

export const DATABASE_SCHEMAS = {
  postgres: `
-- =====================================================================
-- POSTGRESQL / NEON DATABASE DDL SCHEMAS (MVP ARCHITECTURE)
-- =====================================================================

-- Enums
CREATE TYPE user_role AS ENUM ('Super Admin', 'Venue Admin', 'Presenter', 'Volunteer');
CREATE TYPE event_status AS ENUM ('Draft', 'Sign-off', 'Live', 'Completed');
CREATE TYPE order_category AS ENUM ('AV', 'Facilities', 'Seating', 'General');
CREATE TYPE order_status AS ENUM ('Pending', 'In Progress', 'Blocked', 'Verified');
CREATE TYPE attendee_status AS ENUM ('Registered', 'Checked-in');
CREATE TYPE itinerary_status AS ENUM ('upcoming', 'active', 'completed');

-- Users Table
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role user_role DEFAULT 'Volunteer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Events Table
CREATE TABLE events (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  time_window VARCHAR(100) NOT NULL,
  organizer_id VARCHAR(255) REFERENCES users(id),
  venue_name VARCHAR(255) NOT NULL,
  venue_admin_id VARCHAR(255) REFERENCES users(id),
  status event_status DEFAULT 'Draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Work Orders Table
CREATE TABLE work_orders (
  id VARCHAR(255) PRIMARY KEY,
  event_id VARCHAR(255) REFERENCES events(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  category order_category NOT NULL,
  status order_status DEFAULT 'Pending',
  assignee VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Checklist Verification State
CREATE TABLE checklists (
  id VARCHAR(255) PRIMARY KEY,
  event_id VARCHAR(255) REFERENCES events(id) ON DELETE CASCADE UNIQUE,
  av_power_check BOOLEAN DEFAULT FALSE,
  av_wifi_speed INTEGER DEFAULT 0,
  av_wifi_verified BOOLEAN DEFAULT FALSE,
  av_projector_mic_test BOOLEAN DEFAULT FALSE,
  av_photo_url TEXT,
  fac_washrooms_clean BOOLEAN DEFAULT FALSE,
  fac_pantry_level INTEGER DEFAULT 0,
  fac_pantry_verified BOOLEAN DEFAULT FALSE,
  fac_photo_url TEXT,
  seat_chairs_deployed INTEGER DEFAULT 0,
  seat_rsvp_count INTEGER DEFAULT 0,
  seat_verified BOOLEAN DEFAULT FALSE,
  seat_photo_url TEXT,
  admin_signed BOOLEAN DEFAULT FALSE,
  signed_by_admin_id VARCHAR(255) REFERENCES users(id),
  signed_at TIMESTAMP WITH TIME ZONE
);

-- Attendees Table
CREATE TABLE attendees (
  id VARCHAR(255) PRIMARY KEY,
  event_id VARCHAR(255) REFERENCES events(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  ticket_code VARCHAR(100) UNIQUE NOT NULL,
  status attendee_status DEFAULT 'Registered',
  check_in_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Itinerary Tracker Table
CREATE TABLE itinerary_items (
  id VARCHAR(255) PRIMARY KEY,
  event_id VARCHAR(255) REFERENCES events(id) ON DELETE CASCADE,
  original_time VARCHAR(10) NOT NULL, -- HH:MM (24h format)
  title VARCHAR(255) NOT NULL,
  speaker VARCHAR(255) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  deck_uploaded BOOLEAN DEFAULT FALSE,
  deck_file_name VARCHAR(255),
  status itinerary_status DEFAULT 'upcoming',
  notes TEXT,
  sequence_order INTEGER NOT NULL
);

-- Feedback Loop Table
CREATE TABLE feedbacks (
  id VARCHAR(255) PRIMARY KEY,
  event_id VARCHAR(255) REFERENCES events(id) ON DELETE CASCADE,
  submitter_role VARCHAR(100) NOT NULL, -- 'Attendee', 'Presenter', 'Organizer'
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
  `,
  drizzle: `
import { pgTable, varchar, boolean, integer, timestamp, date, pgEnum, text } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["Super Admin", "Venue Admin", "Presenter", "Volunteer"]);
export const eventStatusEnum = pgEnum("event_status", ["Draft", "Sign-off", "Live", "Completed"]);
export const orderCategoryEnum = pgEnum("order_category", ["AV", "Facilities", "Seating", "General"]);
export const orderStatusEnum = pgEnum("order_status", ["Pending", "In Progress", "Blocked", "Verified"]);
export const attendeeStatusEnum = pgEnum("attendee_status", ["Registered", "Checked-in"]);
export const itineraryStatusEnum = pgEnum("itinerary_status", ["upcoming", "active", "completed"]);

export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  role: userRoleEnum("role").default("Volunteer"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const events = pgTable("events", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  date: date("date").notNull(),
  timeWindow: varchar("time_window", { length: 100 }).notNull(),
  organizerId: varchar("organizer_id", { length: 255 }).references(() => users.id),
  venueName: varchar("venue_name", { length: 255 }).notNull(),
  venueAdminId: varchar("venue_admin_id", { length: 255 }).references(() => users.id),
  status: eventStatusEnum("status").default("Draft"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const workOrders = pgTable("work_orders", {
  id: varchar("id", { length: 255 }).primaryKey(),
  eventId: varchar("event_id", { length: 255 }).references(() => events.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  category: orderCategoryEnum("category").notNull(),
  status: orderStatusEnum("status").default("Pending"),
  assignee: varchar("assignee", { length: 255 }).notNull(),
  description: text("description").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const checklists = pgTable("checklists", {
  id: varchar("id", { length: 255 }).primaryKey(),
  eventId: varchar("event_id", { length: 255 }).references(() => events.id, { onDelete: "cascade" }).unique(),
  avPowerCheck: boolean("av_power_check").default(false),
  avWifiSpeed: integer("av_wifi_speed").default(0),
  avWifiVerified: boolean("av_wifi_verified").default(false),
  avProjectorMicTest: boolean("av_projector_mic_test").default(false),
  avPhotoUrl: text("av_photo_url"),
  facWashroomsClean: boolean("fac_washrooms_clean").default(false),
  facPantryLevel: integer("fac_pantry_level").default(0),
  facPantryVerified: boolean("fac_pantry_verified").default(false),
  facPhotoUrl: text("fac_photo_url"),
  seatChairsDeployed: integer("seat_chairs_deployed").default(0),
  seatRsvpCount: integer("seat_rsvp_count").default(0),
  seatVerified: boolean("seat_verified").default(false),
  seatPhotoUrl: text("seat_photo_url"),
  adminSigned: boolean("admin_signed").default(false),
  signedByAdminId: varchar("signed_by_admin_id").references(() => users.id),
  signedAt: timestamp("signed_at"),
});

export const attendees = pgTable("attendees", {
  id: varchar("id", { length: 255 }).primaryKey(),
  eventId: varchar("event_id", { length: 255 }).references(() => events.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  ticketCode: varchar("ticket_code", { length: 100 }).unique().notNull(),
  status: attendeeStatusEnum("status").default("Registered"),
  checkInTime: timestamp("check_in_time"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const itineraryItems = pgTable("itinerary_items", {
  id: varchar("id", { length: 255 }).primaryKey(),
  eventId: varchar("event_id", { length: 255 }).references(() => events.id, { onDelete: "cascade" }),
  originalTime: varchar("original_time", { length: 10 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  speaker: varchar("speaker", { length: 255 }).notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  deckUploaded: boolean("deck_uploaded").default(false),
  deckFileName: varchar("deck_file_name", { length: 255 }),
  status: itineraryStatusEnum("status").default("upcoming"),
  notes: text("notes"),
  sequenceOrder: integer("sequence_order").notNull(),
});

export const feedbacks = pgTable("feedbacks", {
  id: varchar("id", { length: 255 }).primaryKey(),
  eventId: varchar("event_id", { length: 255 }).references(() => events.id, { onDelete: "cascade" }),
  submitterRole: varchar("submitter_role", { length: 100 }).notNull(),
  rating: integer("rating").notNull(),
  feedbackText: text("feedback_text").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});
  `
};

export const MVP_ROADMAP = [
  {
    phase: "Phase 1: Database Setup & API Anchors",
    items: [
      { id: "p1-1", title: "Provision Firestore or Cloud SQL (PostgreSQL) using the database schema provided.", completed: true },
      { id: "p1-2", title: "Create API routes under '/api/events' and '/api/work-orders' to fetch and manipulate logistics.", completed: false },
      { id: "p1-3", title: "Deploy initial user schema with tier validations for Venue Admins and Super Admins.", completed: false },
    ],
  },
  {
    phase: "Phase 2: State-Machine & Infrastructure Sign-off",
    items: [
      { id: "p2-1", title: "Implement the Kanban Work Order state machine engine with status limits (cannot go Live without Sign-off).", completed: true },
      { id: "p2-2", title: "Build the Numerical / Photo upload logic for AV, Facilities, and Seating (Chairs RSVP vs Deployed count).", completed: true },
      { id: "p2-3", title: "Create the digital Signature capture mechanism strictly locked to authenticated Venue Admin accounts.", completed: false },
    ],
  },
  {
    phase: "Phase 3: Real-Time Sync & Presenter Hub",
    items: [
      { id: "p3-1", title: "Establish WebSocket channels or Firestore live listeners for real-time itinerary syncing.", completed: true },
      { id: "p3-2", title: "Integrate Live Delay Propagation engine (cascading times automatically on presenter delay input).", completed: true },
      { id: "p3-3", title: "Build rapid QR scanning simulation utilizing SVG-based codes and instant alert triggers.", completed: true },
    ],
  },
  {
    phase: "Phase 4: Feedback Loop & Analytics Launch",
    items: [
      { id: "p4-1", title: "Configure closing keynote triggers to push feedback forms to attendee emails automatically.", completed: false },
      { id: "p4-2", title: "Build real-time analytics aggregation showing average ratings and structural operations logs.", completed: true },
      { id: "p4-3", title: "Complete cross-role dashboard simulator layout tests to verify live operation alignment.", completed: true },
    ],
  },
];
