import React, { useState } from "react";
import { 
  Activity, 
  Search, 
  Clock, 
  User, 
  Radio, 
  HardDrive, 
  RotateCcw, 
  Download, 
  Upload, 
  AlertTriangle, 
  Check, 
  Layers, 
  MapPin, 
  Users, 
  Database, 
  Compass, 
  ChevronDown, 
  ShieldAlert, 
  Sparkles,
  ExternalLink
} from "lucide-react";
import { TabType, UserRole, EventDetails, Incident } from "../types";

interface GoogleHeaderProps {
  event: EventDetails;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  currentUserRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  liveUtcTime: string;
  liveLocalTime: string;
  delayOffset: number;
  incidents: Incident[];
  onOpenCommandPalette: () => void;
  onDownloadBackup: () => void;
  onResetDefaults: () => void;
  onTriggerSOS: () => void;
}

export default function GoogleHeader({
  event,
  activeTab,
  onTabChange,
  currentUserRole,
  onRoleChange,
  liveUtcTime,
  liveLocalTime,
  delayOffset,
  incidents,
  onOpenCommandPalette,
  onDownloadBackup,
  onResetDefaults,
  onTriggerSOS,
}: GoogleHeaderProps) {
  const [isBackupMenuOpen, setIsBackupMenuOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const activeP0 = incidents.find((i) => i.severity === "P0" && i.status !== "Resolved");
  const activeP1 = incidents.find((i) => i.severity === "P1" && i.status !== "Resolved");

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "Super Admin": return "bg-[#1a73e8] text-white";
      case "Venue Admin": return "bg-[#1e8e3e] text-white";
      case "Presenter": return "bg-[#ea8600] text-white";
      case "Volunteer": return "bg-[#9334e6] text-white";
    }
  };

  return (
    <header className="bg-white border-b border-[#dadce0] sticky top-0 z-40 shadow-2xs">
      {/* P0 / P1 Global Emergency Banner Rail */}
      {(activeP0 || activeP1) && (
        <div 
          onClick={() => onTabChange("incidents")}
          className={`py-2 px-6 text-xs flex items-center justify-between cursor-pointer transition-colors ${
            activeP0
              ? "bg-[#d93025] text-white hover:bg-[#c5221f]"
              : "bg-[#fef7e0] text-[#b06000] border-b border-[#feefc3] hover:bg-[#fde293]/30"
          }`}
        >
          <div className="flex items-center gap-2 font-medium">
            <Radio className="w-4 h-4 animate-pulse shrink-0" />
            <span>
              <strong>{activeP0 ? "[P0 CRITICAL SOS]" : "[P1 HIGH ALERT]"}</strong> {activeP0 ? activeP0.title : activeP1?.title} · 
              Location: {activeP0 ? activeP0.location : activeP1?.location}
            </span>
          </div>
          <span className="text-[11px] underline underline-offset-2 flex items-center gap-1 font-semibold">
            Inspect Incident Center →
          </span>
        </div>
      )}

      {/* Top Main Navigation Bar */}
      <div className="px-6 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 border-b border-[#f1f3f4]">
        {/* Left: Google Cloud Console Logo & Breadcrumb */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            {/* Google-like logo block */}
            <div className="w-8 h-8 rounded-lg bg-[#1a73e8] flex items-center justify-center text-white shadow-xs">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-[#202124] tracking-tight">Event Operations Hub</span>
                <span className="text-xs text-[#5f6368] font-normal">/</span>
                <span className="text-xs font-medium text-[#1a73e8] hover:underline cursor-pointer">
                  {event.name}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#5f6368]">
                <span>{event.venueName.split("-")[0]}</span>
                <span>·</span>
                <span className="flex items-center gap-1 text-[#1e8e3e] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1e8e3e] animate-pulse" />
                  Status: {event.status}
                </span>
                {delayOffset > 0 && (
                  <>
                    <span>·</span>
                    <span className="font-mono text-[#d93025] font-semibold">
                      +{delayOffset}m Offset
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Center: Command Bar / Search Box (Google Cloud Console Search) */}
        <div className="w-full md:max-w-md">
          <button
            onClick={onOpenCommandPalette}
            className="w-full px-3.5 py-1.5 bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#5f6368] rounded-xl text-xs flex items-center justify-between transition-colors border border-transparent hover:border-[#dadce0] cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-[#5f6368]" />
              <span>Search resources, rooms, attendees (Ctrl+K)...</span>
            </span>
            <kbd className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-[#dadce0] text-[#70757a]">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Operational Clocks, Backup Menu, and Role Switcher */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end text-xs">
          {/* Synchronized Clocks */}
          <div className="hidden lg:flex items-center gap-2 text-[#5f6368] font-mono text-[11px] bg-[#f8f9fa] px-2.5 py-1 rounded-lg border border-[#e8eaed]">
            <Clock className="w-3.5 h-3.5 text-[#70757a]" />
            <span title="Singapore Event Time">SGT: {liveLocalTime}</span>
            <span className="text-[#dadce0]">|</span>
            <span title="Coordinated Universal Time">UTC: {liveUtcTime}</span>
          </div>

          {/* LocalStorage Status & Backup Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsBackupMenuOpen(!isBackupMenuOpen)}
              className="px-2.5 py-1.5 rounded-lg border border-[#dadce0] hover:bg-[#f1f3f4] text-[#3c4043] flex items-center gap-1.5 text-xs transition-colors cursor-pointer"
              title="Persistent LocalStorage Management"
            >
              <HardDrive className="w-3.5 h-3.5 text-[#1e8e3e]" />
              <span className="hidden sm:inline font-medium">Auto-Saved</span>
              <ChevronDown className="w-3 h-3 text-[#70757a]" />
            </button>

            {isBackupMenuOpen && (
              <div 
                className="absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-[#dadce0] py-1 z-50 animate-in fade-in duration-100"
                onClick={() => setIsBackupMenuOpen(false)}
              >
                <div className="px-3 py-2 border-b border-[#f1f3f4] text-[11px] text-[#5f6368]">
                  <p className="font-semibold text-[#202124]">LocalStorage Persistence</p>
                  <p>All changes persist across reloads</p>
                </div>
                <button
                  onClick={onDownloadBackup}
                  className="w-full px-3 py-2 text-left hover:bg-[#f1f3f4] text-xs text-[#202124] flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#1a73e8]" />
                  <span>Export JSON Snapshot</span>
                </button>
                <button
                  onClick={onResetDefaults}
                  className="w-full px-3 py-2 text-left hover:bg-[#fce8e6] text-xs text-[#d93025] flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#d93025]" />
                  <span>Reset to Demo Defaults</span>
                </button>
              </div>
            )}
          </div>

          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className="px-2.5 py-1 rounded-lg border border-[#dadce0] hover:bg-[#f1f3f4] flex items-center gap-2 cursor-pointer transition-colors"
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${getRoleColor(currentUserRole)}`}>
                {currentUserRole[0]}
              </div>
              <div className="text-left hidden sm:block">
                <span className="block text-[11px] font-semibold text-[#202124] leading-tight">{currentUserRole}</span>
                <span className="block text-[9px] text-[#70757a] uppercase tracking-wider">Simulated Role</span>
              </div>
              <ChevronDown className="w-3 h-3 text-[#70757a]" />
            </button>

            {isRoleMenuOpen && (
              <div 
                className="absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-[#dadce0] py-1 z-50 animate-in fade-in duration-100"
                onClick={() => setIsRoleMenuOpen(false)}
              >
                <div className="px-3 py-1.5 border-b border-[#f1f3f4] text-[11px] font-semibold text-[#5f6368]">
                  Switch Role Persona
                </div>
                {(["Super Admin", "Venue Admin", "Presenter", "Volunteer"] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => onRoleChange(r)}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between cursor-pointer ${
                      currentUserRole === r ? "bg-[#e8f0fe] text-[#1a73e8] font-semibold" : "hover:bg-[#f1f3f4] text-[#202124]"
                    }`}
                  >
                    <span>{r}</span>
                    {currentUserRole === r && <Check className="w-3.5 h-3.5 text-[#1a73e8]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Primary Workspace Navigation Tabs (Google Cloud Console Style) */}
      <div className="px-6 flex items-center gap-1 overflow-x-auto text-xs scrollbar-none bg-[#f8f9fa]">
        <button
          onClick={() => onTabChange("operations")}
          className={`py-3 px-3.5 border-b-2 font-medium flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === "operations"
              ? "border-[#1a73e8] text-[#1a73e8] font-semibold"
              : "border-transparent text-[#5f6368] hover:text-[#202124]"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Operations Dashboard</span>
        </button>

        <button
          onClick={() => onTabChange("rooms")}
          className={`py-3 px-3.5 border-b-2 font-medium flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === "rooms"
              ? "border-[#1a73e8] text-[#1a73e8] font-semibold"
              : "border-transparent text-[#5f6368] hover:text-[#202124]"
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Venue Floor & Room Matrix</span>
        </button>

        <button
          onClick={() => onTabChange("checkin")}
          className={`py-3 px-3.5 border-b-2 font-medium flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === "checkin"
              ? "border-[#1a73e8] text-[#1a73e8] font-semibold"
              : "border-transparent text-[#5f6368] hover:text-[#202124]"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Check-In Desk & Badges</span>
        </button>

        <button
          onClick={() => onTabChange("itinerary")}
          className={`py-3 px-3.5 border-b-2 font-medium flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === "itinerary"
              ? "border-[#1a73e8] text-[#1a73e8] font-semibold"
              : "border-transparent text-[#5f6368] hover:text-[#202124]"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Itinerary & Run of Show</span>
        </button>

        <button
          onClick={() => onTabChange("incidents")}
          className={`py-3 px-3.5 border-b-2 font-medium flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors relative ${
            activeTab === "incidents"
              ? "border-[#d93025] text-[#d93025] font-semibold"
              : "border-transparent text-[#5f6368] hover:text-[#202124]"
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-[#d93025]" />
          <span>Incident Dispatcher</span>
          {(activeP0 || activeP1) && (
            <span className="w-2 h-2 rounded-full bg-[#d93025] animate-ping" />
          )}
        </button>

        <button
          onClick={() => onTabChange("architecture")}
          className={`py-3 px-3.5 border-b-2 font-medium flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === "architecture"
              ? "border-[#1a73e8] text-[#1a73e8] font-semibold"
              : "border-transparent text-[#5f6368] hover:text-[#202124]"
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>System Architecture</span>
        </button>

        <button
          onClick={() => onTabChange("roadmap")}
          className={`py-3 px-3.5 border-b-2 font-medium flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === "roadmap"
              ? "border-[#1a73e8] text-[#1a73e8] font-semibold"
              : "border-transparent text-[#5f6368] hover:text-[#202124]"
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Launch Roadmap</span>
        </button>
      </div>
    </header>
  );
}
