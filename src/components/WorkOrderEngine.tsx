import React, { useState } from "react";
import { WorkOrder, WorkOrderStatus, WorkOrderCategory } from "../types";
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Play, 
  Plus, 
  Briefcase, 
  Layers, 
  User, 
  Calendar,
  CheckCircle,
  FileText
} from "lucide-react";

interface WorkOrderEngineProps {
  workOrders: WorkOrder[];
  onUpdateWorkOrderStatus: (id: string, status: WorkOrderStatus) => void;
  onAddWorkOrder: (newWo: Omit<WorkOrder, "id" | "updatedAt">) => void;
}

export default function WorkOrderEngine({
  workOrders,
  onUpdateWorkOrderStatus,
  onAddWorkOrder,
}: WorkOrderEngineProps) {
  const [filterCategory, setFilterCategory] = useState<WorkOrderCategory | "All">("All");
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<WorkOrderCategory>("AV");
  const [assignee, setAssignee] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !assignee || !description) return;
    onAddWorkOrder({
      title,
      category,
      assignee,
      description,
      status: "Pending",
    });
    // Reset
    setTitle("");
    setAssignee("");
    setDescription("");
    setShowAddForm(false);
  };

  const categories: (WorkOrderCategory | "All")[] = ["All", "AV", "Facilities", "Seating", "General"];
  const statuses: WorkOrderStatus[] = ["Pending", "In Progress", "Blocked", "Verified"];

  const filteredOrders = workOrders.filter(
    (wo) => filterCategory === "All" || wo.category === filterCategory
  );

  const getStatusIcon = (status: WorkOrderStatus) => {
    switch (status) {
      case "Pending":
        return <Clock className="w-4 h-4 text-gray-500" />;
      case "In Progress":
        return <Play className="w-4 h-4 text-blue-500 animate-pulse" />;
      case "Blocked":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "Verified":
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    }
  };

  const getStatusClass = (status: WorkOrderStatus) => {
    switch (status) {
      case "Pending":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "In Progress":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Blocked":
        return "bg-red-50 text-red-700 border-red-200";
      case "Verified":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
  };

  const getCategoryBadge = (category: WorkOrderCategory) => {
    switch (category) {
      case "AV":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Facilities":
        return "bg-cyan-100 text-cyan-700 border-cyan-200";
      case "Seating":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "General":
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full" id="work-order-engine-section">
      <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-slate-50/20">
        <div>
          <h2 className="text-xl font-display font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            Work Order State Machine
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Real-time logistical lifecycle of venue operations. Critical tasks must be Verified before event Launch.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  filterCategory === cat
                    ? "bg-white text-indigo-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                id={`filter-cat-${cat.toLowerCase()}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
            id="btn-add-work-order"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Work Order
          </button>
        </div>
      </div>

      {/* Slide-out Form Panel */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="p-6 bg-indigo-50/50 border-b border-indigo-100 transition-all">
          <h3 className="text-sm font-semibold text-indigo-900 mb-4 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            Dispatch New Work Order Request
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Task / Deliverable Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Verify 3-phase high power feed on central stage"
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Functional Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as WorkOrderCategory)}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="AV">AV & Tech Services</option>
                <option value="Facilities">Facilities & Cleanliness</option>
                <option value="Seating">Seating Dynamics</option>
                <option value="General">General Logistics</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Operations Lead / Assignee *</label>
              <input
                type="text"
                required
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                placeholder="e.g., Dave (Pantry Services)"
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Detailed Technical Specifications *</label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide precise location, numerical goals, and verification steps."
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-md text-xs font-semibold shadow-xs"
            >
              Dispatch Task
            </button>
          </div>
        </form>
      )}

      {/* Grid columns */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50/30">
        {statuses.map((status) => {
          const statusOrders = filteredOrders.filter((wo) => wo.status === status);
          return (
            <div key={status} className="flex flex-col min-h-[350px]">
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 px-2">
                <span className="text-xs font-bold text-slate-600 tracking-wider uppercase flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${
                    status === "Pending" ? "bg-slate-400" :
                    status === "In Progress" ? "bg-indigo-500" :
                    status === "Blocked" ? "bg-rose-500" : "bg-emerald-500"
                  }`} />
                  {status}
                </span>
                <span className="text-xs font-mono bg-white text-slate-500 px-2 py-0.5 rounded-full border border-slate-200 shadow-3xs">
                  {statusOrders.length}
                </span>
              </div>

              {/* Column Cards */}
              <div className="flex-1 bg-slate-100 p-2.5 rounded-2xl border border-dashed border-slate-200 space-y-3">
                {statusOrders.length === 0 ? (
                  <div className="h-full flex items-center justify-center py-12 text-center">
                    <p className="text-[11px] text-slate-400 font-bold">No tasks in this state</p>
                  </div>
                ) : (
                  statusOrders.map((wo) => (
                    <div
                      key={wo.id}
                      className="bg-white p-3.5 rounded-xl shadow-xs border border-slate-200 flex flex-col gap-2.5 hover:border-indigo-400 transition-all group hover:shadow-2xs"
                      id={`wo-card-${wo.id}`}
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getCategoryBadge(wo.category)}`}>
                          {wo.category}
                        </span>
                        <span className="text-[9px] font-mono font-semibold text-slate-400">
                          #{wo.id}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-800 leading-snug">
                        {wo.title}
                      </h4>

                      <p className="text-[11px] text-slate-500 leading-normal line-clamp-2 font-medium">
                        {wo.description}
                      </p>

                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                        <span className="text-[10px] text-gray-600 flex items-center gap-1">
                          <User className="w-3 h-3 text-gray-400" />
                          <span className="truncate max-w-[80px] font-medium">{wo.assignee.split(" ")[0]}</span>
                        </span>

                        {/* Interactive state change controls */}
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          {status !== "Pending" && (
                            <button
                              onClick={() => {
                                const idx = statuses.indexOf(status);
                                if (idx > 0) onUpdateWorkOrderStatus(wo.id, statuses[idx - 1]);
                              }}
                              className="text-[9px] text-gray-500 hover:bg-gray-100 px-1 py-0.5 rounded border border-gray-200 font-mono"
                              title="Move back"
                            >
                              &larr;
                            </button>
                          )}
                          {status !== "Verified" && (
                            <button
                              onClick={() => {
                                const idx = statuses.indexOf(status);
                                if (idx < statuses.length - 1) onUpdateWorkOrderStatus(wo.id, statuses[idx + 1]);
                              }}
                              className="text-[9px] bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-1.5 py-0.5 rounded border border-indigo-200 font-semibold"
                              title="Advance state"
                            >
                              Move &rarr;
                            </button>
                          )}
                          {status !== "Blocked" && status !== "Verified" && (
                            <button
                              onClick={() => onUpdateWorkOrderStatus(wo.id, "Blocked")}
                              className="text-[9px] bg-red-50 text-red-600 hover:bg-red-100 px-1 py-0.5 rounded border border-red-200 font-semibold"
                              title="Mark Blocked"
                            >
                              Block
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
