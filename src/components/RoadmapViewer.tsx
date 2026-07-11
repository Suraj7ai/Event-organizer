import React, { useState } from "react";
import { MVP_ROADMAP } from "../data";
import { 
  Milestone, 
  CheckCircle, 
  Activity, 
  MapPin, 
  Compass, 
  TrendingUp, 
  Info,
  Calendar,
  CheckCircle2,
  ListTodo
} from "lucide-react";

export default function RoadmapViewer() {
  const [tasks, setTasks] = useState(
    MVP_ROADMAP.flatMap(phase => 
      phase.items.map(it => ({ ...it, phaseName: phase.phase }))
    )
  );

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const phases = Array.from(new Set(tasks.map(t => t.phaseName)));

  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden" id="roadmap-viewer-section">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gray-50/50">
        <div>
          <h2 className="text-xl font-display font-semibold text-gray-900 flex items-center gap-2">
            <Milestone className="w-5 h-5 text-indigo-600" />
            MVP Launch Roadmap & Progress Index
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            An interactive implementation path from architectural anchors to cross-organizational launch.
          </p>
        </div>

        {/* Readiness progress radial/pill */}
        <div className="bg-indigo-50 border border-indigo-150 rounded-xl px-4 py-2 text-right">
          <span className="text-[10px] uppercase font-bold text-indigo-700 tracking-wider">MVP Readiness Index</span>
          <div className="flex items-center gap-2 mt-1 justify-end">
            <span className="text-lg font-mono font-bold text-indigo-900">{progressPercent}%</span>
            <span className="text-xs text-gray-400">({completedTasks}/{totalTasks} steps completed)</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Progress Bar */}
        <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-700 mb-2">
            <span>Overall MVP Delivery Timeline</span>
            <span className="text-indigo-600 font-mono">{progressPercent === 100 ? "Ready for Production Launch! 🚀" : "Execution Phase In-Progress"}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Chronological phases list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {phases.map((phaseName, phaseIdx) => {
            const phaseTasks = tasks.filter(t => t.phaseName === phaseName);
            const isPhaseDone = phaseTasks.every(t => t.completed);

            return (
              <div 
                key={phaseName}
                className={`p-5 rounded-xl border transition-all ${
                  isPhaseDone 
                    ? "bg-emerald-50/20 border-emerald-100" 
                    : "bg-slate-50/50 border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between mb-4 border-b border-gray-150 pb-2">
                  <span className="text-xs font-bold text-gray-700 font-display flex items-center gap-1.5">
                    <Compass className={`w-4.5 h-4.5 ${isPhaseDone ? "text-emerald-500" : "text-indigo-500"}`} />
                    {phaseName}
                  </span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                    isPhaseDone ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-gray-100 text-gray-500 border-gray-200"
                  }`}>
                    {isPhaseDone ? "Complete" : "Active Development"}
                  </span>
                </div>

                <div className="space-y-3">
                  {phaseTasks.map((t) => (
                    <div 
                      key={t.id} 
                      onClick={() => handleToggleTask(t.id)}
                      className={`p-3 rounded-lg border text-left cursor-pointer transition-all flex items-start gap-2.5 bg-white shadow-2xs hover:border-indigo-300 ${
                        t.completed ? "border-emerald-100 bg-emerald-50/10 opacity-80" : "border-gray-150"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={t.completed}
                        onChange={() => {}} // toggled on container click
                        className="mt-0.5 rounded-sm border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <div className="space-y-0.5">
                        <span className={`text-xs font-medium block leading-normal ${t.completed ? "line-through text-gray-400" : "text-gray-800"}`}>
                          {t.title}
                        </span>
                        <span className="text-[9px] font-mono text-gray-400">Task #{t.id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Integration Instructions */}
        <div className="mt-6 bg-indigo-50/40 p-4 rounded-xl border border-indigo-150 flex items-start gap-3">
          <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-xs font-bold text-indigo-950 block">🚀 PM Guide: Integrating Real-Time WebSockets</span>
            <p className="text-[11px] text-indigo-900 leading-relaxed">
              To wire the visual components above into a production backend, establish a Node.js Socket.io server. Subscribe clients to room <code>event_evt-101</code>. When checklist parameters are saved, broadcast <code>checklist_update</code> to re-render client dashboards instantly without polling latency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
