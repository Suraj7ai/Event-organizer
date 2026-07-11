export type EventStatus = "Draft" | "Sign-off" | "Live" | "Completed";

export type UserRole = "Super Admin" | "Venue Admin" | "Presenter" | "Volunteer";

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

export interface Attendee {
  id: string;
  name: string;
  email: string;
  company: string;
  ticketCode: string;
  status: "Registered" | "Checked-in";
  checkInTime: string | null;
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
