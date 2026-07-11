import React, { useState, useEffect } from "react";
import { Attendee, UserRole } from "../types";
import { 
  Users, 
  QrCode, 
  AlertOctagon, 
  UserCheck, 
  TrendingUp, 
  UserMinus, 
  Sparkles, 
  Plus, 
  Info,
  Timer,
  Zap,
  HelpCircle
} from "lucide-react";

interface CheckInDeskProps {
  attendees: Attendee[];
  currentUserRole: UserRole;
  onCheckInAttendee: (id: string) => void;
  onRegisterNewAttendee: (name: string, email: string, company: string) => void;
}

export default function CheckInDesk({
  attendees,
  currentUserRole,
  onCheckInAttendee,
  onRegisterNewAttendee,
}: CheckInDeskProps) {
  // Queue state
  const [activeQueueLength, setActiveQueueLength] = useState(3);
  const [isAlertAcknowledged, setIsAlertAcknowledged] = useState(false);
  const [activeTicket, setActiveTicket] = useState<Attendee | null>(null);

  // Form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Wait time calculations
  const waitTimePerPersonMinutes = 1.8;
  const currentWaitTime = Math.round(activeQueueLength * waitTimePerPersonMinutes);
  const isWaitTimeCritical = currentWaitTime > 5;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !company) return;
    onRegisterNewAttendee(name, email, company);
    setName("");
    setEmail("");
    setCompany("");
    setShowAddForm(false);
    // Add to simulated queue length
    setActiveQueueLength(prev => prev + 1);
  };

  const handleBurstQueue = () => {
    setActiveQueueLength(prev => prev + 6);
    setIsAlertAcknowledged(false);
  };

  const handleDispatchBusters = () => {
    setActiveQueueLength(1);
    setIsAlertAcknowledged(false);
  };

  const handleScanCheckIn = (attendee: Attendee) => {
    if (attendee.status === "Checked-in") return;
    onCheckInAttendee(attendee.id);
    setActiveTicket(null);
    if (activeQueueLength > 0) {
      setActiveQueueLength(prev => prev - 1);
    }
  };

  const checkedInCount = attendees.filter((a) => a.status === "Checked-in").length;
  const totalRSVPs = attendees.length;
  const percentCheckedIn = totalRSVPs > 0 ? Math.round((checkedInCount / totalRSVPs) * 100) : 0;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full" id="check-in-desk-section">
      {/* Alert Header */}
      {isWaitTimeCritical && !isAlertAcknowledged && (
        <div className="bg-rose-600 text-white p-4 flex items-center justify-between gap-4 animate-bounce-short">
          <div className="flex items-center gap-3">
            <div className="bg-white text-rose-600 p-1.5 rounded-full">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest">🚨 Queue Congestion Alert (Critical wait time: {currentWaitTime} minutes)</p>
              <p className="text-xs mt-0.5 opacity-90">
                Wait times exceed 5-minute SLAs. Automating dispatch pager alert to host Venue Admin (Google Facilities) and on-site Volunteers.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDispatchBusters}
              className="bg-white text-rose-700 hover:bg-rose-50 text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-sm transition-colors flex items-center gap-1"
            >
              <Zap className="w-3.5 h-3.5" />
              Dispatch Queue Busters
            </button>
            <button
              onClick={() => setIsAlertAcknowledged(true)}
              className="bg-rose-700 text-white hover:bg-rose-800 text-[11px] font-medium px-2.5 py-1.5 rounded-xl border border-rose-500/30 transition-colors"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}

      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-50/20">
        <div>
          <h2 className="text-xl font-display font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Smart Check-In & Queue Management Desk
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Rapid contactless attendee onboarding and live traffic monitoring with automated wait-time alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Direct Add Attendee
          </button>
          <button
            onClick={handleBurstQueue}
            className="bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-1.5 rounded-xl text-xs font-bold border border-rose-200 flex items-center gap-1 transition-colors"
            title="Simulate sudden arrival of 6 hackathon attendees at check-in"
          >
            <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
            Simulate Rush Hour Burst (+6)
          </button>
        </div>
      </div>

      {/* Grid panels */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel 1: Live Status & Wait indicators */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-800">Traffic Monitoring Console</h3>

          {/* Wait Meter Box */}
          <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 shadow-2xs ${
            isWaitTimeCritical 
              ? "bg-rose-50/70 border-rose-200 text-rose-900" 
              : "bg-emerald-50/70 border-emerald-100 text-emerald-900"
          }`}>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest opacity-85">Registration Queue</span>
              <span className="block text-2xl font-mono font-bold mt-1">
                {activeQueueLength} <span className="text-xs font-sans font-medium text-slate-500">people</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-widest opacity-85 flex items-center gap-1 justify-end">
                <Timer className="w-3.5 h-3.5" />
                Est. Wait Time
              </span>
              <span className={`block text-2xl font-mono font-bold mt-1 ${isWaitTimeCritical ? "text-rose-600 animate-pulse" : "text-emerald-700"}`}>
                {currentWaitTime} <span className="text-xs font-sans font-medium text-slate-500">mins</span>
              </span>
            </div>
          </div>

          {/* Progress Bar expected vs checked */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Check-in Progress</span>
              <span className="font-mono text-indigo-600 font-bold">{percentCheckedIn}% ({checkedInCount}/{totalRSVPs})</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 rounded-full transition-all duration-500" 
                style={{ width: `${percentCheckedIn}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
              <span>Expected Capacity: {totalRSVPs}</span>
              <span>Available Seats Remaining: {totalRSVPs - checkedInCount}</span>
            </div>
          </div>

          {/* Direct Input Registration Form */}
          {showAddForm && (
            <form onSubmit={handleRegisterSubmit} className="bg-white p-3.5 rounded-xl border border-slate-250 space-y-3 shadow-2xs">
              <span className="text-xs font-bold text-slate-800 block">Register Guest On-Site</span>
              <div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs focus:bg-white"
                />
              </div>
              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs focus:bg-white"
                />
              </div>
              <div>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Company / University"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs focus:bg-white"
                />
              </div>
              <div className="flex justify-end gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-[10px] text-slate-500 hover:text-slate-900 px-1 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-2xs"
                >
                  Submit
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Panel 2: Register & QR generator */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between shadow-2xs">
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-2">QR Code Ticket Generator</h3>
            <p className="text-[11px] text-slate-500 mb-4 leading-normal font-medium">
              Select any registered attendee from the list to display their visual check-in credential and scan ticket.
            </p>

            {activeTicket ? (
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-center flex flex-col items-center gap-3 shadow-2xs">
                {/* Visual mock QR code */}
                <div className="bg-slate-100 p-2.5 rounded-xl border-2 border-slate-900 flex flex-col items-center justify-center">
                  <QrCode className="w-24 h-24 text-slate-900" />
                  <span className="text-[9px] font-mono font-bold text-slate-650 tracking-wider mt-1.5">
                    {activeTicket.ticketCode}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-800">{activeTicket.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-bold">{activeTicket.company}</p>
                </div>

                <button
                  onClick={() => handleScanCheckIn(activeTicket)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 rounded-lg text-xs flex items-center justify-center gap-1 transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Simulate Rapid Scan & Check-In
                </button>
              </div>
            ) : (
              <div className="border border-dashed border-slate-200 rounded-xl bg-white p-6 text-center flex flex-col items-center justify-center h-48 text-slate-400">
                <QrCode className="w-10 h-10 text-slate-300" />
                <p className="text-xs font-bold text-slate-500 mt-2">No attendee selected</p>
                <p className="text-[10px] text-slate-400 mt-1 max-w-[150px] leading-relaxed">
                  Click on an attendee from the queue list on the right to load their pass.
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] text-slate-400 flex items-start gap-1.5 leading-normal">
            <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
            <span>Scanning verifies the ticket code, checks database parameters, records a sub-second timestamp, and reduces active queue times.</span>
          </div>
        </div>

        {/* Panel 3: Attendee Register List with Scan Button */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col h-[320px] shadow-2xs">
          <h3 className="text-sm font-bold text-slate-800 mb-3">On-Site Registration Roster</h3>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1.5">
            {attendees.map((attendee) => {
              const isCheckedIn = attendee.status === "Checked-in";
              return (
                <div
                  key={attendee.id}
                  onClick={() => {
                    if (!isCheckedIn) setActiveTicket(attendee);
                  }}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isCheckedIn
                      ? "bg-slate-100 border-slate-200 text-slate-400"
                      : activeTicket?.id === attendee.id
                      ? "bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200 shadow-2xs"
                      : "bg-white border-slate-200 hover:border-slate-350 hover:shadow-2xs"
                  }`}
                >
                  <div className="truncate flex-1">
                    <span className="text-[11px] font-bold text-slate-800 block truncate">{attendee.name}</span>
                    <span className="text-[9px] text-slate-400 block truncate font-mono font-semibold">{attendee.company} ({attendee.ticketCode})</span>
                  </div>

                  <div className="shrink-0 flex items-center">
                    {isCheckedIn ? (
                      <span className="text-[9px] bg-emerald-150 text-emerald-850 font-bold px-1.5 py-0.5 rounded border border-emerald-250 flex items-center gap-0.5">
                        <UserCheck className="w-2.5 h-2.5" />
                        In
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleScanCheckIn(attendee);
                        }}
                        className="text-[9px] bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold px-1.5 py-0.5 rounded border border-indigo-150 transition-colors"
                      >
                        Quick Check
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
