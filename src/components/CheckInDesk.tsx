import React, { useState } from "react";
import { Attendee, UserRole, AttendeeRole } from "../types";
import { 
  Users, 
  QrCode, 
  AlertOctagon, 
  UserCheck, 
  TrendingUp, 
  Plus, 
  Timer, 
  Zap, 
  Search, 
  Printer, 
  ShieldCheck, 
  Check, 
  X,
  Building2,
  Clock
} from "lucide-react";

interface CheckInDeskProps {
  attendees: Attendee[];
  currentUserRole: UserRole;
  onCheckInAttendee: (id: string) => void;
  onRegisterNewAttendee: (name: string, email: string, company: string, role?: AttendeeRole) => void;
  onOpenBadge: (attendee: Attendee) => void;
}

export default function CheckInDesk({
  attendees,
  currentUserRole,
  onCheckInAttendee,
  onRegisterNewAttendee,
  onOpenBadge,
}: CheckInDeskProps) {
  // Queue state
  const [activeQueueLength, setActiveQueueLength] = useState(3);
  const [isAlertAcknowledged, setIsAlertAcknowledged] = useState(false);
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(attendees[0] || null);

  // Search and filter
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");

  // Registration modal form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState<AttendeeRole>("Attendee");

  // Wait time calculations
  const waitTimePerPersonMinutes = 1.8;
  const currentWaitTime = Math.round(activeQueueLength * waitTimePerPersonMinutes);
  const isWaitTimeCritical = currentWaitTime > 5;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !company.trim()) return;
    onRegisterNewAttendee(name, email, company, role);
    setName("");
    setEmail("");
    setCompany("");
    setRole("Attendee");
    setShowAddForm(false);
    setActiveQueueLength((prev) => prev + 1);
  };

  const handleBurstQueue = () => {
    setActiveQueueLength((prev) => prev + 6);
    setIsAlertAcknowledged(false);
  };

  const handleDispatchBusters = () => {
    setActiveQueueLength(1);
    setIsAlertAcknowledged(false);
  };

  const handleScanCheckIn = (attendee: Attendee) => {
    if (attendee.status === "Checked-in") return;
    onCheckInAttendee(attendee.id);
    if (activeQueueLength > 0) {
      setActiveQueueLength((prev) => prev - 1);
    }
  };

  const checkedInCount = attendees.filter((a) => a.status === "Checked-in").length;
  const totalRSVPs = attendees.length;
  const percentCheckedIn = totalRSVPs > 0 ? Math.round((checkedInCount / totalRSVPs) * 100) : 0;

  const filteredAttendees = attendees.filter((a) => {
    const matchesRole = roleFilter === "All" || a.role === roleFilter;
    const matchesSearch = 
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.ticketCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const getRoleStyle = (r: AttendeeRole) => {
    switch (r) {
      case "Speaker": return "text-[#1a73e8] bg-[#e8f0fe] border-[#aecbfa]";
      case "VIP": return "text-[#b06000] bg-[#fef7e0] border-[#fdd663]";
      case "Staff": return "text-[#0d652d] bg-[#ceead6] border-[#81c995]";
      default: return "text-[#5f6368] bg-[#f1f3f4] border-[#dadce0]";
    }
  };

  return (
    <div className="space-y-4">
      {/* SLA Queue Alert Banner */}
      {isWaitTimeCritical && !isAlertAcknowledged && (
        <div className="bg-[#d93025] text-white p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <AlertOctagon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">
                Registration Queue Congestion Alert — {currentWaitTime} Min Est. Wait
              </p>
              <p className="text-xs text-white/90 mt-0.5">
                Front desk wait time exceeds 5-minute SLA. Volunteer roaming busters needed.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDispatchBusters}
              className="bg-white text-[#d93025] hover:bg-slate-100 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              Dispatch Queue Busters
            </button>
            <button
              onClick={() => setIsAlertAcknowledged(true)}
              className="bg-[#b31412] text-white hover:bg-[#8e0000] text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}

      {/* Main Container Card */}
      <div className="bg-white rounded-2xl border border-[#dadce0] p-6 shadow-2xs space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#dadce0]">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#1a73e8] text-white flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <h2 className="text-base font-semibold text-[#202124]">
                Check-In Desk & Badge Issuance
              </h2>
            </div>
            <p className="text-xs text-[#5f6368] mt-1">
              Rapid attendee verification, QR credentials, wait-time telemetry, and printable conference passes
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowAddForm(true)}
              className="px-3.5 py-1.5 rounded-lg border border-[#dadce0] bg-white text-[#202124] hover:bg-[#f1f3f4] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 text-[#1a73e8]" />
              <span>Walk-in Registration</span>
            </button>
            <button
              onClick={handleBurstQueue}
              className="px-3.5 py-1.5 rounded-lg border border-[#fce8e6] bg-[#fef7e0]/50 text-[#b06000] hover:bg-[#fef7e0] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Simulate sudden arrival of 6 attendees"
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#ea8600]" />
              <span>Simulate Peak Rush (+6)</span>
            </button>
          </div>
        </div>

        {/* 3 Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-xl border border-[#e8eaed] bg-[#f8f9fa]">
            <span className="text-[11px] text-[#5f6368] font-medium block">Check-in Completion</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-mono text-[#202124]">{percentCheckedIn}%</span>
              <span className="text-xs text-[#5f6368] font-mono">({checkedInCount}/{totalRSVPs})</span>
            </div>
            <div className="w-full bg-[#e8eaed] h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div 
                className="bg-[#1e8e3e] h-full rounded-full transition-all duration-300"
                style={{ width: `${percentCheckedIn}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl border border-[#e8eaed] bg-[#f8f9fa]">
            <span className="text-[11px] text-[#5f6368] font-medium block">Front Desk Queue</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-mono text-[#202124]">{activeQueueLength}</span>
              <span className="text-xs text-[#5f6368]">people waiting</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#1e8e3e] font-medium mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1e8e3e]" />
              <span>2 Check-in Kiosks Active</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-[#e8eaed] bg-[#f8f9fa]">
            <span className="text-[11px] text-[#5f6368] font-medium block">Estimated Wait Time</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-2xl font-bold font-mono ${isWaitTimeCritical ? "text-[#d93025]" : "text-[#137333]"}`}>
                {currentWaitTime} mins
              </span>
              <span className="text-[11px] text-[#70757a]">avg 1.8m/attendee</span>
            </div>
            <p className="text-[11px] text-[#70757a] mt-2 font-mono">SLA Target: &lt; 5.0 mins</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs pt-1">
          <div className="flex items-center gap-1 bg-[#f1f3f4] p-1 rounded-xl overflow-x-auto">
            {(["All", "Attendee", "VIP", "Speaker", "Staff"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1 font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  roleFilter === r
                    ? "bg-white text-[#202124] shadow-xs"
                    : "text-[#5f6368] hover:text-[#202124]"
                }`}
              >
                {r === "All" ? "All Credentials" : r}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#70757a]" />
            <input
              type="text"
              placeholder="Search by name, company, or ticket code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#dadce0] rounded-lg text-xs text-[#202124] placeholder-[#70757a] focus:outline-none focus:border-[#1a73e8]"
            />
          </div>
        </div>

        {/* Attendee Table */}
        <div className="border border-[#e8eaed] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#f8f9fa] border-b border-[#e8eaed] text-[#5f6368] uppercase tracking-wider text-[10px] font-semibold">
                  <th className="py-2.5 px-4">Attendee Name</th>
                  <th className="py-2.5 px-4">Company / Org</th>
                  <th className="py-2.5 px-4 font-mono">Ticket Code</th>
                  <th className="py-2.5 px-4">Role</th>
                  <th className="py-2.5 px-4">Status & Time</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8eaed]">
                {filteredAttendees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#5f6368]">
                      No attendees found matching filter.
                    </td>
                  </tr>
                ) : (
                  filteredAttendees.map((att) => {
                    const isChecked = att.status === "Checked-in";
                    return (
                      <tr key={att.id} className="hover:bg-[#f8f9fa]/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-[#202124]">{att.name}</div>
                          <div className="text-[11px] text-[#70757a]">{att.email}</div>
                        </td>
                        <td className="py-3 px-4 font-medium text-[#3c4043]">
                          {att.company}
                        </td>
                        <td className="py-3 px-4 font-mono text-[#5f6368] font-medium">
                          {att.ticketCode}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getRoleStyle(att.role)}`}>
                            {att.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {isChecked ? (
                            <span className="flex items-center gap-1 text-[#137333] font-medium text-[11px]">
                              <UserCheck className="w-3.5 h-3.5 text-[#1e8e3e]" />
                              <span>Checked-in {att.checkInTime ? `(${att.checkInTime})` : ""}</span>
                            </span>
                          ) : (
                            <span className="text-[#70757a] text-[11px]">
                              Not Checked In
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {!isChecked ? (
                              <button
                                onClick={() => handleScanCheckIn(att)}
                                className="px-2.5 py-1 bg-[#1a73e8] hover:bg-[#174ea6] text-white font-medium rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Check-in</span>
                              </button>
                            ) : (
                              <span className="text-[11px] text-[#1e8e3e] font-medium px-2 py-1">
                                Verified
                              </span>
                            )}
                            <button
                              onClick={() => onOpenBadge(att)}
                              className="px-2.5 py-1 bg-white border border-[#dadce0] hover:bg-[#f1f3f4] text-[#3c4043] font-medium rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
                              title="Generate print-ready badge"
                            >
                              <Printer className="w-3.5 h-3.5 text-[#1a73e8]" />
                              <span>Badge</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Walk-in Registration Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            className="bg-white rounded-2xl shadow-2xl border border-[#dadce0] max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-[#dadce0] flex items-center justify-between bg-[#f8f9fa]">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#1a73e8]" />
                <h3 className="text-sm font-semibold text-[#202124]">Walk-In Guest Registration</h3>
              </div>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-1 text-[#5f6368] hover:text-[#202124] rounded-full hover:bg-[#e8eaed]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-[#202124] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#dadce0] rounded-lg text-xs focus:outline-none focus:border-[#1a73e8]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#202124] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. jane.doe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-[#dadce0] rounded-lg text-xs focus:outline-none focus:border-[#1a73e8]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#202124] mb-1">Organization / Company</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google Developers / University"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3 py-2 border border-[#dadce0] rounded-lg text-xs focus:outline-none focus:border-[#1a73e8]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#202124] mb-1">Access Credential Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as AttendeeRole)}
                  className="w-full px-3 py-2 border border-[#dadce0] rounded-lg text-xs focus:outline-none focus:border-[#1a73e8] bg-white"
                >
                  <option value="Attendee">Attendee</option>
                  <option value="VIP">VIP Guest</option>
                  <option value="Speaker">Speaker</option>
                  <option value="Staff">Staff / Operations</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#dadce0] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-[#dadce0] rounded-lg text-[#3c4043] hover:bg-[#f1f3f4] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1a73e8] hover:bg-[#174ea6] text-white font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Issue Pass & Check-In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
