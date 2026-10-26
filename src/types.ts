export type EventStatus = "Draft" | "Sign-off" | "Live" | "Completed";

export type UserRole = "Super Admin" | "Venue Admin" | "Presenter" | "Volunteer";

export type TabType = "operations" | "rooms" | "checkin" | "itinerary" | "incidents" | "architecture" | "roadmap";

export interface EventDetails {
  id: string;
  name: string;
  date: string;
  timeWindow: string;
  organizer: string;
  venueName: string;
  venueAdmin: string;
  status: EventStatus;
}

export type WorkOrderStatus = "Pending" | "In Progress" | "Blocked" | "Verified";
export type WorkOrderCategory = "AV" | "Facilities" | "Seating" | "General";

export interface WorkOrder {
  id: string;
  title: string;
  category: WorkOrderCategory;
  status: WorkOrderStatus;
  assignee: string;
  description: string;
  updatedAt: string;
}

export interface VerificationChecklists {
  av: {
    powerCheck: boolean;
    wifiSpeedMbps: number;
    wifiVerified: boolean;
    projectorMicTest: boolean;
    photoUrl: string | null;
  };
  facilities: {
    washroomClean: boolean;
    pantryStockLevel: number; // percentage (0-100)
    pantryVerified: boolean;
    photoUrl: string | null;
  };
  seating: {
    chairsDeployed: number;
    rsvpCount: number;
    seatingVerified: boolean;
    photoUrl: string | null;
  };
  signOff: {
    venueAdminSigned: boolean;
    signedBy: string;
    signedAt: string | null;
  };
}

export type AttendeeRole = "Attendee" | "VIP" | "Speaker" | "Staff" | "Organizer";

export interface Attendee {
  id: string;
  name: string;
  email: string;
  company: string;
  ticketCode: string;
  role: AttendeeRole;
  status: "Registered" | "Checked-in";
  checkInTime: string | null;
  badgePrinted?: boolean;
}

export interface ItineraryItem {
  id: string;
  originalTime: string; // HH:MM
  title: string;
  speaker: string;
  durationMinutes: number;
  deckUploaded: boolean;
  deckFileName: string | null;
  status: "upcoming" | "active" | "completed";
  notes: string;
}

export interface FeedbackItem {
  id: string;
  role: "Attendee" | "Presenter" | "Organizer";
  rating: number; // 1-5
  feedbackText: string;
  timestamp: string;
}

export interface RoomStatus {
  id: string;
  name: string;
  code: string;
  floor: string;
  capacity: number;
  currentOccupancy: number;
  avStatus: "Ready" | "Degraded" | "Offline";
  temperatureC: number;
  leadTechnician: string;
  micChecked: boolean;
  projectorChecked: boolean;
  screenResolution: string;
  notes: string;
}

export type IncidentSeverity = "P0" | "P1" | "P2";
export type IncidentStatus = "Open" | "Investigating" | "Resolved";

export interface Incident {
  id: string;
  title: string;
  severity: IncidentSeverity;
  location: string;
  status: IncidentStatus;
  reportedBy: string;
  reportedAt: string;
  affectedSession?: string;
  resolutionNotes?: string;
}
