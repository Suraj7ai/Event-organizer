import React, { useState } from "react";
import { RoomStatus, UserRole } from "../types";
import { 
  Building, 
  Tv, 
  Mic, 
  Thermometer, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Wrench, 
  Plus, 
  Minus,
  Sparkles,
  Maximize2
} from "lucide-react";

interface RoomReadinessMatrixProps {
  rooms: RoomStatus[];
  currentUserRole: UserRole;
  onUpdateRoom: (id: string, updater: (prev: RoomStatus) => RoomStatus) => void;
}

export default function RoomReadinessMatrix({
  rooms,
  currentUserRole,
  onUpdateRoom,
}: RoomReadinessMatrixProps) {
  const [selectedRoomId, setSelectedRoomId] = useState<string>(rooms[0]?.id || "");
  const [filterFloor, setFilterFloor] = useState<string>("All");

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0];

  const totalCapacity = rooms.reduce((acc, r) => acc + r.capacity, 0);
  const totalOccupancy = rooms.reduce((acc, r) => acc + r.currentOccupancy, 0);
  const readyRoomsCount = rooms.filter((r) => r.avStatus === "Ready" && r.micChecked && r.projectorChecked).length;
  const venueReadinessPercent = Math.round((readyRoomsCount / rooms.length) * 100);

  const canEdit = currentUserRole === "Super Admin" || currentUserRole === "Venue Admin";

  const handleAdjustOccupancy = (id: string, delta: number) => {
    onUpdateRoom(id, (prev) => ({
      ...prev,
      currentOccupancy: Math.max(0, Math.min(prev.capacity, prev.currentOccupancy + delta)),
    }));
  };

  const handleToggleMic = (id: string) => {
    if (!canEdit) return;
    onUpdateRoom(id, (prev) => ({ ...prev, micChecked: !prev.micChecked }));
  };

  const handleToggleProjector = (id: string) => {
    if (!canEdit) return;
    onUpdateRoom(id, (prev) => ({ ...prev, projectorChecked: !prev.projectorChecked }));
  };

  const handleUpdateAvStatus = (id: string, avStatus: "Ready" | "Degraded" | "Offline") => {
    if (!canEdit) return;
    onUpdateRoom(id, (prev) => ({ ...prev, avStatus }));
  };

  const handleAdjustTemp = (id: string, delta: number) => {
    if (!canEdit) return;
    onUpdateRoom(id, (prev) => ({ ...prev, temperatureC: Number((prev.temperatureC + delta).toFixed(1)) }));
  };

  return (
    <div className="space-y-5">
      {/* Overview Stat Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-xl border border-[#dadce0] p-4 shadow-2xs">
          <div className="flex items-center justify-between text-[#5f6368] text-xs">
            <span>Venue AV Readiness</span>
            <CheckCircle2 className="w-4 h-4 text-[#1e8e3e]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#202124]">{venueReadinessPercent}%</span>
            <span className="text-xs text-[#5f6368] font-mono">({readyRoomsCount}/{rooms.length} zones verified)</span>
          </div>
          <div className="w-full bg-[#f1f3f4] h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div 
              className="bg-[#1e8e3e] h-full rounded-full transition-all duration-300"
              style={{ width: `${venueReadinessPercent}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#dadce0] p-4 shadow-2xs">
          <div className="flex items-center justify-between text-[#5f6368] text-xs">
            <span>Live Floor Headcount</span>
            <Users className="w-4 h-4 text-[#1a73e8]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#202124]">{totalOccupancy}</span>
            <span className="text-xs text-[#5f6368] font-mono">/ {totalCapacity} max capacity</span>
          </div>
          <div className="w-full bg-[#f1f3f4] h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div 
              className="bg-[#1a73e8] h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (totalOccupancy / totalCapacity) * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#dadce0] p-4 shadow-2xs">
          <div className="flex items-center justify-between text-[#5f6368] text-xs">
            <span>Average Ambient Temp</span>
            <Thermometer className="w-4 h-4 text-[#ea8600]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#202124]">
              {(rooms.reduce((acc, r) => acc + r.temperatureC, 0) / rooms.length).toFixed(1)}°C
            </span>
            <span className="text-xs text-[#137333] font-mono font-medium">Optimal HVAC</span>
          </div>
          <p className="text-[11px] text-[#70757a] mt-2 font-mono">Set point range: 20.0°C - 23.0°C</p>
        </div>

        <div className="bg-white rounded-xl border border-[#dadce0] p-4 shadow-2xs">
          <div className="flex items-center justify-between text-[#5f6368] text-xs">
            <span>Assigned AV Leads</span>
            <Wrench className="w-4 h-4 text-[#5f6368]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#202124]">5 Technicians</span>
          </div>
          <p className="text-[11px] text-[#70757a] mt-2">Stationed across all Level 30 wings</p>
        </div>
      </div>

      {/* Interactive 2D Venue Layout Schematics */}
      <div className="bg-white rounded-2xl border border-[#dadce0] p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#1a73e8]" />
            <div>
              <h3 className="text-sm font-semibold text-[#202124]">Level 30 Interactive Floor Blueprint</h3>
              <p className="text-xs text-[#5f6368]">Click any room zone below to inspect AV matrix telemetry</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 font-mono text-[#1e8e3e]">
              <span className="w-2 h-2 rounded-full bg-[#1e8e3e]" /> Ready
            </span>
            <span className="flex items-center gap-1 font-mono text-[#ea8600]">
              <span className="w-2 h-2 rounded-full bg-[#ea8600]" /> Degraded
            </span>
            <span className="flex items-center gap-1 font-mono text-[#d93025]">
              <span className="w-2 h-2 rounded-full bg-[#d93025]" /> Offline
            </span>
          </div>
        </div>

        {/* Floor Schematic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-[#f8f9fa] rounded-xl border border-[#e8eaed]">
          {/* Main Stage (Auditorium Alpha) */}
          <div
            onClick={() => setSelectedRoomId("room-1")}
            className={`md:col-span-7 p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
              selectedRoomId === "room-1"
                ? "bg-white border-[#1a73e8] shadow-md ring-2 ring-[#1a73e8]/20"
                : "bg-white hover:border-[#aecbfa] border-[#dadce0]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#70757a] tracking-wider">ZONE A · MAIN AUDITORIUM</span>
                <h4 className="text-sm font-bold text-[#202124]">Auditorium Alpha (Stage Hall)</h4>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#e6f4ea] text-[#137333] border border-[#ceead6]">
                4K LED Wall Active
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-[#5f6368] font-mono">
              <span>{rooms.find((r) => r.id === "room-1")?.currentOccupancy} / 150 Seats</span>
              <span>{rooms.find((r) => r.id === "room-1")?.temperatureC}°C</span>
              <span className="text-[#1e8e3e] font-semibold">Stage Ready</span>
            </div>
          </div>

          {/* Workshop Beta */}
          <div
            onClick={() => setSelectedRoomId("room-2")}
            className={`md:col-span-5 p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
              selectedRoomId === "room-2"
                ? "bg-white border-[#1a73e8] shadow-md ring-2 ring-[#1a73e8]/20"
                : "bg-white hover:border-[#aecbfa] border-[#dadce0]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#70757a] tracking-wider">ZONE B · WEST WING</span>
                <h4 className="text-sm font-bold text-[#202124]">Workshop Hall Beta</h4>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#e8f0fe] text-[#1a73e8] border border-[#d2e3fc]">
                Dual Sony Beamers
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-[#5f6368] font-mono">
              <span>{rooms.find((r) => r.id === "room-2")?.currentOccupancy} / 60 Seats</span>
              <span>{rooms.find((r) => r.id === "room-2")?.temperatureC}°C</span>
              <span className="text-[#1e8e3e]">Online</span>
            </div>
          </div>

          {/* Catering & Atrium Lounge */}
          <div
            onClick={() => setSelectedRoomId("room-3")}
            className={`md:col-span-4 p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
              selectedRoomId === "room-3"
                ? "bg-white border-[#1a73e8] shadow-md ring-2 ring-[#1a73e8]/20"
                : "bg-white hover:border-[#aecbfa] border-[#dadce0]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#70757a] tracking-wider">ZONE C · NORTH TERRACE</span>
                <h4 className="text-sm font-bold text-[#202124]">Catering & Atrium</h4>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#fef7e0] text-[#b06000] border border-[#feefc3]">
                Pantry Bar
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-[#5f6368] font-mono">
              <span>{rooms.find((r) => r.id === "room-3")?.currentOccupancy} / 180 Capacity</span>
              <span>{rooms.find((r) => r.id === "room-3")?.temperatureC}°C</span>
            </div>
          </div>

          {/* Speaker Greenroom */}
          <div
            onClick={() => setSelectedRoomId("room-4")}
            className={`md:col-span-4 p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
              selectedRoomId === "room-4"
                ? "bg-white border-[#1a73e8] shadow-md ring-2 ring-[#1a73e8]/20"
                : "bg-white hover:border-[#aecbfa] border-[#dadce0]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#70757a] tracking-wider">ZONE D · EXECUTIVE</span>
                <h4 className="text-sm font-bold text-[#202124]">Speaker Greenroom</h4>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#e6f4ea] text-[#137333] border border-[#ceead6]">
                Secure AV
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-[#5f6368] font-mono">
              <span>{rooms.find((r) => r.id === "room-4")?.currentOccupancy} / 20 VIPs</span>
              <span>{rooms.find((r) => r.id === "room-4")?.temperatureC}°C</span>
            </div>
          </div>

          {/* Registration Foyer */}
          <div
            onClick={() => setSelectedRoomId("room-5")}
            className={`md:col-span-4 p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
              selectedRoomId === "room-5"
                ? "bg-white border-[#1a73e8] shadow-md ring-2 ring-[#1a73e8]/20"
                : "bg-white hover:border-[#aecbfa] border-[#dadce0]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#70757a] tracking-wider">ZONE E · LOBBY</span>
                <h4 className="text-sm font-bold text-[#202124]">Registration Foyer</h4>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#e8f0fe] text-[#1a73e8] border border-[#d2e3fc]">
                Front Kiosks
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-[#5f6368] font-mono">
              <span>{rooms.find((r) => r.id === "room-5")?.currentOccupancy} / 100 Flow</span>
              <span>{rooms.find((r) => r.id === "room-5")?.temperatureC}°C</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Room Telemetry & Controller Card */}
      {selectedRoom && (
        <div className="bg-white rounded-2xl border border-[#dadce0] p-6 shadow-2xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#dadce0]">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[#f1f3f4] text-[#3c4043]">
                  {selectedRoom.code}
                </span>
                <h3 className="text-base font-bold text-[#202124]">{selectedRoom.name}</h3>
                <span className="text-xs text-[#5f6368]">({selectedRoom.floor})</span>
              </div>
              <p className="text-xs text-[#5f6368] mt-1">{selectedRoom.notes}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#5f6368] font-medium">AV Link Status:</span>
              <select
                disabled={!canEdit}
                value={selectedRoom.avStatus}
                onChange={(e) => handleUpdateAvStatus(selectedRoom.id, e.target.value as "Ready" | "Degraded" | "Offline")}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg border focus:outline-none ${
                  selectedRoom.avStatus === "Ready"
                    ? "bg-[#e6f4ea] text-[#137333] border-[#ceead6]"
                    : selectedRoom.avStatus === "Degraded"
                    ? "bg-[#fef7e0] text-[#b06000] border-[#feefc3]"
                    : "bg-[#fce8e6] text-[#c5221f] border-[#fad2cf]"
                } ${canEdit ? "cursor-pointer" : "cursor-not-allowed opacity-80"}`}
              >
                <option value="Ready">Ready (Nominal)</option>
                <option value="Degraded">Degraded (Investigating)</option>
                <option value="Offline">Offline (Critical)</option>
              </select>
            </div>
          </div>

          {/* Room Controls & Indicators Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5 text-xs">
            {/* Occupancy Adjuster */}
            <div className="p-4 rounded-xl border border-[#e8eaed] bg-[#f8f9fa] space-y-2">
              <div className="flex items-center justify-between text-[#5f6368]">
                <span>Headcount Occupancy</span>
                <Users className="w-4 h-4 text-[#1a73e8]" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-bold font-mono text-[#202124]">
                  {selectedRoom.currentOccupancy} <span className="text-xs text-[#70757a]">/ {selectedRoom.capacity}</span>
                </span>
                <span className="font-mono text-[11px] text-[#5f6368]">
                  {Math.round((selectedRoom.currentOccupancy / selectedRoom.capacity) * 100)}%
                </span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleAdjustOccupancy(selectedRoom.id, -5)}
                  className="flex-1 py-1 rounded bg-white border border-[#dadce0] hover:bg-[#e8eaed] text-[#3c4043] font-mono flex items-center justify-center transition-colors cursor-pointer"
                  title="Minus 5"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleAdjustOccupancy(selectedRoom.id, 5)}
                  className="flex-1 py-1 rounded bg-white border border-[#dadce0] hover:bg-[#e8eaed] text-[#3c4043] font-mono flex items-center justify-center transition-colors cursor-pointer"
                  title="Plus 5"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Ambient Temperature */}
            <div className="p-4 rounded-xl border border-[#e8eaed] bg-[#f8f9fa] space-y-2">
              <div className="flex items-center justify-between text-[#5f6368]">
                <span>HVAC Temperature</span>
                <Thermometer className="w-4 h-4 text-[#ea8600]" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-bold font-mono text-[#202124]">
                  {selectedRoom.temperatureC}°C
                </span>
                <span className="text-[11px] font-mono text-[#137333]">Normal</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  disabled={!canEdit}
                  onClick={() => handleAdjustTemp(selectedRoom.id, -0.5)}
                  className="flex-1 py-1 rounded bg-white border border-[#dadce0] hover:bg-[#e8eaed] text-[#3c4043] font-mono text-[11px] transition-colors cursor-pointer disabled:opacity-50"
                >
                  -0.5°
                </button>
                <button
                  disabled={!canEdit}
                  onClick={() => handleAdjustTemp(selectedRoom.id, 0.5)}
                  className="flex-1 py-1 rounded bg-white border border-[#dadce0] hover:bg-[#e8eaed] text-[#3c4043] font-mono text-[11px] transition-colors cursor-pointer disabled:opacity-50"
                >
                  +0.5°
                </button>
              </div>
            </div>

            {/* Stage AV Verification Toggles */}
            <div className="p-4 rounded-xl border border-[#e8eaed] bg-[#f8f9fa] space-y-2">
              <div className="flex items-center justify-between text-[#5f6368]">
                <span>Stage Audio & Video Checks</span>
                <Tv className="w-4 h-4 text-[#1a73e8]" />
              </div>
              <div className="space-y-1.5 pt-1">
                <button
                  disabled={!canEdit}
                  onClick={() => handleToggleMic(selectedRoom.id)}
                  className={`w-full px-2.5 py-1.5 rounded-lg border text-left flex items-center justify-between transition-colors ${
                    selectedRoom.micChecked
                      ? "bg-[#e6f4ea] text-[#137333] border-[#ceead6]"
                      : "bg-white text-[#5f6368] border-[#dadce0]"
                  } ${canEdit ? "cursor-pointer" : "cursor-default"}`}
                >
                  <span className="flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5" />
                    <span>Microphones Tested</span>
                  </span>
                  {selectedRoom.micChecked ? <CheckCircle2 className="w-3.5 h-3.5 text-[#1e8e3e]" /> : <span className="text-[10px] text-[#70757a]">Pending</span>}
                </button>

                <button
                  disabled={!canEdit}
                  onClick={() => handleToggleProjector(selectedRoom.id)}
                  className={`w-full px-2.5 py-1.5 rounded-lg border text-left flex items-center justify-between transition-colors ${
                    selectedRoom.projectorChecked
                      ? "bg-[#e6f4ea] text-[#137333] border-[#ceead6]"
                      : "bg-white text-[#5f6368] border-[#dadce0]"
                  } ${canEdit ? "cursor-pointer" : "cursor-default"}`}
                >
                  <span className="flex items-center gap-1.5">
                    <Tv className="w-3.5 h-3.5" />
                    <span>Display / Projector Tested</span>
                  </span>
                  {selectedRoom.projectorChecked ? <CheckCircle2 className="w-3.5 h-3.5 text-[#1e8e3e]" /> : <span className="text-[10px] text-[#70757a]">Pending</span>}
                </button>
              </div>
            </div>

            {/* Technician & Hardware Specs */}
            <div className="p-4 rounded-xl border border-[#e8eaed] bg-[#f8f9fa] space-y-2">
              <div className="flex items-center justify-between text-[#5f6368]">
                <span>Lead AV Technician</span>
                <Wrench className="w-4 h-4 text-[#5f6368]" />
              </div>
              <p className="font-semibold text-sm text-[#202124]">{selectedRoom.leadTechnician}</p>
              <div className="pt-1 text-[11px] text-[#70757a] space-y-0.5">
                <p>Display: <strong className="text-[#3c4043]">{selectedRoom.screenResolution}</strong></p>
                <p>Radio Channel: <strong className="text-[#3c4043]">Ch 3 (Facilities)</strong></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
