import React, { useState, useEffect } from "react";
import { 
  INITIAL_EVENT, 
  INITIAL_WORK_ORDERS, 
  INITIAL_CHECKLISTS, 
  INITIAL_ATTENDEES, 
  INITIAL_ITINERARY, 
  INITIAL_FEEDBACK,
  INITIAL_ROOMS,
  INITIAL_INCIDENTS
} from "./data";
import { 
  EventDetails, 
  WorkOrder, 
  VerificationChecklists, 
  Attendee, 
  AttendeeRole,
  ItineraryItem, 
  FeedbackItem, 
  RoomStatus,
  Incident,
  IncidentStatus,
  UserRole, 
  EventStatus,
  WorkOrderStatus,
  TabType
} from "./types";

import GoogleHeader from "./components/GoogleHeader";
import CommandPalette from "./components/CommandPalette";
import BadgeModal from "./components/BadgeModal";
import RunOfShowExportModal from "./components/RunOfShowExportModal";
import IncidentDispatcher from "./components/IncidentDispatcher";
import RoomReadinessMatrix from "./components/RoomReadinessMatrix";
import WorkOrderEngine from "./components/WorkOrderEngine";
import ChecklistVerifier from "./components/ChecklistVerifier";
import CheckInDesk from "./components/CheckInDesk";
import ItineraryTracker from "./components/ItineraryTracker";
import PostEventLoop from "./components/PostEventLoop";
import ArchitectureViewer from "./components/ArchitectureViewer";
import RoadmapViewer from "./components/RoadmapViewer";

import { 
  Activity, 
  Clock, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  FileSpreadsheet, 
  Radio, 
  RotateCcw,
  Sparkles,
  User,
  ShieldAlert
} from "lucide-react";

// LocalStorage Keys
const STORAGE_KEY_PREFIX = "GOOGLE_EVENT_OPS_HUB_";

export default function App() {
  // Helper to load state from localStorage or fallback
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PREFIX + key);
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  };

  // Global States with LocalStorage Hydration
  const [event, setEvent] = useState<EventDetails>(() => loadStored("EVENT", INITIAL_EVENT));
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(() => loadStored("WORK_ORDERS", INITIAL_WORK_ORDERS));
  const [checklists, setChecklists] = useState<VerificationChecklists>(() => loadStored("CHECKLISTS", INITIAL_CHECKLISTS));
  const [attendees, setAttendees] = useState<Attendee[]>(() => loadStored("ATTENDEES", INITIAL_ATTENDEES));
  const [itinerary, setItinerary] = useState<ItineraryItem[]>(() => loadStored("ITINERARY", INITIAL_ITINERARY));
  const [delayOffset, setDelayOffset] = useState<number>(() => loadStored("DELAY_OFFSET", 0));
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(() => loadStored("FEEDBACK", INITIAL_FEEDBACK));
  const [rooms, setRooms] = useState<RoomStatus[]>(() => loadStored("ROOMS", INITIAL_ROOMS));
  const [incidents, setIncidents] = useState<Incident[]>(() => loadStored("INCIDENTS", INITIAL_INCIDENTS));
  
  // Navigation & Simulation Persona
  const [activeTab, setActiveTab] = useState<TabType>("operations");
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(() => loadStored("USER_ROLE", "Super Admin"));

  // Modals state
  const [selectedBadgeAttendee, setSelectedBadgeAttendee] = useState<Attendee | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // UTC and Local Singapore Time Clocks
  const [liveUtcTime, setLiveUtcTime] = useState("");
  const [liveLocalTime, setLiveLocalTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveUtcTime(now.toUTCString().replace("GMT", "UTC").split(" ").slice(4, 5)[0]);
      setLiveLocalTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync to LocalStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + "EVENT", JSON.stringify(event));
      localStorage.setItem(STORAGE_KEY_PREFIX + "WORK_ORDERS", JSON.stringify(workOrders));
      localStorage.setItem(STORAGE_KEY_PREFIX + "CHECKLISTS", JSON.stringify(checklists));
      localStorage.setItem(STORAGE_KEY_PREFIX + "ATTENDEES", JSON.stringify(attendees));
      localStorage.setItem(STORAGE_KEY_PREFIX + "ITINERARY", JSON.stringify(itinerary));
      localStorage.setItem(STORAGE_KEY_PREFIX + "DELAY_OFFSET", JSON.stringify(delayOffset));
      localStorage.setItem(STORAGE_KEY_PREFIX + "FEEDBACK", JSON.stringify(feedbacks));
      localStorage.setItem(STORAGE_KEY_PREFIX + "ROOMS", JSON.stringify(rooms));
      localStorage.setItem(STORAGE_KEY_PREFIX + "INCIDENTS", JSON.stringify(incidents));
      localStorage.setItem(STORAGE_KEY_PREFIX + "USER_ROLE", JSON.stringify(currentUserRole));
    } catch (e) {
      console.warn("LocalStorage save error:", e);
    }
  }, [event, workOrders, checklists, attendees, itinerary, delayOffset, feedbacks, rooms, incidents, currentUserRole]);

  // Handlers
  const handleUpdateWorkOrderStatus = (id: string, status: WorkOrderStatus) => {
    setWorkOrders((prev) =>
      prev.map((wo) =>
        wo.id === id
          ? { ...wo, status, updatedAt: new Date().toISOString().substring(0, 16).replace("T", " ") }
          : wo
      )
    );
  };

  const handleAddWorkOrder = (newWo: Omit<WorkOrder, "id" | "updatedAt">) => {
    const nextId = `wo-${workOrders.length + 1}`;
    const timestamp = new Date().toISOString().substring(0, 16).replace("T", " ");
    setWorkOrders((prev) => [
      ...prev,
      {
        ...newWo,
        id: nextId,
        updatedAt: timestamp,
      },
    ]);
  };

  const handleUpdateChecklists = (updater: (prev: VerificationChecklists) => VerificationChecklists) => {
    setChecklists((prev) => updater(prev));
  };

  const handleUpdateEventStatus = (status: EventStatus) => {
    setEvent((prev) => ({ ...prev, status }));
  };

  const handleCheckInAttendee = (id: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAttendees((prev) =>
      prev.map((att) =>
        att.id === id ? { ...att, status: "Checked-in", checkInTime: timestamp } : att
      )
    );
  };

  const handleRegisterNewAttendee = (name: string, email: string, company: string, role: AttendeeRole = "Attendee") => {
    const nextId = `att-${attendees.length + 1}`;
    const code = `H2S-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const newAttendee: Attendee = {
      id: nextId,
      name,
      email,
      company,
      ticketCode: code,
      role,
      status: "Checked-in",
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      badgePrinted: true,
    };
    setAttendees((prev) => [newAttendee, ...prev]);
    // Automatically open badge for walk-in
    setSelectedBadgeAttendee(newAttendee);
  };

  const handleMarkBadgePrinted = (id: string) => {
    setAttendees((prev) =>
      prev.map((att) => (att.id === id ? { ...att, badgePrinted: true } : att))
    );
  };

  const handleUpdateDelayOffset = (minutes: number) => {
    setDelayOffset(minutes);
  };

  const handleUpdateItineraryItem = (id: string, updater: (item: ItineraryItem) => ItineraryItem) => {
    setItinerary((prev) => prev.map((it) => (it.id === id ? updater(it) : it)));
  };

  const handleAddFeedback = (newFb: Omit<FeedbackItem, "id" | "timestamp">) => {
    const nextId = `fb-${feedbacks.length + 1}`;
    const timestamp = new Date().toISOString().substring(0, 16).replace("T", " ");
    setFeedbacks((prev) => [
      ...prev,
      {
        ...newFb,
        id: nextId,
        timestamp,
      },
    ]);
  };

  const handleUpdateRoom = (id: string, updater: (prev: RoomStatus) => RoomStatus) => {
    setRooms((prev) => prev.map((r) => (r.id === id ? updater(r) : r)));
  };

  const handleAddIncident = (newInc: Omit<Incident, "id" | "reportedAt">) => {
    const nextId = `inc-${incidents.length + 1}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setIncidents((prev) => [
      {
        ...newInc,
        id: nextId,
        reportedAt: timestamp,
      },
      ...prev,
    ]);
  };

  const handleUpdateIncidentStatus = (id: string, status: IncidentStatus, resolutionNotes?: string) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === id
          ? {
              ...inc,
              status,
              resolutionNotes: resolutionNotes || inc.resolutionNotes,
            }
          : inc
      )
    );
  };

  // Backup & Reset Handlers
  const handleDownloadBackup = () => {
    const stateSnapshot = {
      exportedAt: new Date().toISOString(),
      event,
      workOrders,
      checklists,
      attendees,
      itinerary,
      delayOffset,
      rooms,
      incidents,
      feedbacks,
    };
    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(stateSnapshot, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonStr);
    downloadAnchor.setAttribute("download", `Google_Event_Ops_Snapshot_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleResetDefaults = () => {
    if (window.confirm("Reset all operational data to verified demo defaults? Local modifications will be cleared.")) {
      localStorage.clear();
      setEvent(INITIAL_EVENT);
      setWorkOrders(INITIAL_WORK_ORDERS);
      setChecklists(INITIAL_CHECKLISTS);
      setAttendees(INITIAL_ATTENDEES);
      setItinerary(INITIAL_ITINERARY);
      setDelayOffset(0);
      setFeedbacks(INITIAL_FEEDBACK);
      setRooms(INITIAL_ROOMS);
      setIncidents(INITIAL_INCIDENTS);
      setCurrentUserRole("Super Admin");
      setActiveTab("operations");
    }
  };

  // Role permissions description
  const getRolePermissionsDescription = (role: UserRole) => {
    switch (role) {
      case "Super Admin":
        return "Hack2Skill Global Lead. Full authorization: broadcast P0 alerts, sign-off oversight, itinerary delay cascade, and Run of Show export.";
      case "Venue Admin":
        return "Google Office Operations Admins. Inspect physical AV power grids, room telemetry, HVAC setpoints, and sign-off venue DDL.";
      case "Presenter":
        return "Guest Speaker. Stage access: Upload presentation PDF decks, view stage confidence timer, and monitor schedule offsets.";
      case "Volunteer":
        return "Front Desk Check-in Staff. Fast attendee verification, QR credentials, walk-in registration, and thermal badge issuance.";
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans antialiased text-[#202124]">
      {/* Google Cloud Header */}
      <GoogleHeader
        event={event}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentUserRole={currentUserRole}
        onRoleChange={setCurrentUserRole}
        liveUtcTime={liveUtcTime}
        liveLocalTime={liveLocalTime}
        delayOffset={delayOffset}
        incidents={incidents}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onDownloadBackup={handleDownloadBackup}
        onResetDefaults={handleResetDefaults}
        onTriggerSOS={() => {
          setActiveTab("incidents");
        }}
      />

      {/* Role Context Notification Bar */}
      <div className="bg-[#e8f0fe]/60 border-b border-[#d2e3fc] py-2.5 px-6 flex items-center justify-between text-xs text-[#174ea6]">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-[#1a73e8] shrink-0" />
          <span>
            <strong>Simulating: {currentUserRole}</strong> — {getRolePermissionsDescription(currentUserRole)}
          </span>
        </div>
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-[#1a73e8] hover:underline cursor-pointer"
        >
          <span>Quick Actions (Ctrl+K)</span>
        </button>
      </div>

      {/* Main Content Viewport */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-6">
        
        {/* TAB 1: OPERATIONS DASHBOARD */}
        {activeTab === "operations" && (
          <div className="space-y-6">
            {/* Event Summary Bar */}
            <div className="bg-white rounded-2xl border border-[#dadce0] p-5 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <span className="text-[10px] uppercase font-semibold text-[#5f6368] tracking-wider">
                    Google Singapore Level 30
                  </span>
                  <span className="text-[#dadce0]">·</span>
                  <span className="text-xs font-mono font-medium text-[#1e8e3e]">
                    Event Live Sync Active
                  </span>
                </div>
                <h2 className="text-lg font-bold text-[#202124]">{event.name}</h2>
                <p className="text-xs text-[#5f6368]">
                  Venue: <strong>{event.venueName}</strong> · Lead Organizer: <strong>{event.organizer}</strong>
                </p>
              </div>

              <div className="flex gap-3 flex-wrap justify-center text-xs">
                <div className="bg-[#f8f9fa] border border-[#e8eaed] px-3.5 py-2 rounded-xl text-center min-w-[110px]">
                  <span className="block text-[#70757a] font-medium text-[10px] uppercase tracking-wider">Event Date</span>
                  <span className="font-mono font-semibold text-[#202124] mt-0.5 block">{event.date}</span>
                </div>
                <div className="bg-[#f8f9fa] border border-[#e8eaed] px-3.5 py-2 rounded-xl text-center min-w-[110px]">
                  <span className="block text-[#70757a] font-medium text-[10px] uppercase tracking-wider">Time Window</span>
                  <span className="font-mono font-semibold text-[#202124] mt-0.5 block">{event.timeWindow}</span>
                </div>
                <div className="bg-[#f8f9fa] border border-[#e8eaed] px-3.5 py-2 rounded-xl text-center min-w-[110px]">
                  <span className="block text-[#70757a] font-medium text-[10px] uppercase tracking-wider">Delay Offset</span>
                  <span className={`font-mono font-bold mt-0.5 block ${delayOffset > 0 ? "text-[#d93025]" : "text-[#1e8e3e]"}`}>
                    +{delayOffset} mins
                  </span>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => setIsExportModalOpen(true)}
                    className="px-3 py-2 bg-white border border-[#dadce0] hover:bg-[#f1f3f4] text-[#1a73e8] rounded-xl font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Run of Show</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Checklist Verifier & Venue Turnover Sign-off */}
            <ChecklistVerifier
              checklists={checklists}
              currentUserRole={currentUserRole}
              eventStatus={event.status}
              onUpdateChecklists={handleUpdateChecklists}
              onUpdateEventStatus={handleUpdateEventStatus}
            />

            {/* Work Order State Machine Engine */}
            <WorkOrderEngine
              workOrders={workOrders}
              onUpdateWorkOrderStatus={handleUpdateWorkOrderStatus}
              onAddWorkOrder={handleAddWorkOrder}
            />

            {/* Post Event Loop & Feedback */}
            <PostEventLoop
              feedbacks={feedbacks}
              onAddFeedback={handleAddFeedback}
            />
          </div>
        )}

        {/* TAB 2: VENUE FLOOR & ROOM MATRIX */}
        {activeTab === "rooms" && (
          <RoomReadinessMatrix
            rooms={rooms}
            currentUserRole={currentUserRole}
            onUpdateRoom={handleUpdateRoom}
          />
        )}

        {/* TAB 3: CHECK-IN DESK & BADGE ISSUANCE */}
        {activeTab === "checkin" && (
          <CheckInDesk
            attendees={attendees}
            currentUserRole={currentUserRole}
            onCheckInAttendee={handleCheckInAttendee}
            onRegisterNewAttendee={handleRegisterNewAttendee}
            onOpenBadge={(att) => setSelectedBadgeAttendee(att)}
          />
        )}

        {/* TAB 4: ITINERARY & RUN OF SHOW */}
        {activeTab === "itinerary" && (
          <ItineraryTracker
            itinerary={itinerary}
            currentUserRole={currentUserRole}
            delayOffset={delayOffset}
            onUpdateDelayOffset={handleUpdateDelayOffset}
            onUpdateItineraryItem={handleUpdateItineraryItem}
            onOpenExportModal={() => setIsExportModalOpen(true)}
          />
        )}

        {/* TAB 5: INCIDENT DISPATCHER & SOS BROADCAST */}
        {activeTab === "incidents" && (
          <IncidentDispatcher
            incidents={incidents}
            currentUserRole={currentUserRole}
            onAddIncident={handleAddIncident}
            onUpdateIncidentStatus={handleUpdateIncidentStatus}
          />
        )}

        {/* TAB 6: SYSTEM ARCHITECTURE */}
        {activeTab === "architecture" && (
          <ArchitectureViewer />
        )}

        {/* TAB 7: LAUNCH ROADMAP */}
        {activeTab === "roadmap" && (
          <RoadmapViewer />
        )}

      </main>

      {/* Global Attendee Badge Modal */}
      {selectedBadgeAttendee && (
        <BadgeModal
          attendee={selectedBadgeAttendee}
          event={event}
          onClose={() => setSelectedBadgeAttendee(null)}
          onMarkPrinted={handleMarkBadgePrinted}
        />
      )}

      {/* Global Run of Show Export Modal */}
      {isExportModalOpen && (
        <RunOfShowExportModal
          itinerary={itinerary}
          delayOffset={delayOffset}
          event={event}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={setActiveTab}
        onSelectRole={setCurrentUserRole}
        onOpenBadge={(att) => setSelectedBadgeAttendee(att)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenIncidentModal={() => setActiveTab("incidents")}
        attendees={attendees}
      />

      {/* Sleek Minimalist Google Footer */}
      <footer className="bg-white border-t border-[#dadce0] py-5 px-6 text-xs text-[#5f6368] mt-12 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1e8e3e]" />
            <span>Google Cloud Event Operations Hub · Hack2Skill Cross-Org Coordination</span>
          </div>
          <div className="flex items-center gap-4 text-[#70757a]">
            <span>Level 30 Hall of Cloud</span>
            <span>·</span>
            <span>Local Storage Engine Active</span>
            <span>·</span>
            <span>Production SLA: 99.99%</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
