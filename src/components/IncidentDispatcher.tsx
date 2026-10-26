import React, { useState } from "react";
import { Incident, IncidentSeverity, IncidentStatus, UserRole } from "../types";
import { 
  AlertTriangle, 
  Flame, 
  Bell, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Radio, 
  Volume2, 
  VolumeX, 
  Search, 
  ShieldAlert, 
  MapPin, 
  User, 
  Check, 
  X
} from "lucide-react";

interface IncidentDispatcherProps {
  incidents: Incident[];
  currentUserRole: UserRole;
  onAddIncident: (incident: Omit<Incident, "id" | "reportedAt">) => void;
  onUpdateIncidentStatus: (id: string, status: IncidentStatus, resolutionNotes?: string) => void;
}

export default function IncidentDispatcher({
  incidents,
  currentUserRole,
  onAddIncident,
  onUpdateIncidentStatus,
}: IncidentDispatcherProps) {
  const [filterSeverity, setFilterSeverity] = useState<"All" | IncidentSeverity>("All");
  const [filterStatus, setFilterStatus] = useState<"All" | IncidentStatus>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // New incident form state
  const [title, setTitle] = useState("");
  const [severity, setSeverity] = useState<IncidentSeverity>("P1");
  const [location, setLocation] = useState("Auditorium Alpha (Stage Hall)");
  const [affectedSession, setAffectedSession] = useState("");

  // Resolving modal state
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState("");

  // Play audio chime via Web Audio API
  const playAlertSound = (sev: IncidentSeverity) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = sev === "P0" ? "sawtooth" : "sine";
      osc.frequency.setValueAtTime(sev === "P0" ? 880 : 587.33, audioCtx.currentTime); // A5 or D5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch {
      // AudioContext policy fallback
    }
  };

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddIncident({
      title,
      severity,
      location,
      status: "Open",
      reportedBy: `${currentUserRole}`,
      affectedSession: affectedSession.trim() ? affectedSession : undefined,
    });

    playAlertSound(severity);
    setTitle("");
    setAffectedSession("");
    setIsModalOpen(false);
  };

  const applyQuickTemplate = (presetTitle: string, presetSev: IncidentSeverity, presetLoc: string) => {
    setTitle(presetTitle);
    setSeverity(presetSev);
    setLocation(presetLoc);
  };

  const handleConfirmResolve = () => {
    if (!resolvingId) return;
    onUpdateIncidentStatus(resolvingId, "Resolved", resolutionText || "Resolved by operations staff");
    setResolvingId(null);
    setResolutionText("");
  };

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSev = filterSeverity === "All" || inc.severity === filterSeverity;
    const matchesStatus = filterStatus === "All" || inc.status === filterStatus;
    const matchesSearch = inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inc.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inc.reportedBy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSev && matchesStatus && matchesSearch;
  });

  const activeP0Count = incidents.filter((i) => i.severity === "P0" && i.status !== "Resolved").length;
  const activeP1Count = incidents.filter((i) => i.severity === "P1" && i.status !== "Resolved").length;

  return (
    <div className="space-y-4">
      {/* Google Cloud Header Card */}
      <div className="bg-white rounded-2xl border border-[#dadce0] p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl text-white ${activeP0Count > 0 ? "bg-[#d93025] animate-pulse" : "bg-[#1a73e8]"}`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-[#202124]">Incident Dispatch & SOS Triage</h2>
                <div className="flex items-center gap-1.5 text-xs">
                  {activeP0Count > 0 && (
                    <span className="font-mono font-bold text-[#d93025] bg-[#fce8e6] px-2 py-0.5 rounded-full border border-[#fad2cf]">
                      {activeP0Count} P0 Critical
                    </span>
                  )}
                  {activeP1Count > 0 && (
                    <span className="font-mono font-bold text-[#b06000] bg-[#fef7e0] px-2 py-0.5 rounded-full border border-[#feefc3]">
                      {activeP1Count} P1 High
                    </span>
                  )}
                  {activeP0Count === 0 && activeP1Count === 0 && (
                    <span className="font-mono font-medium text-[#137333] bg-[#e6f4ea] px-2 py-0.5 rounded-full">
                      All Systems Nominal
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs text-[#5f6368] mt-0.5">
                Centralized radio escalation hub for AV dropouts, safety alerts, and facilities dispatch
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg border border-[#dadce0] bg-white text-[#5f6368] hover:bg-[#f1f3f4] transition-colors cursor-pointer text-xs flex items-center gap-1.5"
              title={soundEnabled ? "Mute alert chimes" : "Enable alert chimes"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#1a73e8]" /> : <VolumeX className="w-4 h-4 text-[#70757a]" />}
              <span className="hidden sm:inline">{soundEnabled ? "Alerts On" : "Muted"}</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-[#d93025] hover:bg-[#c5221f] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Radio className="w-4 h-4" />
              <span>Broadcast SOS Incident</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-5 pt-4 border-t border-[#f1f3f4] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1 bg-[#f1f3f4] p-1 rounded-xl">
            {(["All", "P0", "P1", "P2"] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1 font-medium rounded-lg transition-colors cursor-pointer ${
                  filterSeverity === sev
                    ? "bg-white text-[#202124] shadow-xs"
                    : "text-[#5f6368] hover:text-[#202124]"
                }`}
              >
                {sev === "All" ? "All Severity" : sev}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#f1f3f4] p-1 rounded-xl">
              {(["All", "Open", "Investigating", "Resolved"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1 font-medium rounded-lg transition-colors cursor-pointer ${
                    filterStatus === st
                      ? "bg-white text-[#202124] shadow-xs"
                      : "text-[#5f6368] hover:text-[#202124]"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#70757a]" />
              <input
                type="text"
                placeholder="Filter incidents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#dadce0] rounded-lg text-xs text-[#202124] placeholder-[#70757a] focus:outline-none focus:border-[#1a73e8]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Incidents List */}
      <div className="space-y-2.5">
        {filteredIncidents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#dadce0] p-12 text-center text-xs text-[#5f6368] space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#1e8e3e] mx-auto opacity-70" />
            <p className="font-semibold text-sm text-[#202124]">No matching incidents reported</p>
            <p>All venue AV channels, facilities, and crowd flows are operating nominally.</p>
          </div>
        ) : (
          filteredIncidents.map((incident) => {
            const isP0 = incident.severity === "P0";
            const isP1 = incident.severity === "P1";
            const isResolved = incident.status === "Resolved";

            return (
              <div
                key={incident.id}
                className={`bg-white rounded-xl border p-4.5 transition-all shadow-2xs ${
                  isResolved
                    ? "border-[#e8eaed] opacity-80"
                    : isP0
                    ? "border-[#d93025] bg-[#fce8e6]/10"
                    : isP1
                    ? "border-[#f9ab00] bg-[#fef7e0]/10"
                    : "border-[#dadce0]"
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                        isP0
                          ? "bg-[#d93025] text-white border-[#d93025]"
                          : isP1
                          ? "bg-[#b06000] text-white border-[#b06000]"
                          : "bg-[#5f6368] text-white border-[#5f6368]"
                      }`}>
                        {incident.severity}
                      </span>
                      <h3 className="text-sm font-semibold text-[#202124]">{incident.title}</h3>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                        incident.status === "Open"
                          ? "bg-[#fce8e6] text-[#c5221f]"
                          : incident.status === "Investigating"
                          ? "bg-[#fef7e0] text-[#b06000]"
                          : "bg-[#e6f4ea] text-[#137333]"
                      }`}>
                        {incident.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#5f6368] flex-wrap pt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#70757a]" />
                        {incident.location}
                      </span>
                      <span className="text-[#dadce0]">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#70757a]" />
                        {incident.reportedAt}
                      </span>
                      <span className="text-[#dadce0]">·</span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-[#70757a]" />
                        Reported by: {incident.reportedBy}
                      </span>
                      {incident.affectedSession && (
                        <>
                          <span className="text-[#dadce0]">·</span>
                          <span className="text-[#1a73e8] font-medium">Session: {incident.affectedSession}</span>
                        </>
                      )}
                    </div>

                    {incident.resolutionNotes && (
                      <div className="mt-2 text-xs text-[#137333] bg-[#e6f4ea] border border-[#ceead6] px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 shrink-0" />
                        <span><strong>Resolution:</strong> {incident.resolutionNotes}</span>
                      </div>
                    )}
                  </div>

                  {/* Incident Action Buttons */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {incident.status === "Open" && (
                      <button
                        onClick={() => onUpdateIncidentStatus(incident.id, "Investigating")}
                        className="px-3 py-1.5 text-xs font-medium text-[#1a73e8] bg-[#e8f0fe] hover:bg-[#d2e3fc] rounded-lg transition-colors cursor-pointer"
                      >
                        Acknowledge & Investigate
                      </button>
                    )}
                    {incident.status !== "Resolved" && (
                      <button
                        onClick={() => {
                          setResolvingId(incident.id);
                          setResolutionText("");
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-[#1e8e3e] hover:bg-[#188038] rounded-lg shadow-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Resolve</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Broadcast SOS Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            className="bg-white rounded-2xl shadow-2xl border border-[#dadce0] max-w-lg w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-[#dadce0] flex items-center justify-between bg-[#fce8e6]/30">
              <div className="flex items-center gap-2 text-[#d93025]">
                <Radio className="w-5 h-5 text-[#d93025] animate-pulse" />
                <h3 className="text-base font-semibold text-[#202124]">Broadcast SOS Incident</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-[#5f6368] hover:text-[#202124] hover:bg-[#e8eaed] rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateIncident} className="p-6 space-y-4 text-xs">
              {/* Quick Template Buttons */}
              <div>
                <label className="block text-[11px] font-semibold text-[#5f6368] uppercase tracking-wider mb-1.5">
                  Quick Incident Presets
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => applyQuickTemplate("Stage wireless mic battery died on Main Stage", "P0", "Auditorium Alpha (Stage Hall)")}
                    className="px-2.5 py-1 bg-[#f1f3f4] hover:bg-[#e8eaed] rounded-md text-[#3c4043] transition-colors cursor-pointer"
                  >
                    Stage Mic Dead
                  </button>
                  <button
                    type="button"
                    onClick={() => applyQuickTemplate("Projector HDMI handshake dropped", "P1", "Auditorium Alpha (Stage Hall)")}
                    className="px-2.5 py-1 bg-[#f1f3f4] hover:bg-[#e8eaed] rounded-md text-[#3c4043] transition-colors cursor-pointer"
                  >
                    Projector Video Loss
                  </button>
                  <button
                    type="button"
                    onClick={() => applyQuickTemplate("Level 30 Atrium pantry cups and cold brew empty", "P2", "Catering & Atrium Lounge")}
                    className="px-2.5 py-1 bg-[#f1f3f4] hover:bg-[#e8eaed] rounded-md text-[#3c4043] transition-colors cursor-pointer"
                  >
                    Pantry Refill
                  </button>
                  <button
                    type="button"
                    onClick={() => applyQuickTemplate("Room AC temperature reading exceeding 25°C", "P1", "Workshop Hall Beta")}
                    className="px-2.5 py-1 bg-[#f1f3f4] hover:bg-[#e8eaed] rounded-md text-[#3c4043] transition-colors cursor-pointer"
                  >
                    AC Overheating
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#202124] mb-1">Incident Summary</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stage confidence monitor loss on HDMI 2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#dadce0] rounded-lg text-xs text-[#202124] focus:outline-none focus:border-[#1a73e8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#202124] mb-1">Severity Tier</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
                    className="w-full px-3 py-2 border border-[#dadce0] rounded-lg text-xs text-[#202124] focus:outline-none focus:border-[#1a73e8] bg-white"
                  >
                    <option value="P0">P0 - Critical (Stage Blocking / Emergency)</option>
                    <option value="P1">P1 - High (Degraded AV / Wi-Fi Impact)</option>
                    <option value="P2">P2 - Normal (Supplies / Temperature)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[#202124] mb-1">Location / Zone</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-[#dadce0] rounded-lg text-xs text-[#202124] focus:outline-none focus:border-[#1a73e8] bg-white"
                  >
                    <option value="Auditorium Alpha (Stage Hall)">Auditorium Alpha</option>
                    <option value="Workshop Hall Beta">Workshop Hall Beta</option>
                    <option value="Catering & Atrium Lounge">Catering & Atrium Lounge</option>
                    <option value="Speaker Greenroom">Speaker Greenroom</option>
                    <option value="Registration Foyer">Registration Foyer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#202124] mb-1">Affected Session (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Keynote Kickoff or Technical Session"
                  value={affectedSession}
                  onChange={(e) => setAffectedSession(e.target.value)}
                  className="w-full px-3 py-2 border border-[#dadce0] rounded-lg text-xs text-[#202124] focus:outline-none focus:border-[#1a73e8]"
                />
              </div>

              <div className="pt-3 border-t border-[#dadce0] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#dadce0] rounded-lg text-[#3c4043] hover:bg-[#f1f3f4] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#d93025] hover:bg-[#c5221f] text-white font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Radio className="w-4 h-4" />
                  Dispatch Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resolve Incident Dialog */}
      {resolvingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            className="bg-white rounded-2xl shadow-2xl border border-[#dadce0] max-w-md w-full p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 text-[#1e8e3e]">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className="text-base font-semibold text-[#202124]">Confirm Incident Resolution</h3>
            </div>
            <p className="text-xs text-[#5f6368]">
              Document the corrective measure taken by the venue facilities or AV crew:
            </p>
            <textarea
              rows={3}
              value={resolutionText}
              onChange={(e) => setResolutionText(e.target.value)}
              placeholder="e.g. Swapped wireless mic battery pack with backup unit from stage rack."
              className="w-full px-3 py-2 border border-[#dadce0] rounded-lg text-xs text-[#202124] focus:outline-none focus:border-[#1a73e8]"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setResolvingId(null)}
                className="px-4 py-2 border border-[#dadce0] rounded-lg text-xs font-medium text-[#3c4043] hover:bg-[#f1f3f4] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmResolve}
                className="px-4 py-2 bg-[#1e8e3e] hover:bg-[#188038] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Mark Resolved
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
