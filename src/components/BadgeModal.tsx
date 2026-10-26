import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Attendee, EventDetails } from "../types";
import { Printer, X, CheckCircle2, Shield, Sparkles, Building2, User } from "lucide-react";

interface BadgeModalProps {
  attendee: Attendee | null;
  event: EventDetails;
  onClose: () => void;
  onMarkPrinted?: (id: string) => void;
}

export default function BadgeModal({ attendee, event, onClose, onMarkPrinted }: BadgeModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    if (!attendee) return;
    const qrPayload = JSON.stringify({
      code: attendee.ticketCode,
      name: attendee.name,
      company: attendee.company,
      role: attendee.role,
      event: event.name,
    });

    QRCode.toDataURL(qrPayload, {
      width: 240,
      margin: 1,
      color: {
        dark: "#202124",
        light: "#ffffff",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("QR Code generation error:", err));
  }, [attendee, event]);

  if (!attendee) return null;

  const handlePrint = () => {
    if (onMarkPrinted) {
      onMarkPrinted(attendee.id);
    }
    window.print();
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case "Speaker":
        return "bg-[#e8f0fe] text-[#1a73e8] border-[#aecbfa]";
      case "VIP":
        return "bg-[#fef7e0] text-[#b06000] border-[#fdd663]";
      case "Staff":
        return "bg-[#ceead6] text-[#0d652d] border-[#81c995]";
      default:
        return "bg-[#f1f3f4] text-[#3c4043] border-[#dadce0]";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs no-print animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-[#dadce0] max-w-md w-full overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[#dadce0] flex items-center justify-between bg-[#f8f9fa]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#1a73e8] flex items-center justify-center text-white text-xs font-bold">
              ID
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#202124]">Attendee Credential Badge</h3>
              <p className="text-xs text-[#5f6368]">Print-ready thermal/lanyard format</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#5f6368] hover:text-[#202124] hover:bg-[#e8eaed] rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badge Card Container (targeted by printable-badge-area in print CSS) */}
        <div className="p-6 bg-[#f1f3f4] flex justify-center">
          <div 
            id="printable-badge-area"
            className="w-[300px] bg-white rounded-xl border border-[#dadce0] shadow-sm p-5 flex flex-col items-center text-center relative overflow-hidden"
          >
            {/* Lanyard Hole Punch Marker */}
            <div className="w-12 h-2.5 rounded-full bg-[#e8eaed] border border-[#dadce0] mb-4" />

            {/* Event Brand Bar */}
            <div className="w-full pb-3 border-b border-[#e8eaed] mb-4">
              <div className="flex items-center justify-center gap-1.5 text-[#1a73e8] mb-1">
                <Sparkles className="w-4 h-4 text-[#1a73e8]" />
                <span className="text-[11px] font-bold tracking-wider uppercase text-[#1a73e8]">
                  Google Cloud · Hack2Skill
                </span>
              </div>
              <h4 className="text-xs font-semibold text-[#202124] leading-tight px-2">
                {event.name}
              </h4>
            </div>

            {/* Attendee Name & Details */}
            <div className="w-full my-1">
              <h2 className="text-lg font-bold text-[#202124] tracking-tight">
                {attendee.name}
              </h2>
              <p className="text-xs font-medium text-[#5f6368] mt-0.5 flex items-center justify-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-[#5f6368]" />
                {attendee.company}
              </p>
            </div>

            {/* Role Banner */}
            <div className="my-3">
              <span className={`text-[11px] font-bold px-3 py-0.5 rounded-full border ${getRoleBadgeStyle(attendee.role)} uppercase tracking-wider`}>
                {attendee.role}
              </span>
            </div>

            {/* QR Code */}
            <div className="bg-white p-2 rounded-lg border border-[#e8eaed] my-2 shadow-2xs">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt={`QR Code for ${attendee.ticketCode}`} className="w-36 h-36" />
              ) : (
                <div className="w-36 h-36 bg-[#f8f9fa] flex items-center justify-center text-xs text-[#5f6368]">
                  Generating QR...
                </div>
              )}
            </div>

            {/* Ticket Code & Time */}
            <div className="w-full pt-3 border-t border-[#e8eaed] text-[10px] text-[#5f6368] space-y-0.5">
              <p className="font-mono font-semibold text-[#3c4043] tracking-widest">{attendee.ticketCode}</p>
              <p>{event.date} · {event.venueName.split("-")[0]}</p>
              <div className="flex items-center justify-center gap-1.5 pt-1 text-[9px] text-[#70757a]">
                <Shield className="w-3 h-3 text-[#1e8e3e]" />
                <span>Verified Access Pass</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="px-6 py-4 bg-white border-t border-[#dadce0] flex items-center justify-between gap-3">
          <div className="text-xs text-[#5f6368] flex items-center gap-1.5">
            <CheckCircle2 className={`w-4 h-4 ${attendee.status === "Checked-in" ? "text-[#1e8e3e]" : "text-[#70757a]"}`} />
            <span>Status: <strong className="text-[#202124]">{attendee.status}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#3c4043] hover:bg-[#f1f3f4] rounded-lg border border-[#dadce0] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#1a73e8] hover:bg-[#174ea6] rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print Pass
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
