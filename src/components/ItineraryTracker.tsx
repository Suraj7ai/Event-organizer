import React, { useState } from "react";
import { ItineraryItem, UserRole } from "../types";
import { 
  Calendar, 
  Clock, 
  Upload, 
  AlertTriangle, 
  Play, 
  User, 
  ArrowRight, 
  FileText, 
  CheckCircle, 
  TrendingUp,
  Sliders,
  BellRing,
  ExternalLink
} from "lucide-react";

interface ItineraryTrackerProps {
  itinerary: ItineraryItem[];
  currentUserRole: UserRole;
  delayOffset: number;
  onUpdateDelayOffset: (minutes: number) => void;
  onUpdateItineraryItem: (id: string, updater: (item: ItineraryItem) => ItineraryItem) => void;
}

export default function ItineraryTracker({
  itinerary,
  currentUserRole,
  delayOffset,
  onUpdateDelayOffset,
  onUpdateItineraryItem,
}: ItineraryTrackerProps) {
  const [selectedSpeakerId, setSelectedSpeakerId] = useState<string>("it-2");
  const [simulatedFile, setSimulatedFile] = useState<string | null>(null);
  const [isSpeakerDisplayAlert, setIsSpeakerDisplayAlert] = useState(false);

  // Helper function to shift HH:MM time by offset minutes
  const getAdjustedTime = (originalTime: string, offsetMins: number): string => {
    if (offsetMins === 0) return originalTime;
    const [hoursStr, minutesStr] = originalTime.split(":");
    let hours = parseInt(hoursStr);
    let minutes = parseInt(minutesStr);
    
    minutes += offsetMins;
    while (minutes >= 60) {
      minutes -= 60;
      hours += 1;
    }
    while (minutes < 0) {
      minutes += 60;
      hours -= 1;
    }
    if (hours >= 24) hours = hours % 24;
    
    const hStr = hours.toString().padStart(2, "0");
    const mStr = minutes.toString().padStart(2, "0");
    return `${hStr}:${mStr}`;
  };

  // Convert Adjusted Time to standard AM/PM for human reading
  const formatAmPm = (time24: string): string => {
    const [hStr, mStr] = time24.split(":");
    let h = parseInt(hStr);
    const m = mStr;
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    h = h ? h : 12; // 0 should be 12
    return `${h}:${m} ${ampm}`;
  };

  const handleSimulatedUpload = (id: string) => {
    const fileNames = [
      "AI_Studio_Function_Calling_Deck_v2.pdf",
      "Idea_Pitch_Sandbox_Provisioning.pdf",
      "Prompt_Design_Patterns_Singapore.pdf",
      "Post_Mortem_Analytics_Hack2Skill.pdf"
    ];
    const pickedFile = fileNames[Math.floor(Math.random() * fileNames.length)];
    
    onUpdateItineraryItem(id, (item) => ({
      ...item,
      deckUploaded: true,
      deckFileName: pickedFile
    }));
  };

  const handleAddDelay = (mins: number) => {
    onUpdateDelayOffset(delayOffset + mins);
  };

  const handleResetDelay = () => {
    onUpdateDelayOffset(0);
  };

  const activeSpeakerSession = itinerary.find((it) => it.id === selectedSpeakerId);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full" id="itinerary-tracker-section">
      {/* Delay Propagation Alert */}
      {delayOffset > 0 && (
        <div className="bg-amber-500 text-white p-4 flex items-center justify-between gap-4 animate-pulse-slow">
          <div className="flex items-center gap-3">
            <div className="bg-white text-amber-600 p-1.5 rounded-full">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest">⚡ Live Delay Propagation Cascade Active (+{delayOffset} minutes)</p>
              <p className="text-xs mt-0.5 opacity-90">
                A presenter delay of {delayOffset} mins has cascaded. The entire rest of the itinerary shifted in real-time. Stakeholders notified.
              </p>
            </div>
          </div>
          <button
            onClick={handleResetDelay}
            className="bg-white text-amber-700 hover:bg-amber-55 text-[10px] font-bold px-3.5 py-1.5 rounded-xl transition-colors shadow-sm"
          >
            Reset All Time Slots
          </button>
        </div>
      )}

      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-50/20">
        <div>
          <h2 className="text-xl font-display font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            Presenter & Live Itinerary Tracker
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Adaptive chronological timeline shifting dynamically. Simulates cascade propagation of delays.
          </p>
        </div>
        
        {/* Toggle Warning Alert */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">Simulate:</span>
          <button
            onClick={() => setIsSpeakerDisplayAlert(!isSpeakerDisplayAlert)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border ${
              isSpeakerDisplayAlert 
                ? "bg-yellow-500 text-white border-yellow-400" 
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <BellRing className={`w-3.5 h-3.5 ${isSpeakerDisplayAlert ? "animate-bounce" : ""}`} />
            {isSpeakerDisplayAlert ? "5-Min Warning ACTIVE" : "Test 5-Min Alert"}
          </button>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Presenter Operations Sandbox Portal (4 Cols) */}
        <div className="lg:col-span-4 bg-indigo-50/40 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between gap-4 shadow-2xs">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-indigo-950">Speaker Control Portal</h3>
            </div>
            <p className="text-[11px] text-indigo-900 leading-relaxed mb-4 font-semibold">
              Select an active presentation slot to simulate materials uploads or trigger timeline delays.
            </p>

            <div className="space-y-4">
              {/* Dropdown Selection */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">Select Speaker Slot</label>
                <select
                  value={selectedSpeakerId}
                  onChange={(e) => setSelectedSpeakerId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                >
                  {itinerary.map((it) => (
                    <option key={it.id} value={it.id}>
                      {it.speaker.split(" (")[0]} - {it.title.substring(0, 30)}...
                    </option>
                  ))}
                </select>
              </div>

              {activeSpeakerSession && (
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col gap-2.5 shadow-2xs">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600">Active Speaker Sandbox</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{activeSpeakerSession.speaker}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 italic truncate font-bold">{activeSpeakerSession.title}</p>
                  </div>

                  {/* Deck Status */}
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-150 flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-600 font-bold">Presentation Deck:</span>
                    {activeSpeakerSession.deckUploaded ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Live ✓
                      </span>
                    ) : (
                      <span className="text-amber-700 font-bold">Pending Upload</span>
                    )}
                  </div>

                  {activeSpeakerSession.deckUploaded && (
                    <span className="text-[10px] font-mono font-bold text-slate-500 break-all bg-slate-50 p-1.5 rounded-lg border border-slate-250 flex items-center gap-1">
                      <FileText className="w-3 h-3 text-indigo-500" />
                      {activeSpeakerSession.deckFileName}
                    </span>
                  )}

                  {/* Simulated Upload Button */}
                  {!activeSpeakerSession.deckUploaded && (
                    <button
                      onClick={() => handleSimulatedUpload(activeSpeakerSession.id)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Simulate PDF Upload
                    </button>
                  )}

                  {/* Delay shift triggers */}
                  <div className="pt-2 border-t border-slate-155 mt-1">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase mb-1.5 tracking-wider">Introduce Delays</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => handleAddDelay(5)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold py-1 rounded-lg text-[10px] border border-rose-150 transition-colors"
                      >
                        +5 Mins
                      </button>
                      <button
                        onClick={() => handleAddDelay(10)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold py-1 rounded-lg text-[10px] border border-rose-150 transition-colors"
                      >
                        +10 Mins
                      </button>
                      <button
                        onClick={() => handleAddDelay(15)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-750 font-bold py-1 rounded-lg text-[10px] border border-rose-150 transition-colors"
                      >
                        +15 Mins
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Warning Visual representation */}
          {isSpeakerDisplayAlert && (
            <div className="bg-amber-100 border border-amber-350 rounded-2xl p-3 text-center flex flex-col items-center gap-2 animate-pulse-slow">
              <BellRing className="w-6 h-6 text-yellow-600" />
              <div>
                <span className="text-xs font-extrabold text-yellow-900 block tracking-wider uppercase">⏰ 5 MINUTES REMAINING</span>
                <span className="text-[10px] text-yellow-800 leading-normal block mt-1">
                  Alert dispatched to stage monitors: Catherine Vance is in overtime window. Prepare team pitch.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Chronological Cascade Timeline (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-indigo-500" />
            Cascading Timeline (Real-Time Recalculations)
          </h3>

          <div className="space-y-4 flex-1">
            {itinerary.map((it, idx) => {
              // Calculate adjusted start time
              const adjustedStart = getAdjustedTime(it.originalTime, delayOffset);
              // Calculate adjusted end time
              const end24 = getAdjustedTime(adjustedStart, it.durationMinutes);
              const formattedTimeSpan = `${formatAmPm(adjustedStart)} - ${formatAmPm(end24)}`;

              return (
                <div 
                  key={it.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-3xs ${
                    selectedSpeakerId === it.id
                      ? "bg-indigo-50/40 border-indigo-200 ring-1 ring-indigo-200/50"
                      : "bg-white border-slate-200 hover:border-slate-350 hover:shadow-2xs"
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    {/* Time block */}
                    <div className="bg-slate-50 px-3 py-2 rounded-xl text-center min-w-[100px] border border-slate-200 shadow-3xs">
                      <span className="block text-xs font-bold text-slate-850 font-mono">
                        {getAdjustedTime(it.originalTime, delayOffset)}
                      </span>
                      {delayOffset > 0 && (
                        <span className="text-[9px] font-mono text-rose-500 font-bold block">
                          Original: {it.originalTime}
                        </span>
                      )}
                      <span className="text-[9px] text-slate-400 font-bold block mt-0.5">
                        {it.durationMinutes} mins
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-800 leading-normal">{it.title}</h4>
                      <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-550 font-semibold">
                        <span className="flex items-center gap-1 text-slate-600">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          {it.speaker}
                        </span>
                        <span>•</span>
                        <span className="text-slate-400 font-bold">Span: {formattedTimeSpan}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal italic font-medium">{it.notes}</p>
                    </div>
                  </div>

                  {/* Deck Badge */}
                  <div className="shrink-0 flex items-center justify-end">
                    {it.deckUploaded ? (
                      <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1" title={it.deckFileName || "Deck"}>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-650" />
                        Deck Ready
                      </div>
                    ) : (
                      <div className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5 text-amber-500" />
                        No Slide Deck
                      </div>
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
