import React, { useState } from "react";
import { ItineraryItem, EventDetails } from "../types";
import { X, Copy, Check, FileDown, Printer, Clock, FileSpreadsheet, Sparkles } from "lucide-react";

interface RunOfShowExportModalProps {
  itinerary: ItineraryItem[];
  delayOffset: number;
  event: EventDetails;
  onClose: () => void;
}

export default function RunOfShowExportModal({
  itinerary,
  delayOffset,
  event,
  onClose,
}: RunOfShowExportModalProps) {
  const [copied, setCopied] = useState(false);

  // Helper to compute effective time
  const getAdjustedTime = (baseTime: string, offsetMins: number) => {
    const [hours, mins] = baseTime.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, mins + offsetMins, 0);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const getAdjustedEndTime = (baseTime: string, offsetMins: number, durationMins: number) => {
    const [hours, mins] = baseTime.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, mins + offsetMins + durationMins, 0);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const copyToClipboard = () => {
    // Generate TSV format for Google Sheets / Excel
    const header = ["Start Time", "End Time", "Duration (min)", "Session Title", "Speaker / Lead", "Deck Status", "Notes"].join("\t");
    const rows = itinerary.map((item) => {
      const startTime = getAdjustedTime(item.originalTime, delayOffset);
      const endTime = getAdjustedEndTime(item.originalTime, delayOffset, item.durationMinutes);
      const deck = item.deckUploaded ? "Uploaded" : "Pending";
      return [startTime, endTime, item.durationMinutes, item.title, item.speaker, deck, item.notes || ""].join("\t");
    });
    const tsvContent = `${event.name} - Run of Show (Delay Offset: +${delayOffset} min)\n${header}\n${rows.join("\n")}`;

    navigator.clipboard.writeText(tsvContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const downloadCSV = () => {
    const header = ["Start Time,End Time,Duration (min),Session Title,Speaker,Deck Status,Notes"];
    const rows = itinerary.map((item) => {
      const startTime = `"${getAdjustedTime(item.originalTime, delayOffset)}"`;
      const endTime = `"${getAdjustedEndTime(item.originalTime, delayOffset, item.durationMinutes)}"`;
      const title = `"${item.title.replace(/"/g, '""')}"`;
      const speaker = `"${item.speaker.replace(/"/g, '""')}"`;
      const deck = item.deckUploaded ? "Uploaded" : "Pending";
      const notes = `"${(item.notes || "").replace(/"/g, '""')}"`;
      return [startTime, endTime, item.durationMinutes, title, speaker, deck, notes].join(",");
    });
    const csvContent = "data:text/csv;charset=utf-8," + [header, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${event.name.replace(/\s+/g, "_")}_Run_of_Show.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs no-print animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-[#dadce0] max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#dadce0] flex items-center justify-between bg-[#f8f9fa]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1a73e8] flex items-center justify-center text-white">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-[#202124]">Run of Show Manifest & Google Sheets Sync</h3>
                {delayOffset > 0 && (
                  <span className="text-[11px] font-mono font-medium text-[#d93025] bg-[#fce8e6] px-2 py-0.5 rounded-full">
                    +{delayOffset}m Delay Applied
                  </span>
                )}
              </div>
              <p className="text-xs text-[#5f6368]">{event.name} · {event.venueName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#5f6368] hover:text-[#202124] hover:bg-[#e8eaed] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-[#f8f9fa] border border-[#e8eaed] rounded-xl text-xs text-[#5f6368]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#1a73e8]" />
              <span>
                Export format is optimized for direct pasting into <strong>Google Sheets</strong> or instant CSV data warehouse import.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={copyToClipboard}
                className="px-3 py-1.5 rounded-lg border border-[#dadce0] bg-white text-[#202124] hover:bg-[#f1f3f4] font-medium flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#1e8e3e]" /> : <Copy className="w-3.5 h-3.5 text-[#5f6368]" />}
                <span>{copied ? "Copied for Sheets!" : "Copy for Google Sheets"}</span>
              </button>
              <button
                onClick={downloadCSV}
                className="px-3 py-1.5 rounded-lg border border-[#dadce0] bg-white text-[#202124] hover:bg-[#f1f3f4] font-medium flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5 text-[#5f6368]" />
                <span>Download CSV</span>
              </button>
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-lg bg-[#1a73e8] text-white hover:bg-[#174ea6] font-medium flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Sheet</span>
              </button>
            </div>
          </div>

          {/* Printable Run of Show Table */}
          <div id="printable-ros-area" className="border border-[#e8eaed] rounded-xl overflow-hidden bg-white">
            <div className="p-4 border-b border-[#e8eaed] bg-[#f8f9fa] flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#202124]">{event.name} — Master Timeline</h4>
                <p className="text-xs text-[#5f6368] font-mono mt-0.5">
                  Date: {event.date} · Window: {event.timeWindow} · Live Offset: +{delayOffset} mins
                </p>
              </div>
              <span className="text-xs text-[#70757a] font-mono">
                Generated {new Date().toLocaleDateString()}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#f8f9fa] border-b border-[#e8eaed] text-[#5f6368] uppercase tracking-wider text-[10px] font-semibold">
                    <th className="py-2.5 px-4 font-mono">Original</th>
                    <th className="py-2.5 px-4 font-mono text-[#1a73e8]">Live Time</th>
                    <th className="py-2.5 px-4">Duration</th>
                    <th className="py-2.5 px-4">Session & Topic</th>
                    <th className="py-2.5 px-4">Speaker / Lead</th>
                    <th className="py-2.5 px-4 text-center">Deck</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8eaed]">
                  {itinerary.map((item, idx) => {
                    const adjStart = getAdjustedTime(item.originalTime, delayOffset);
                    const adjEnd = getAdjustedEndTime(item.originalTime, delayOffset, item.durationMinutes);
                    return (
                      <tr key={item.id} className={idx % 2 === 0 ? "bg-white" : "bg-[#f8f9fa]/50"}>
                        <td className="py-3 px-4 font-mono text-[#70757a]">{item.originalTime}</td>
                        <td className="py-3 px-4 font-mono font-bold text-[#202124]">
                          {adjStart} - {adjEnd}
                        </td>
                        <td className="py-3 px-4 font-mono text-[#5f6368]">{item.durationMinutes}m</td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-[#202124]">{item.title}</div>
                          {item.notes && <p className="text-[11px] text-[#70757a] mt-0.5">{item.notes}</p>}
                        </td>
                        <td className="py-3 px-4 font-medium text-[#3c4043]">{item.speaker}</td>
                        <td className="py-3 px-4 text-center">
                          {item.deckUploaded ? (
                            <span className="text-[11px] font-medium text-[#1e8e3e] bg-[#e6f4ea] px-2 py-0.5 rounded-full">
                              Ready
                            </span>
                          ) : (
                            <span className="text-[11px] font-medium text-[#ea8600] bg-[#fef7e0] px-2 py-0.5 rounded-full">
                              Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-white border-t border-[#dadce0] flex items-center justify-between text-xs text-[#5f6368]">
          <span className="flex items-center gap-1 font-mono">
            <Clock className="w-3.5 h-3.5 text-[#5f6368]" />
            All times synchronized to Google Singapore SGT (UTC+8)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-[#3c4043] hover:bg-[#f1f3f4] rounded-lg border border-[#dadce0] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
