import React, { useState, useEffect } from "react";
import { ItineraryItem, UserRole } from "../types";
import { 
  Calendar, 
  Clock, 
  Upload, 
  AlertTriangle, 
  Play, 
  User, 
  FileText, 
  CheckCircle, 
  FileSpreadsheet, 
  RotateCcw, 
  Plus, 
  BellRing,
  ExternalLink,
  Presentation
} from "lucide-react";

interface ItineraryTrackerProps {
  itinerary: ItineraryItem[];
  currentUserRole: UserRole;
  delayOffset: number;
  onUpdateDelayOffset: (minutes: number) => void;
  onUpdateItineraryItem: (id: string, updater: (item: ItineraryItem) => ItineraryItem) => void;
  onOpenExportModal?: () => void;
}

export default function ItineraryTracker({
  itinerary,
  currentUserRole,
  delayOffset,
  onUpdateDelayOffset,
  onUpdateItineraryItem,
  onOpenExportModal,
}: ItineraryTrackerProps) {
  const [selectedSpeakerId, setSelectedSpeakerId] = useState<string>("it-2");
  const [isSpeakerDisplayAlert, setIsSpeakerDisplayAlert] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(24 * 60 + 15); // 24m 15s

  // Countdown timer for active stage session
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Helper to shift HH:MM time by offset minutes
  const getAdjustedTime = (originalTime: string, offsetMins: number): string => {
    if (offsetMins === 0) return originalTime;
    const [hoursStr, minutesStr] = originalTime.split(":");
    let hours = parseInt(hoursStr, 10);
    let minutes = parseInt(minutesStr, 10);
    
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

  const formatAmPm = (time24: string): string => {
    const [hStr, mStr] = time24.split(":");
    let h = parseInt(hStr, 10);
    const m = mStr;
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    h = h ? h : 12;
    return `${h}:${m} ${ampm}`;
  };

  const handleSimulatedUpload = (id: string) => {
    const fileNames = [
      "Google_GenAI_TypeScript_SDK_Mastery.pdf",
      "Function_Calling_Streaming_Patterns.pdf",
      "Hack2Skill_Live_Sandbox_Guidelines.pdf",
      "Model_Deployment_Cloud_Run_Singapore.pdf",
    ];
    const pickedFile = fileNames[Math.floor(Math.random() * fileNames.length)];
    
    onUpdateItineraryItem(id, (item) => ({
      ...item,
      deckUploaded: true,
      deckFileName: pickedFile,
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
    <div className="space-y-4">
      {/* Live Delay Cascade Notification */}
      {delayOffset > 0 && (
        <div className="bg-[#fef7e0] border border-[#fdd663] text-[#b06000] p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#f9ab00]/20 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-[#b06000]" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">
                Real-Time Schedule Delay Cascade Active (+{delayOffset} mins)
              </p>
              <p className="text-xs text-[#5f6368] mt-0.5">
                All subsequent stage sessions have dynamically shifted forward. Presenters and catering staff notified.
              </p>
            </div>
          </div>
          <button
            onClick={handleResetDelay}
            className="px-3 py-1.5 rounded-lg border border-[#fdd663] bg-white hover:bg-[#fef7e0] text-xs font-semibold text-[#b06000] flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Delay Offset</span>
          </button>
        </div>
      )}

      {/* Main Container Card */}
      <div className="bg-white rounded-2xl border border-[#dadce0] p-6 shadow-2xs space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#dadce0]">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#1a73e8] text-white flex items-center justify-center">
                <Presentation className="w-4 h-4" />
              </div>
              <h2 className="text-base font-semibold text-[#202124]">
                Presenter & Stage Run of Show
              </h2>
            </div>
            <p className="text-xs text-[#5f6368] mt-1">
              Live presentation schedule, stage countdown timer, delay cascade controls, and PDF slide decks
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsSpeakerDisplayAlert(!isSpeakerDisplayAlert)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
                isSpeakerDisplayAlert
                  ? "bg-[#fef7e0] text-[#b06000] border-[#fdd663]"
                  : "bg-white text-[#5f6368] border-[#dadce0] hover:bg-[#f1f3f4]"
              }`}
            >
              <BellRing className={`w-3.5 h-3.5 ${isSpeakerDisplayAlert ? "animate-bounce text-[#ea8600]" : ""}`} />
              <span>{isSpeakerDisplayAlert ? "Stage Warning ON" : "Test 5-Min Chime"}</span>
            </button>

            {onOpenExportModal && (
              <button
                onClick={onOpenExportModal}
                className="px-3.5 py-1.5 rounded-lg bg-[#1a73e8] hover:bg-[#174ea6] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export Run of Show</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Stage Confidence Countdown + Delay Trigger Strip */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Stage Confidence Monitor Box */}
          <div className="md:col-span-5 p-4 rounded-xl border border-[#dadce0] bg-[#202124] text-white flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1e8e3e] animate-ping" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#9aa0a6]">
                  Stage Confidence Monitor · Active Slot
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#81c995] bg-[#0d652d] px-2 py-0.5 rounded">
                LIVE STAGE
              </span>
            </div>

            <div className="my-4">
              <div className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-white">
                {formatCountdown(secondsRemaining)}
              </div>
              <p className="text-xs text-[#bdc1c6] mt-1 font-medium truncate">
                Dr. Catherine Vance · Prompt Engineering & GenAI SDK
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#3c4043] text-[11px] text-[#9aa0a6] font-mono">
              <span>Auditorium Alpha (Stage Hall)</span>
              <span>Lapel Mic 1: 94%</span>
            </div>
          </div>

          {/* Quick Schedule Delay Cascader */}
          <div className="md:col-span-7 p-4 rounded-xl border border-[#e8eaed] bg-[#f8f9fa] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#202124]">Dynamic Delay Cascader</span>
                <span className="text-[11px] font-mono font-bold text-[#1a73e8]">
                  Current Shift: +{delayOffset} mins
                </span>
              </div>
              <p className="text-xs text-[#5f6368] mt-1">
                If keynote or Q&A runs over, inject offset minutes. All remaining sessions immediately recalculate.
              </p>
            </div>

            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <button
                onClick={() => handleAddDelay(5)}
                className="px-3 py-1.5 bg-white border border-[#dadce0] hover:bg-[#e8eaed] text-xs font-medium text-[#202124] rounded-lg transition-colors cursor-pointer shadow-2xs"
              >
                +5 Mins
              </button>
              <button
                onClick={() => handleAddDelay(10)}
                className="px-3 py-1.5 bg-white border border-[#dadce0] hover:bg-[#e8eaed] text-xs font-medium text-[#202124] rounded-lg transition-colors cursor-pointer shadow-2xs"
              >
                +10 Mins
              </button>
              <button
                onClick={() => handleAddDelay(15)}
                className="px-3 py-1.5 bg-white border border-[#dadce0] hover:bg-[#e8eaed] text-xs font-medium text-[#202124] rounded-lg transition-colors cursor-pointer shadow-2xs"
              >
                +15 Mins
              </button>
              <button
                onClick={handleResetDelay}
                className="px-3 py-1.5 bg-white border border-[#dadce0] hover:bg-[#fce8e6] text-xs font-medium text-[#d93025] rounded-lg transition-colors cursor-pointer shadow-2xs ml-auto"
              >
                Reset to 0
              </button>
            </div>
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Speaker Sandbox Portal */}
          <div className="lg:col-span-4 p-4 rounded-xl border border-[#dadce0] bg-[#f8f9fa] space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-[#202124] uppercase tracking-wider">
                Speaker Slide Deck Portal
              </h3>
              <p className="text-xs text-[#5f6368] mt-0.5">
                Upload or inspect PDF decks dispatched to stage confidence displays.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#5f6368] mb-1">
                Select Session Slot
              </label>
              <select
                value={selectedSpeakerId}
                onChange={(e) => setSelectedSpeakerId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#dadce0] rounded-lg text-xs text-[#202124] focus:outline-none focus:border-[#1a73e8]"
              >
                {itinerary.map((it) => (
                  <option key={it.id} value={it.id}>
                    {it.originalTime} - {it.speaker.split(" (")[0]}
                  </option>
                ))}
              </select>
            </div>

            {activeSpeakerSession && (
              <div className="bg-white p-4 rounded-xl border border-[#dadce0] space-y-3 shadow-2xs">
                <div>
                  <h4 className="text-xs font-bold text-[#202124]">{activeSpeakerSession.speaker}</h4>
                  <p className="text-[11px] text-[#5f6368] truncate mt-0.5">{activeSpeakerSession.title}</p>
                </div>

                <div className="p-2.5 rounded-lg border border-[#e8eaed] bg-[#f8f9fa] flex items-center justify-between text-xs">
                  <span className="text-[#5f6368]">Slide Material:</span>
                  {activeSpeakerSession.deckUploaded ? (
                    <span className="font-medium text-[#137333] bg-[#e6f4ea] px-2 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-[#1e8e3e]" />
                      Verified
                    </span>
                  ) : (
                    <span className="font-medium text-[#b06000] bg-[#fef7e0] px-2 py-0.5 rounded">
                      Pending
                    </span>
                  )}
                </div>

                {activeSpeakerSession.deckUploaded && (
                  <div className="p-2 bg-[#f8f9fa] rounded border border-[#e8eaed] text-[11px] font-mono text-[#3c4043] flex items-center gap-1.5 break-all">
                    <FileText className="w-3.5 h-3.5 text-[#1a73e8] shrink-0" />
                    <span>{activeSpeakerSession.deckFileName}</span>
                  </div>
                )}

                {!activeSpeakerSession.deckUploaded ? (
                  <button
                    onClick={() => handleSimulatedUpload(activeSpeakerSession.id)}
                    className="w-full py-2 bg-[#1a73e8] hover:bg-[#174ea6] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Slide Deck PDF</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleSimulatedUpload(activeSpeakerSession.id)}
                    className="w-full py-1.5 bg-white border border-[#dadce0] hover:bg-[#f1f3f4] text-[#3c4043] text-xs font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    Replace / Update PDF
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right: Master Chronological Timeline */}
          <div className="lg:col-span-8 space-y-3">
            <h3 className="text-xs font-semibold text-[#202124] uppercase tracking-wider">
              Chronological Timeline & Cascaded Windows
            </h3>

            <div className="space-y-2.5">
              {itinerary.map((item) => {
                const adjStart = getAdjustedTime(item.originalTime, delayOffset);
                const adjEnd = getAdjustedTime(adjStart, item.durationMinutes);
                const isSelected = selectedSpeakerId === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedSpeakerId(item.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs ${
                      isSelected
                        ? "bg-[#e8f0fe]/40 border-[#1a73e8] ring-1 ring-[#1a73e8]/30"
                        : "bg-white border-[#e8eaed] hover:border-[#dadce0]"
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1">
                      {/* Time Block */}
                      <div className="bg-[#f8f9fa] border border-[#e8eaed] px-3 py-1.5 rounded-lg text-center min-w-[90px]">
                        <span className="block font-mono text-xs font-bold text-[#202124]">
                          {adjStart}
                        </span>
                        {delayOffset > 0 && (
                          <span className="block font-mono text-[9px] text-[#d93025] line-through">
                            {item.originalTime}
                          </span>
                        )}
                        <span className="block text-[10px] text-[#70757a] font-mono mt-0.5">
                          {item.durationMinutes}m
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-[#202124]">{item.title}</h4>
                        <p className="text-[11px] text-[#5f6368] font-medium flex items-center gap-1">
                          <User className="w-3 h-3 text-[#70757a]" />
                          <span>{item.speaker}</span>
                          <span className="text-[#dadce0]">·</span>
                          <span className="font-mono text-[#70757a]">{formatAmPm(adjStart)} - {formatAmPm(adjEnd)}</span>
                        </p>
                        {item.notes && (
                          <p className="text-[11px] text-[#70757a] italic mt-0.5">{item.notes}</p>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {item.deckUploaded ? (
                        <span className="text-[10px] font-medium text-[#137333] bg-[#e6f4ea] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-[#1e8e3e]" />
                          Deck Ready
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-[#b06000] bg-[#fef7e0] px-2 py-0.5 rounded-full">
                          Pending Deck
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
