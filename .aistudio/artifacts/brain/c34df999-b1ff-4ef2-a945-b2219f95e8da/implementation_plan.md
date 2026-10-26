# Google Cloud Operations Hub: Production-Grade Event Coordination

A streamlined, high-reliability event operations console engineered for cross-organization logistics between Hack2Skill organizers, host venue facilities managers, speakers, and check-in teams. Styled with the clean minimalism of Google Cloud Console and Google Workspace Material Design 3.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following product design choices and operational additions have been locked in from your responses and will guide the build:

- **Aesthetic Direction**: Google Cloud & Workspace console with clean Material Design 3, Google Blue (`#1a73e8`), Google Red (`#d93025`), Google Green (`#1e8e3e`), Google Amber (`#f9ab00`), high legibility, zero static pill clutter, and compact tabular numerals.
- **Operational Capabilities Added**:
  1. **Live Incident Dispatcher & SOS Broadcast**: Real-time triage center for emergency announcements, AV failures, and facility escalations with severity tiers (P0 Critical, P1 High, P2 Normal) and audio/visual alerts.
  2. **Interactive Venue Floor Plan & Room Readiness Matrix**: Multi-room venue monitoring (Main Auditorium, Workshop Hall, Catering Lounge, Registration Foyer) displaying real-time occupancy, environmental status, and assigned AV technicians.
  3. **QR Badge Generator & Printable Attendee Slips**: Instant badge slip generation with scan codes, credential tags, and print-optimized lanyard layouts.
  4. **Run of Show PDF Export & Google Sheets Sync**: Instant exportable timeline manifests, live copy-to-clipboard spreadsheet format, and print-ready operational binders.
- **Data Persistence**: Browser `localStorage` with automated state sync, snapshot JSON export, and single-click restoration to golden-master defaults.

---

## 1. Overview & Core Concept

- **What It Does**: Unifies event day-of logistics into a single, mission-critical operations console. Manages pre-event sign-offs, live work orders, attendee check-in desks, presenter itinerary time cascades, incident dispatching, and venue room readiness without cross-team radio friction.
- **Target Audience / Personas**:
  - *Super Admin (Hack2Skill Lead)*: Global schedule control, cascade delay management, broadcast announcements, and final run-of-show exports.
  - *Venue Admin (Google Facility Team)*: Checklists, power/Wi-Fi verifications, physical room readiness, and formal sign-offs.
  - *Presenter (Guest Speakers)*: Deck upload verifications, live stage countdowns, and schedule cascade alerts.
  - *Volunteer (Check-in Staff)*: Rapid attendee QR scanning, walk-in registration, and badge printing.
- **Key Value**: Replaces scattered Slack messages, paper clipboards, and lost run-of-show sheets with an operational console that maintains real-time synchronization across organizational boundaries.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Morning Readiness & Sign-off**:
   Venue Admin checks off physical items (Wi-Fi speed test, power, pantry inventory), uploads verification photos, enters room telemetry, and digital-signs the turnover agreement to shift event status from *Draft* to *Live*.
2. **Live Operational Command & Incident Triage**:
   Organizers view the real-time Room Matrix and Itinerary. If a speaker exceeds their slot or an AV mic drops out, the operator triggers a schedule offset (+10 mins) which cascades down all subsequent slots, or raises a P0 Incident broadcast that immediately banners across all team screens.
3. **Attendee Processing & Badge Issuance**:
   Volunteers search or scan incoming attendees, mark check-ins with one click, and instantly generate a thermal/lanyard badge pass printable with native browser print styling.
4. **Post-Event Wrap-up & Data Export**:
   Admins download the full audit log, export attendee lists for Google Sheets, print the post-mortem summary, and safely backup or reset the event state.

### Visual Identity & Theme

- **Design System**: Google Cloud Console & Workspace Material Design 3.
- **Color Palette**:
  - Surface: Pristine off-white `#F8F9FA` with clean `#FFFFFF` workspace cards and `#E8EAED` divider lines.
  - Primary Action: Google Blue (`#1A73E8`, hover `#174EA6`, active `#1558D6`).
  - Semantic Status:
    - Active / Nominal: Google Green (`#1E8E3E`, light `#E6F4EA`).
    - Warning / Delay: Google Amber (`#F9AB00`, light `#FEF7E0`).
    - Urgent / P0 Incident: Google Red (`#D93025`, light `#FCE8E6`).
    - Informational: Google Slate (`#5F6368`, light `#F1F3F4`).
- **Typography & Anti-Slop Discipline**:
  - Google Sans / Product Sans styling pairing crisp geometric headings with clean system typography.
  - Strict Tabular Numerals (`font-mono` / `tabular-nums`) for all clock displays, Wi-Fi benchmarks, countdowns, and room metrics.
  - Zero static pill capsules: All tags, statuses, and timestamps are rendered as unboxed typography separated by quiet mid-dots (`·`) and subtle status dots.
- **Navigation & Command**:
  - Google Cloud-style top app bar with project switcher, live UTC/Local time clocks, quick search / Command bar (`Ctrl+K`), and a role switcher.
  - Google-style segmented view switchers with active white pill elevation on cool gray tracking rails.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Modular Tabbed Console vs. Infinite Vertical Scroll**
  - *Chosen Approach*: Tabbed Google Cloud Console layout (Operations Dashboard, Floor & Room Matrix, Incident Center, Run of Show & Export, Architecture & Roadmap) with persistent global incident banner.
  - *Why*: Eliminates endless scrolling during high-stress live events, allowing staff to focus exclusively on their active workstation (Check-in, Floor AV, or Incident dispatch) while keeping alerts globally visible.
  - *Alternatives Considered*: Single-page vertical stack caused information overload and required extensive scrolling between floor checklists and check-in desks.

- **Decision 2: Client-Side LocalStorage with Backup Snapshots vs. External Database**
  - *Chosen Approach*: Self-contained `localStorage` persistence engine with automatic schema validation, manual snapshot export/import, and instant default state restore.
  - *Why*: Guarantees zero cloud provisioning latency, 100% offline resilience during venue Wi-Fi drops, and instant portability for event organizers running in ephemeral environments.
  - *Alternatives Considered*: Pure in-memory state would lose data on accidental browser tab refresh.

- **Decision 3: Native Print CSS Lanyard Badges vs. External PDF Canvas Renderer**
  - *Chosen Approach*: Embedded high-resolution SVG QR generator with dedicated `@media print` CSS modal that prints standard conference lanyard badges and run-of-show sheets directly via the browser's native print engine.
  - *Why*: Instant generation with zero heavy external PDF dependencies, razor-sharp vector output, and compatible with thermal label printers and office printers alike.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Google Cloud Event Operations Hub                    │
├────────────────────────────────────────────────────────────────────────┤
│  Top Bar: Event Status · UTC Clock · Role Switcher · Quick Search (⌘K) │
├────────────────────────────────────────────────────────────────────────┤
│  Global Incident Notification Rail (P0/P1 Alert Chimes & Broadcasts)   │
├───────────────────┬────────────────────────────────────────────────────┤
│ Navigation Rail   │ Active Operational Workspace                       │
│                   │                                                    │
│ ├─ Overview       │  ┌──────────────────────┐  ┌─────────────────────┐ │
│ ├─ Checklists     │  │ Room Readiness Grid  │  │ Live Work Orders    │ │
│ ├─ Check-in Desk  │  │ (AV, HVAC, Seats)    │  │ (Pending/Verified)  │ │
│ ├─ Itinerary (RoS)│  └──────────────────────┘  └─────────────────────┘ │
│ ├─ Incidents (SOS)│  ┌──────────────────────┐  ┌─────────────────────┐ │
│ ├─ Floor Plan     │  │ QR Badge & Check-in  │  │ Itinerary Cascade   │ │
│ └─ Data & Export  │  │ (Print Modal + Fast) │  │ (+Offset Propagate) │ │
│                   │  └──────────────────────┘  └─────────────────────┘ │
├───────────────────┴────────────────────────────────────────────────────┤
│ Storage Layer: LocalStorage Engine · Auto-Sync · JSON Backup · Reset   │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Model & Entities

```typescript
// Core Data Entities
interface RoomStatus {
  id: string;
  name: string;
  capacity: number;
  currentOccupancy: number;
  avStatus: "Ready" | "Degraded" | "Offline";
  temperatureC: number;
  leadTechnician: string;
  notes: string;
}

interface Incident {
  id: string;
  title: string;
  severity: "P0" | "P1" | "P2";
  location: string;
  status: "Open" | "Investigating" | "Resolved";
  reportedBy: string;
  reportedAt: string;
  resolutionNotes?: string;
}

interface AttendeeBadge {
  id: string;
  name: string;
  company: string;
  email: string;
  ticketCode: string;
  role: "VIP" | "Speaker" | "Attendee" | "Staff";
  checkInStatus: "Registered" | "Checked-in";
  checkInTime: string | null;
}
```

### Interactive Component & State Mapping

- **Incident Dispatcher**:
  - User Action: Click `Report SOS Incident` -> modal inputs location, severity (P0/P1/P2), and issue -> Submits.
  - State Mutation: Prepends to `incidents` list, sets active banner alert, plays subtle Web Audio chime, saves to `localStorage`.
- **Floor Plan & Room Matrix**:
  - User Action: Toggle room AV checks, update room temperature or occupancy count.
  - State Mutation: Immediate re-calculation of venue readiness percentage and automated prompt to facilities admin.
- **QR Badge Generator & Print Desk**:
  - User Action: Click `Print Badge` on any attendee row -> Opens minimalist Google-styled badge modal with QR Code, event branding, attendee name, and company -> Trigger native browser print dialog.
- **Run of Show & Sheet Sync**:
  - User Action: Apply `+15 min` schedule delay -> updates all future sessions while preserving completed ones -> Click `Copy for Google Sheets` copies TSV/CSV format directly to clipboard with confirmation toast -> Click `Print Run of Show` loads clean print-ready layout.
- **Data Persistence Manager**:
  - User Action: Click `Export JSON Backup` -> initiates file download of event state; Click `Reset to Default` -> clears custom overrides and resets to verified test fixture data.
