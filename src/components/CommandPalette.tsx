import React, { useState, useEffect } from "react";
import { 
  Search, 
  X, 
  Layers, 
  MapPin, 
  Users, 
  Clock, 
  Radio, 
  Database, 
  Compass, 
  Printer, 
  FileSpreadsheet, 
  UserCheck, 
  Shield 
} from "lucide-react";
import { TabType, UserRole, Attendee } from "../types";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: TabType) => void;
  onSelectRole: (role: UserRole) => void;
  onOpenBadge: (attendee: Attendee) => void;
  onOpenExport: () => void;
  onOpenIncidentModal: () => void;
  attendees: Attendee[];
}

export default function CommandPalette({
  isOpen,
  onClose,
  onSelectTab,
  onSelectRole,
  onOpenBadge,
  onOpenExport,
  onOpenIncidentModal,
  attendees,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredAttendees = query.trim()
    ? attendees.filter((a) =>
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.ticketCode.toLowerCase().includes(query.toLowerCase()) ||
        a.company.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-100"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-[#dadce0] max-w-xl w-full overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-[#dadce0] flex items-center gap-2.5 bg-[#f8f9fa]">
          <Search className="w-5 h-5 text-[#5f6368] shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search commands, rooms, attendees, or roles... (e.g. 'checkin', 'David', 'P0')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-[#202124] placeholder-[#70757a] focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-[#5f6368] bg-[#e8eaed] rounded border border-[#dadce0]">
            ESC
          </kbd>
        </div>

        {/* Command List */}
        <div className="p-2 overflow-y-auto max-h-[60vh] space-y-1 text-xs">
          {/* Attendee Results if query */}
          {filteredAttendees.length > 0 && (
            <div className="pb-2 mb-2 border-b border-[#e8eaed]">
              <span className="px-3 py-1 block text-[10px] font-semibold text-[#70757a] uppercase tracking-wider">
                Matching Attendees ({filteredAttendees.length})
              </span>
              {filteredAttendees.map((att) => (
                <button
                  key={att.id}
                  onClick={() => {
                    onOpenBadge(att);
                    onClose();
                  }}
                  className="w-full px-3 py-2 rounded-lg flex items-center justify-between text-left hover:bg-[#f1f3f4] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#1a73e8]" />
                    <span className="font-semibold text-[#202124]">{att.name}</span>
                    <span className="text-[#5f6368]">· {att.company}</span>
                    <span className="font-mono text-[10px] bg-[#e8eaed] px-1.5 py-0.5 rounded text-[#3c4043]">
                      {att.ticketCode}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#1a73e8] flex items-center gap-1 font-medium">
                    <Printer className="w-3.5 h-3.5" />
                    Badge Pass
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Core Navigation Views */}
          <span className="px-3 py-1 block text-[10px] font-semibold text-[#70757a] uppercase tracking-wider">
            Navigation Workspaces
          </span>

          <button
            onClick={() => { onSelectTab("operations"); onClose(); }}
            className="w-full px-3 py-2 rounded-lg flex items-center gap-2.5 text-left hover:bg-[#f1f3f4] text-[#202124] cursor-pointer"
          >
            <Layers className="w-4 h-4 text-[#1a73e8]" />
            <div className="flex-1">
              <span className="font-medium">Operations Dashboard</span>
              <p className="text-[11px] text-[#5f6368]">Checklists, sign-off status, and live work orders</p>
            </div>
          </button>

          <button
            onClick={() => { onSelectTab("rooms"); onClose(); }}
            className="w-full px-3 py-2 rounded-lg flex items-center gap-2.5 text-left hover:bg-[#f1f3f4] text-[#202124] cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-[#1e8e3e]" />
            <div className="flex-1">
              <span className="font-medium">Venue Floor & Room Readiness Matrix</span>
              <p className="text-[11px] text-[#5f6368]">Auditorium Alpha, West Wing Beta, Atrium, Greenroom AV telemetry</p>
            </div>
          </button>

          <button
            onClick={() => { onSelectTab("checkin"); onClose(); }}
            className="w-full px-3 py-2 rounded-lg flex items-center gap-2.5 text-left hover:bg-[#f1f3f4] text-[#202124] cursor-pointer"
          >
            <Users className="w-4 h-4 text-[#ea8600]" />
            <div className="flex-1">
              <span className="font-medium">Check-In Desk & Badge Printer</span>
              <p className="text-[11px] text-[#5f6368]">Attendee verification, QR generation, thermal badges</p>
            </div>
          </button>

          <button
            onClick={() => { onSelectTab("itinerary"); onClose(); }}
            className="w-full px-3 py-2 rounded-lg flex items-center gap-2.5 text-left hover:bg-[#f1f3f4] text-[#202124] cursor-pointer"
          >
            <Clock className="w-4 h-4 text-[#1a73e8]" />
            <div className="flex-1">
              <span className="font-medium">Itinerary & Run of Show Cascade</span>
              <p className="text-[11px] text-[#5f6368]">Stage countdown, delay offset propagation, speaker decks</p>
            </div>
          </button>

          <button
            onClick={() => { onSelectTab("incidents"); onClose(); }}
            className="w-full px-3 py-2 rounded-lg flex items-center gap-2.5 text-left hover:bg-[#f1f3f4] text-[#202124] cursor-pointer"
          >
            <Radio className="w-4 h-4 text-[#d93025]" />
            <div className="flex-1">
              <span className="font-medium">Incident Dispatcher & SOS Broadcast</span>
              <p className="text-[11px] text-[#5f6368]">P0/P1 alerts, stage mic drops, and facilities dispatch</p>
            </div>
          </button>

          {/* Quick Actions */}
          <span className="px-3 pt-3 pb-1 block text-[10px] font-semibold text-[#70757a] uppercase tracking-wider">
            Quick Actions
          </span>

          <button
            onClick={() => { onOpenExport(); onClose(); }}
            className="w-full px-3 py-2 rounded-lg flex items-center gap-2.5 text-left hover:bg-[#f1f3f4] text-[#202124] cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#1e8e3e]" />
            <div className="flex-1">
              <span className="font-medium">Export Run of Show for Google Sheets</span>
              <p className="text-[11px] text-[#5f6368]">Copy TSV or download CSV spreadsheet manifest</p>
            </div>
          </button>

          <button
            onClick={() => { onOpenIncidentModal(); onClose(); }}
            className="w-full px-3 py-2 rounded-lg flex items-center gap-2.5 text-left hover:bg-[#f1f3f4] text-[#202124] cursor-pointer"
          >
            <Radio className="w-4 h-4 text-[#d93025]" />
            <div className="flex-1">
              <span className="font-medium text-[#d93025]">Broadcast SOS Incident</span>
              <p className="text-[11px] text-[#5f6368]">Trigger high-priority audio & visual radio alert</p>
            </div>
          </button>

          {/* Role Switcher */}
          <span className="px-3 pt-3 pb-1 block text-[10px] font-semibold text-[#70757a] uppercase tracking-wider">
            Simulate Role Identity
          </span>

          <div className="grid grid-cols-2 gap-1 p-1">
            {(["Super Admin", "Venue Admin", "Presenter", "Volunteer"] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => { onSelectRole(r); onClose(); }}
                className="px-2.5 py-1.5 rounded-lg border border-[#dadce0] hover:bg-[#f1f3f4] text-left text-xs font-medium text-[#3c4043] flex items-center gap-1.5 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-[#1a73e8]" />
                <span>{r}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-[#dadce0] bg-[#f8f9fa] flex items-center justify-between text-[11px] text-[#5f6368]">
          <span>Tip: Press <kbd className="font-mono bg-[#e8eaed] px-1 rounded border border-[#dadce0]">Ctrl+K</kbd> anywhere</span>
          <button onClick={onClose} className="hover:text-[#202124]">Close</button>
        </div>
      </div>
    </div>
  );
}
