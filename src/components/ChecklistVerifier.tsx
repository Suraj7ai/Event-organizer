import React, { useState } from "react";
import { VerificationChecklists, UserRole, EventStatus } from "../types";
import { 
  Wifi, 
  Tv, 
  Trash2, 
  Upload, 
  Sparkles, 
  Cpu, 
  Coffee, 
  CheckSquare, 
  Layers, 
  Edit3, 
  CheckCircle, 
  ShieldAlert,
  User,
  Clock,
  Zap,
  Info
} from "lucide-react";

interface ChecklistVerifierProps {
  checklists: VerificationChecklists;
  currentUserRole: UserRole;
  eventStatus: EventStatus;
  onUpdateChecklists: (updater: (prev: VerificationChecklists) => VerificationChecklists) => void;
  onUpdateEventStatus: (status: EventStatus) => void;
}

export default function ChecklistVerifier({
  checklists,
  currentUserRole,
  eventStatus,
  onUpdateChecklists,
  onUpdateEventStatus,
}: ChecklistVerifierProps) {
  // Speed test simulation state
  const [isTestingSpeed, setIsTestingSpeed] = useState(false);
  const [speedVal, setSpeedVal] = useState(checklists.av.wifiSpeedMbps || 0);

  // Simulated photo lists
  const mockPhotos = {
    av: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=80",
    facilities: "https://images.unsplash.com/photo-1585241936222-9642f4b47f0f?auto=format&fit=crop&w=300&q=80",
    seating: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=300&q=80",
  };

  // Sign-off input
  const [signerName, setSignerName] = useState(checklists.signOff.signedBy || "");

  const handleRunSpeedTest = () => {
    setIsTestingSpeed(true);
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 45) + 15;
      if (current >= 312) {
        current = 312 + Math.floor(Math.random() * 10);
        clearInterval(interval);
        setIsTestingSpeed(false);
        setSpeedVal(current);
        onUpdateChecklists((prev) => ({
          ...prev,
          av: { ...prev.av, wifiSpeedMbps: current, wifiVerified: true }
        }));
      } else {
        setSpeedVal(current);
      }
    }, 100);
  };

  const handleSimulatePhoto = (module: "av" | "facilities" | "seating") => {
    onUpdateChecklists((prev) => ({
      ...prev,
      [module]: { ...prev[module], photoUrl: mockPhotos[module] }
    }));
  };

  const handleRemovePhoto = (module: "av" | "facilities" | "seating") => {
    onUpdateChecklists((prev) => ({
      ...prev,
      [module]: { ...prev[module], photoUrl: null }
    }));
  };

  const handleToggleAvPower = () => {
    onUpdateChecklists((prev) => ({
      ...prev,
      av: { ...prev.av, powerCheck: !prev.av.powerCheck }
    }));
  };

  const handleToggleAvProjector = () => {
    onUpdateChecklists((prev) => ({
      ...prev,
      av: { ...prev.av, projectorMicTest: !prev.av.projectorMicTest }
    }));
  };

  const handleToggleFacWashroom = () => {
    onUpdateChecklists((prev) => ({
      ...prev,
      facilities: { ...prev.facilities, washroomClean: !prev.facilities.washroomClean }
    }));
  };

  const handlePantryLevelChange = (val: number) => {
    onUpdateChecklists((prev) => ({
      ...prev,
      facilities: { ...prev.facilities, pantryStockLevel: val }
    }));
  };

  const handleVerifyPantry = () => {
    onUpdateChecklists((prev) => ({
      ...prev,
      facilities: { ...prev.facilities, pantryVerified: !prev.facilities.pantryVerified }
    }));
  };

  const handleSeatingChairsChange = (val: number) => {
    onUpdateChecklists((prev) => ({
      ...prev,
      seating: { ...prev.seating, chairsDeployed: val }
    }));
  };

  const handleVerifySeating = () => {
    if (checklists.seating.chairsDeployed < checklists.seating.rsvpCount) return;
    onUpdateChecklists((prev) => ({
      ...prev,
      seating: { ...prev.seating, seatingVerified: !prev.seating.seatingVerified }
    }));
  };

  const handleSignOffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signerName || currentUserRole !== "Venue Admin") return;
    
    onUpdateChecklists((prev) => ({
      ...prev,
      signOff: {
        venueAdminSigned: true,
        signedBy: signerName,
        signedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " " + new Date().toLocaleDateString()
      }
    }));
  };

  // Check overall compliance
  const isAvVerified = checklists.av.powerCheck && checklists.av.wifiVerified && checklists.av.projectorMicTest && checklists.av.photoUrl !== null;
  const isFacilitiesVerified = checklists.facilities.washroomClean && checklists.facilities.pantryVerified && checklists.facilities.photoUrl !== null;
  const isSeatingVerified = checklists.seating.seatingVerified && checklists.seating.photoUrl !== null && checklists.seating.chairsDeployed >= checklists.seating.rsvpCount;
  
  const allModulesVerified = isAvVerified && isFacilitiesVerified && isSeatingVerified;
  const readyForLive = allModulesVerified && checklists.signOff.venueAdminSigned;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full" id="checklist-verifier-section">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-display font-bold tracking-tight text-slate-800 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-indigo-600" />
              Pre-Event Checklist & Digital Sign-off
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Photographic and numerical operations gatekeeping. Requires absolute physical confirmation.
            </p>
          </div>
          {/* Compliance Banner */}
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${
              readyForLive 
                ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}>
              {readyForLive ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  All Checks Passed & Signed Off
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 text-amber-500 animate-pulse" />
                  Checks Pending or Signature Required
                </>
              )}
            </div>

            {eventStatus !== "Live" && (
              <button
                disabled={!readyForLive}
                onClick={() => onUpdateEventStatus("Live")}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-colors ${
                  readyForLive 
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer" 
                    : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                }`}
                id="btn-launch-event"
              >
                Go LIVE
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module 1: AV & Tech */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between gap-4 shadow-2xs">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Cpu className="w-4.5 h-4.5 text-purple-600" />
                1. AV & Tech Verification
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isAvVerified ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-slate-200 text-slate-500 border-slate-300"
              }`}>
                {isAvVerified ? "Verified" : "Incomplete"}
              </span>
            </div>

            <div className="space-y-3.5 mt-4">
              {/* Power check */}
              <label className="flex items-start gap-2.5 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={checklists.av.powerCheck}
                  onChange={handleToggleAvPower}
                  className="mt-0.5 rounded-sm border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="font-semibold text-gray-700">Stage Power Feed Check</span>
                  <p className="text-[10px] text-gray-400 leading-normal mt-0.5">Stage power adapters delivering stable power levels.</p>
                </div>
              </label>

              {/* Wi-Fi test */}
              <div className="bg-white p-3 rounded-lg border border-gray-150 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-gray-700 flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5 text-indigo-500" />
                    Guest Bandwidth Test
                  </span>
                  <span className="text-xs font-mono font-bold text-indigo-600">
                    {speedVal > 0 ? `${speedVal} Mbps` : "--"}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400">Target: &gt;250 Mbps down/up for heavy attendee loading.</p>
                <button
                  type="button"
                  onClick={handleRunSpeedTest}
                  disabled={isTestingSpeed}
                  className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 disabled:bg-gray-100 disabled:text-gray-400 py-1 rounded-md text-[10px] font-bold border border-indigo-150 transition-colors"
                >
                  {isTestingSpeed ? "Testing Bandwidth..." : speedVal > 0 ? "Re-Run Speed Test" : "Run Speed Test"}
                </button>
              </div>

              {/* Projector/Mic check */}
              <label className="flex items-start gap-2.5 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={checklists.av.projectorMicTest}
                  onChange={handleToggleAvProjector}
                  className="mt-0.5 rounded-sm border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="font-semibold text-gray-700">Projector & Lapel Mic test</span>
                  <p className="text-[10px] text-gray-400 leading-normal mt-0.5">Projector feed crisp, lapel microphone clean without gain squeals.</p>
                </div>
              </label>
            </div>
          </div>

          {/* Photo Verification */}
          <div className="pt-3 border-t border-gray-200">
            <span className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-2">Photo Verification *</span>
            {checklists.av.photoUrl ? (
              <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-white">
                <img src={checklists.av.photoUrl} alt="AV Verification" className="w-full h-24 object-cover" />
                <button
                  onClick={() => handleRemovePhoto("av")}
                  className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 shadow-sm"
                  title="Remove photo"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleSimulatePhoto("av")}
                className="w-full h-20 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 flex flex-col items-center justify-center gap-1 text-gray-500 hover:text-indigo-600 transition-all bg-white"
              >
                <Upload className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
                <span className="text-[10px] font-semibold">Simulate Photo Upload</span>
              </button>
            )}
          </div>
        </div>

        {/* Module 2: Facilities */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between gap-4 shadow-2xs">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Coffee className="w-4.5 h-4.5 text-cyan-600" />
                2. Facilities & Food
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isFacilitiesVerified ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-slate-200 text-slate-500 border-slate-300"
              }`}>
                {isFacilitiesVerified ? "Verified" : "Incomplete"}
              </span>
            </div>

            <div className="space-y-3.5 mt-4">
              {/* Washrooms clean */}
              <label className="flex items-start gap-2.5 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={checklists.facilities.washroomClean}
                  onChange={handleToggleFacWashroom}
                  className="mt-0.5 rounded-sm border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="font-semibold text-gray-700">Washrooms Cleanliness Sign-off</span>
                  <p className="text-[10px] text-gray-400 leading-normal mt-0.5">Polished floor, sanitizers fully filled, continuous exhaust fan running.</p>
                </div>
              </label>

              {/* Pantry Stock */}
              <div className="bg-white p-3 rounded-xl border border-slate-150 flex flex-col gap-2 shadow-2xs">
                <div className="flex items-center justify-between text-[11px] font-semibold text-gray-700">
                  <span>Catering & Hydration Level</span>
                  <span className="font-mono text-cyan-600">{checklists.facilities.pantryStockLevel}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={checklists.facilities.pantryStockLevel}
                  onChange={(e) => handlePantryLevelChange(parseInt(e.target.value))}
                  className="w-full accent-cyan-600 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex items-center justify-between text-[9px] text-gray-400">
                  <span>Empty Fridge</span>
                  <span>Target: &gt;80% Stacked</span>
                </div>

                <button
                  type="button"
                  onClick={handleVerifyPantry}
                  className={`w-full py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                    checklists.facilities.pantryVerified 
                      ? "bg-cyan-100 border-cyan-300 text-cyan-800" 
                      : "bg-cyan-50 border-cyan-150 text-cyan-700 hover:bg-cyan-100"
                  }`}
                >
                  {checklists.facilities.pantryVerified ? "✓ Level Verified" : "Verify Inventory Levels"}
                </button>
              </div>
            </div>
          </div>

          {/* Photo Verification */}
          <div className="pt-3 border-t border-slate-200">
            <span className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-2">Photo Verification *</span>
            {checklists.facilities.photoUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-white">
                <img src={checklists.facilities.photoUrl} alt="Facilities Verification" className="w-full h-24 object-cover" />
                <button
                  onClick={() => handleRemovePhoto("facilities")}
                  className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 shadow-sm"
                  title="Remove photo"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleSimulatePhoto("facilities")}
                className="w-full h-20 border-2 border-dashed border-slate-200 rounded-xl hover:border-indigo-400 flex flex-col items-center justify-center gap-1 text-gray-500 hover:text-indigo-600 transition-all bg-white"
              >
                <Upload className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
                <span className="text-[10px] font-semibold">Simulate Photo Upload</span>
              </button>
            )}
          </div>
        </div>

        {/* Module 3: Seating Dynamics */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between gap-4 shadow-2xs">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Zap className="w-4.5 h-4.5 text-amber-600" />
                3. Seating Dynamics
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isSeatingVerified ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-slate-200 text-slate-500 border-slate-300"
              }`}>
                {isSeatingVerified ? "Verified" : "Incomplete"}
              </span>
            </div>

            <div className="space-y-3.5 mt-4">
              {/* Numerical Verification */}
              <div className="bg-white p-3 rounded-xl border border-slate-150 flex flex-col gap-2 shadow-2xs">
                <span className="text-[11px] font-semibold text-gray-700 block">Deploy vs RSVP Calculator</span>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 block uppercase">RSVP Count</span>
                    <span className="text-sm font-mono font-semibold text-gray-700">120 Attendees</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 block uppercase">Chairs Deployed *</span>
                    <input
                      type="number"
                      value={checklists.seating.chairsDeployed || ""}
                      onChange={(e) => handleSeatingChairsChange(parseInt(e.target.value) || 0)}
                      className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs font-mono font-semibold focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                      placeholder="e.g. 120"
                    />
                  </div>
                </div>

                <div className="mt-1">
                  {checklists.seating.chairsDeployed >= checklists.seating.rsvpCount ? (
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      ✓ Seat capacity check passed.
                    </span>
                  ) : (
                    <span className="text-[10px] text-red-500 font-semibold flex items-center gap-1">
                      ⚠ Need {checklists.seating.rsvpCount - checklists.seating.chairsDeployed} more chairs to clear.
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  disabled={checklists.seating.chairsDeployed < checklists.seating.rsvpCount}
                  onClick={handleVerifySeating}
                  className={`w-full py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                    checklists.seating.seatingVerified 
                      ? "bg-amber-100 border-amber-300 text-amber-800" 
                      : checklists.seating.chairsDeployed >= checklists.seating.rsvpCount
                      ? "bg-amber-50 border-amber-150 text-amber-700 hover:bg-amber-100 cursor-pointer"
                      : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                  }`}
                >
                  {checklists.seating.seatingVerified ? "✓ Capacity Checked" : "Verify Layout Alignment"}
                </button>
              </div>
            </div>
          </div>

          {/* Photo Verification */}
          <div className="pt-3 border-t border-slate-200">
            <span className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-2">Blueprint Photo *</span>
            {checklists.seating.photoUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-white">
                <img src={checklists.seating.photoUrl} alt="Seating Verification" className="w-full h-24 object-cover" />
                <button
                  onClick={() => handleRemovePhoto("seating")}
                  className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 shadow-sm"
                  title="Remove photo"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleSimulatePhoto("seating")}
                className="w-full h-20 border-2 border-dashed border-slate-200 rounded-xl hover:border-indigo-400 flex flex-col items-center justify-center gap-1 text-gray-500 hover:text-indigo-600 transition-all bg-white"
              >
                <Upload className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
                <span className="text-[10px] font-semibold">Simulate Layout Photo</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Signature Module Block */}
      <div className="p-6 bg-indigo-50/40 border-t border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-1">
            <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-indigo-600" />
              Digital Sign-off Panel
            </h4>
            <p className="text-xs text-indigo-950 mt-1.5 leading-relaxed">
              Google Venue Admin must review the operations above and digitally sign off to unlock the Live event controls.
            </p>
          </div>

          <div className="md:col-span-2">
            {checklists.signOff.venueAdminSigned ? (
              <div className="bg-white p-4 rounded-2xl border border-emerald-100 flex items-center gap-3.5 shadow-2xs">
                <div className="bg-emerald-50 text-emerald-600 p-2 rounded-full">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold tracking-widest text-emerald-800">Digitally Cryptographic Signed</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-slate-800 font-display">
                      Verified by Admin: {checklists.signOff.signedBy}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {checklists.signOff.signedAt}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSignOffSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    required
                    disabled={currentUserRole !== "Venue Admin"}
                    value={signerName}
                    onChange={(e) => setSignerName(e.target.value)}
                    placeholder={currentUserRole === "Venue Admin" ? "Type your name to digitally sign" : "Authentication Required (Switch to Venue Admin)"}
                    className="w-full bg-white disabled:bg-gray-100 disabled:text-gray-400 border border-gray-200 rounded-lg px-3.5 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-semibold text-gray-800 shadow-2xs"
                  />
                  {currentUserRole !== "Venue Admin" && (
                    <span className="text-[10px] text-red-500 font-semibold mt-1.5 block flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" />
                      Requires &apos;Venue Admin&apos; permissions. Switch roles in the upper simulator control panel.
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={currentUserRole !== "Venue Admin" || !signerName || !allModulesVerified}
                  className={`px-5 py-2.5 rounded-lg text-xs font-bold shadow-xs whitespace-nowrap transition-colors flex items-center justify-center gap-1.5 ${
                    currentUserRole === "Venue Admin" && allModulesVerified && signerName
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                      : "bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed"
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Authenticate & Sign-off
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
