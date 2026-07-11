import React, { useState, useEffect } from "react";
import { 
  INITIAL_EVENT, 
  INITIAL_WORK_ORDERS, 
  INITIAL_CHECKLISTS, 
  INITIAL_ATTENDEES, 
  INITIAL_ITINERARY, 
  INITIAL_FEEDBACK 
} from "./data";
import { 
  EventDetails, 
  WorkOrder, 
  VerificationChecklists, 
  Attendee, 
  ItineraryItem, 
  FeedbackItem, 
  UserRole, 
  EventStatus,
  WorkOrderStatus
} from "./types";
import WorkOrderEngine from "./components/WorkOrderEngine";
import ChecklistVerifier from "./components/ChecklistVerifier";
import CheckInDesk from "./components/CheckInDesk";
import ItineraryTracker from "./components/ItineraryTracker";
import PostEventLoop from "./components/PostEventLoop";
import ArchitectureViewer from "./components/ArchitectureViewer";
import RoadmapViewer from "./components/RoadmapViewer";
import { 
  Network, 
  Database, 
  Compass, 
  ShieldCheck, 
  Sparkles, 
  Activity, 
  User, 
  Clock, 
  Briefcase,
  Layers,
  HelpCircle,
  FileSpreadsheet,
  Zap,
  CheckCircle,
  Play
} from "lucide-react";

export default function App() {
  // Global States
  const [event, setEvent] = useState<EventDetails>(INITIAL_EVENT);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(INITIAL_WORK_ORDERS);
  const [checklists, setChecklists] = useState<VerificationChecklists>(INITIAL_CHECKLISTS);
  const [attendees, setAttendees] = useState<Attendee[]>(INITIAL_ATTENDEES);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>(INITIAL_ITINERARY);
  const [delayOffset, setDelayOffset] = useState<number>(0);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(INITIAL_FEEDBACK);
  
  // Navigation & Simulation Persona
  const [activeTab, setActiveTab] = useState<"operations" | "architecture" | "roadmap">("operations");
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>("Super Admin");

  // UTC Live Clock State
  const [liveTime, setLiveTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveTime(now.toUTCString().replace("GMT", "UTC"));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

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

  const handleRegisterNewAttendee = (name: string, email: string, company: string) => {
    const nextId = `att-${attendees.length + 1}`;
    const code = `H2S-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    setAttendees((prev) => [
      ...prev,
      {
        id: nextId,
        name,
        email,
        company,
        ticketCode: code,
        status: "Registered",
        checkInTime: null,
      },
    ]);
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

  // Check roles permissions overview
  const getRolePermissionsDescription = (role: UserRole) => {
    switch (role) {
      case "Super Admin":
        return "Hack2Skill Lead. Complete authorization across logistics, checklist overview, delay cascade tools, and feedback loops.";
      case "Venue Admin":
        return "Google Office Admins. Responsible for checking power grids, pantry inventories, chairs setup, and signing off the Event DDL.";
      case "Presenter":
        return "Guest Speaker. Restrictive access: Upload presentation PDF deck materials, see live timeline warnings, and request schedule delay cascades.";
      case "Volunteer":
        return "Check-in Staff. Direct access to scanning registrant QR codes, direct registrations, and queue traffic logs.";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800 selection:bg-indigo-500 selection:text-white" id="main-app-shell">
      
      {/* Upper Status strip for multi-role simulation */}
      <div className="bg-slate-900 text-slate-300 py-3 px-6 text-xs flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-950">
        <div className="flex items-center gap-2.5">
          <span className="bg-indigo-500 text-white font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase">SIMULATOR ACTIVE</span>
          <span className="text-slate-400 font-medium">Select active operational role to view tiered access layout:</span>
        </div>

        {/* Interactive role toggles */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(["Super Admin", "Venue Admin", "Presenter", "Volunteer"] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => setCurrentUserRole(r)}
              className={`px-3 py-1 font-bold rounded-lg transition-all text-[11px] cursor-pointer ${
                currentUserRole === r
                  ? "bg-indigo-600 text-white shadow-md scale-102"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-750 hover:text-white"
              }`}
              id={`role-select-${r.toLowerCase().replace(" ", "-")}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Primary header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 shadow-3xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-xs animate-pulse-slow">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-display font-bold text-slate-900 tracking-tight">Event Operations & Coordination Hub</h1>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 uppercase tracking-widest ${
                event.status === "Live" 
                  ? "bg-rose-50 text-rose-600 border-rose-200" 
                  : event.status === "Sign-off"
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                  : "bg-slate-55 text-slate-605 border-slate-200"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${event.status === "Live" ? "bg-rose-500 animate-ping" : "bg-slate-400"}`} />
                Status: {event.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1 font-semibold">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>UTC time: {liveTime || "Syncing..."}</span>
            </p>
          </div>
        </div>

        {/* Tabs selector */}
        <nav className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab("operations")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "operations"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
            id="tab-btn-operations"
          >
            <Layers className="w-4 h-4" />
            Operations Dashboard
          </button>
          <button
            onClick={() => setActiveTab("architecture")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "architecture"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
            id="tab-btn-architecture"
          >
            <Database className="w-4 h-4" />
            System Architecture
          </button>
          <button
            onClick={() => setActiveTab("roadmap")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "roadmap"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
            id="tab-btn-roadmap"
          >
            <Compass className="w-4 h-4" />
            Launch Roadmap
          </button>
        </nav>
      </header>

      {/* Role explanation alert banner */}
      <div className="bg-indigo-50/40 border-b border-indigo-100 py-3.5 px-6 flex items-start gap-3">
        <User className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-indigo-950">Active Simulation Role Identity: {currentUserRole}</p>
          <p className="text-[11px] text-indigo-900 leading-relaxed font-semibold">
            {getRolePermissionsDescription(currentUserRole)} You can toggle between roles above to experience separate operational workflows!
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
        {activeTab === "operations" && (
          <div className="space-y-6">
            
            {/* Row 1: Event Summary Bar */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center md:text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Event Coordination Bind</span>
                <h3 className="text-base font-bold text-slate-800">{event.name}</h3>
                <p className="text-xs text-slate-500 font-bold">Host: {event.venueName} • Organizer: {event.organizer}</p>
              </div>

              <div className="flex gap-4 flex-wrap justify-center text-xs">
                <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-center min-w-[120px] shadow-3xs">
                  <span className="block text-slate-400 font-bold text-[9px] uppercase tracking-wider">Date</span>
                  <span className="font-mono font-bold text-slate-700 mt-0.5 block">{event.date}</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-center min-w-[120px] shadow-3xs">
                  <span className="block text-slate-400 font-bold text-[9px] uppercase tracking-wider">Time window</span>
                  <span className="font-mono font-bold text-slate-700 mt-0.5 block">{event.timeWindow}</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-center min-w-[120px] shadow-3xs">
                  <span className="block text-slate-400 font-bold text-[9px] uppercase tracking-wider">Delay Offset</span>
                  <span className={`font-mono font-bold mt-0.5 block ${delayOffset > 0 ? "text-rose-600" : "text-emerald-700"}`}>
                    +{delayOffset} mins
                  </span>
                </div>
              </div>
            </div>

            {/* Row 2: Checklist Verifier & Signature Pad */}
            <ChecklistVerifier
              checklists={checklists}
              currentUserRole={currentUserRole}
              eventStatus={event.status}
              onUpdateChecklists={handleUpdateChecklists}
              onUpdateEventStatus={handleUpdateEventStatus}
            />

            {/* Row 3: Work Order State Machine */}
            <WorkOrderEngine
              workOrders={workOrders}
              onUpdateWorkOrderStatus={handleUpdateWorkOrderStatus}
              onAddWorkOrder={handleAddWorkOrder}
            />

            {/* Row 4: Check-In desk & Attendee onboarding */}
            <CheckInDesk
              attendees={attendees}
              currentUserRole={currentUserRole}
              onCheckInAttendee={handleCheckInAttendee}
              onRegisterNewAttendee={handleRegisterNewAttendee}
            />

            {/* Row 5: Presenter Timeline Cascade Tracker */}
            <ItineraryTracker
              itinerary={itinerary}
              currentUserRole={currentUserRole}
              delayOffset={delayOffset}
              onUpdateDelayOffset={handleUpdateDelayOffset}
              onUpdateItineraryItem={handleUpdateItineraryItem}
            />

            {/* Row 6: Post-Event Loop */}
            <PostEventLoop
              feedbacks={feedbacks}
              onAddFeedback={handleAddFeedback}
            />

          </div>
        )}

        {activeTab === "architecture" && (
          <ArchitectureViewer />
        )}

        {activeTab === "roadmap" && (
          <RoadmapViewer />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 px-6 text-center text-xs text-gray-400 mt-12">
        <p>© 2026 Event Operations Hub. Designed for Hack2Skill and host Facilities Admins.</p>
        <p className="mt-1">Real-time sync simulation environment powered by React and Tailwind.</p>
      </footer>
    </div>
  );
}
