import React, { useState } from "react";
import { DATABASE_SCHEMAS, TECH_STACK_RECOMMENDATION } from "../data";
import { 
  Network, 
  Database, 
  Cpu, 
  Terminal, 
  Copy, 
  Check, 
  Link, 
  ExternalLink,
  GitBranch,
  KeyRound,
  FileCode2,
  TableProperties,
  ChevronRight
} from "lucide-react";

export default function ArchitectureViewer() {
  const [activeTab, setActiveTab] = useState<"stack" | "schema" | "code">("stack");
  const [codeType, setCodeType] = useState<"sql" | "drizzle">("sql");
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const dbTables = [
    {
      name: "users",
      description: "Stores unified credential and access tiers for multi-organizational stakeholders.",
      columns: [
        { name: "id", type: "VARCHAR(255)", key: "PRIMARY KEY", desc: "Unique Firebase Auth / custom UID string" },
        { name: "name", type: "VARCHAR(255)", key: "NOT NULL", desc: "User's display identity name" },
        { name: "email", type: "VARCHAR(255)", key: "UNIQUE NOT NULL", desc: "Stakeholder's contact email" },
        { name: "role", type: "ENUM", key: "DEFAULT 'Volunteer'", desc: "Permissions gate: Super Admin, Venue Admin, Presenter, Volunteer" }
      ]
    },
    {
      name: "events",
      description: "Core anchor binded to date, timing bounds, venue, and designated managers.",
      columns: [
        { name: "id", type: "VARCHAR(255)", key: "PRIMARY KEY", desc: "Event unique identifier" },
        { name: "name", type: "VARCHAR(255)", key: "NOT NULL", desc: "Descriptive name of the operation" },
        { name: "date", type: "DATE", key: "NOT NULL", desc: "Scheduled execution date" },
        { name: "time_window", type: "VARCHAR(100)", key: "NOT NULL", desc: "e.g., '09:00 AM - 06:00 PM'" },
        { name: "organizer_id", type: "VARCHAR(255)", key: "FOREIGN KEY", desc: "References users.id (Super Admin lead)" },
        { name: "venue_name", type: "VARCHAR(255)", key: "NOT NULL", desc: "e.g. 'Google Singapore'" },
        { name: "venue_admin_id", type: "VARCHAR(255)", key: "FOREIGN KEY", desc: "References users.id (Venue Admin lead)" },
        { name: "status", type: "ENUM", key: "DEFAULT 'Draft'", desc: "Current phase: Draft, Sign-off, Live, Completed" }
      ]
    },
    {
      name: "work_orders",
      description: "State-machine tasks that track granular infrastructure setup status.",
      columns: [
        { name: "id", type: "VARCHAR(255)", key: "PRIMARY KEY", desc: "Task ticket identifier" },
        { name: "event_id", type: "VARCHAR(255)", key: "FOREIGN KEY ON CASCADE", desc: "Related event reference" },
        { name: "title", type: "VARCHAR(255)", key: "NOT NULL", desc: "Deliverable instruction summary" },
        { name: "category", type: "ENUM", key: "NOT NULL", desc: "AV, Facilities, Seating, General" },
        { name: "status", type: "ENUM", key: "DEFAULT 'Pending'", desc: "Pending, In Progress, Blocked, Verified" },
        { name: "assignee", type: "VARCHAR(255)", key: "NOT NULL", desc: "Name of person responsible" },
        { name: "description", type: "TEXT", key: "NOT NULL", desc: "Complete technical parameters" }
      ]
    },
    {
      name: "checklists",
      description: "Gatekeeping module containing strict numerical and photo verification payloads.",
      columns: [
        { name: "id", type: "VARCHAR(255)", key: "PRIMARY KEY", desc: "Checklist identifier" },
        { name: "event_id", type: "VARCHAR(255)", key: "FOREIGN KEY UNIQUE", desc: "Links 1-to-1 with parent event" },
        { name: "av_power_check", type: "BOOLEAN", key: "DEFAULT FALSE", desc: "AV Stage power verified" },
        { name: "av_wifi_speed", type: "INTEGER", key: "DEFAULT 0", desc: "Tested Wi-Fi download speed in Mbps" },
        { name: "av_wifi_verified", type: "BOOLEAN", key: "DEFAULT FALSE", desc: "IT admin bandwidth sign-off flag" },
        { name: "av_photo_url", type: "TEXT", key: "NULLABLE", desc: "Reference photo upload CDN link" },
        { name: "admin_signed", type: "BOOLEAN", key: "DEFAULT FALSE", desc: "Digital authorization signature status" }
      ]
    }
  ];

  const [selectedSchemaTable, setSelectedSchemaTable] = useState<string>("events");

  const currentTableData = dbTables.find(t => t.name === selectedSchemaTable);

  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden" id="architecture-viewer-section">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gray-50/50">
        <div>
          <h2 className="text-xl font-display font-semibold text-gray-900 flex items-center gap-2">
            <Network className="w-5 h-5 text-indigo-600" />
            System Architecture & Data Modeling
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Production-grade stack, schema visualizers, and ORM declarations crafted by elite systems engineering.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
          <button
            onClick={() => setActiveTab("stack")}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-all ${
              activeTab === "stack"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Tech Stack
          </button>
          <button
            onClick={() => setActiveTab("schema")}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-all ${
              activeTab === "schema"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Database Map
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-all ${
              activeTab === "code"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Schema DDL Code
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Tab 1: Tech Stack Recommendation */}
        {activeTab === "stack" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Frontend */}
            <div className="bg-slate-50 p-5 rounded-xl border border-gray-150 space-y-4">
              <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" />
                Frontend Core
              </span>
              <div className="space-y-3">
                {TECH_STACK_RECOMMENDATION.frontend.map((f, i) => (
                  <div key={i} className="bg-white p-3 rounded-lg border border-gray-200 shadow-2xs">
                    <h4 className="text-xs font-bold text-gray-800">{f.name}</h4>
                    <p className="text-[10px] text-gray-400 mt-1 leading-normal">{f.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Backend & Real-Time */}
            <div className="bg-slate-50 p-5 rounded-xl border border-gray-150 space-y-4">
              <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5" />
                Real-Time Backend
              </span>
              <div className="space-y-3">
                {TECH_STACK_RECOMMENDATION.backend.map((b, i) => (
                  <div key={i} className="bg-white p-3 rounded-lg border border-gray-200 shadow-2xs">
                    <h4 className="text-xs font-bold text-gray-800">{b.name}</h4>
                    <p className="text-[10px] text-gray-400 mt-1 leading-normal">{b.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Deployment & Infra */}
            <div className="bg-slate-50 p-5 rounded-xl border border-gray-150 space-y-4">
              <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider flex items-center gap-1">
                <Database className="w-3.5 h-3.5" />
                Durable Hosting & CDN
              </span>
              <div className="space-y-3">
                {TECH_STACK_RECOMMENDATION.hosting.map((h, i) => (
                  <div key={i} className="bg-white p-3 rounded-lg border border-gray-200 shadow-2xs">
                    <h4 className="text-xs font-bold text-gray-800">{h.name}</h4>
                    <p className="text-[10px] text-gray-400 mt-1 leading-normal">{h.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Database Schema Visual Schema map */}
        {activeTab === "schema" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Visual Tables List (4 Cols) */}
            <div className="lg:col-span-4 space-y-3">
              <span className="text-xs font-bold text-gray-500 block">Relational Entities</span>
              {dbTables.map((tbl) => (
                <button
                  key={tbl.name}
                  onClick={() => setSelectedSchemaTable(tbl.name)}
                  className={`w-full p-4 rounded-xl text-left border transition-all flex flex-col gap-1.5 ${
                    selectedSchemaTable === tbl.name
                      ? "bg-indigo-50 border-indigo-300 ring-1 ring-indigo-200"
                      : "bg-gray-50 border-gray-200 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-800 font-mono flex items-center gap-1.5">
                      <TableProperties className="w-4 h-4 text-indigo-500" />
                      {tbl.name}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-[10px] text-gray-400 leading-normal">{tbl.description}</p>
                </button>
              ))}
            </div>

            {/* Table inspector detail (8 Cols) */}
            <div className="lg:col-span-8 bg-gray-50 p-5 rounded-xl border border-gray-200">
              {currentTableData ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-1.5 font-mono">
                      <Database className="w-4 h-4 text-indigo-500" />
                      Table Inspector: {currentTableData.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-1 leading-normal">
                      {currentTableData.description}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-150">
                      <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-600">
                        <tr>
                          <th className="px-4 py-2.5 text-left">Column Name</th>
                          <th className="px-4 py-2.5 text-left">Data Type</th>
                          <th className="px-4 py-2.5 text-left">Constraints</th>
                          <th className="px-4 py-2.5 text-left">Functional Role</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-150 text-[11px] text-gray-700">
                        {currentTableData.columns.map((col, i) => (
                          <tr key={i} className="hover:bg-slate-50/50">
                            <td className="px-4 py-2.5 font-mono font-bold text-indigo-600">{col.name}</td>
                            <td className="px-4 py-2.5 font-mono text-gray-600">{col.type}</td>
                            <td className="px-4 py-2.5 font-medium">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                                col.key.includes("PRIMARY") ? "bg-red-100 text-red-800" :
                                col.key.includes("FOREIGN") ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-700"
                              }`}>
                                {col.key}
                              </span>
                            </td>
                            <td className="px-4 py-2.5 text-gray-400">{col.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Schema connections visual map */}
                  <div className="bg-white p-3 rounded-lg border border-gray-200 text-[10px] text-gray-400 flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>
                      {selectedSchemaTable === "events" && "🔗 Relational Mapping: events.organizer_id references users.id (Many-to-One), events.venue_admin_id references users.id."}
                      {selectedSchemaTable === "users" && "🔗 Relational Mapping: Central identity parent table. Linked to events, work_orders, and attendees."}
                      {selectedSchemaTable === "work_orders" && "🔗 Relational Mapping: work_orders.event_id references events.id (Many-to-One CASCADE)."}
                      {selectedSchemaTable === "checklists" && "🔗 Relational Mapping: checklists.event_id references events.id (One-to-One CASCADE, unique constraint)."}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">Select a table to inspect</div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: DDL & Drizzle typescript declarations */}
        {activeTab === "code" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex bg-indigo-50 p-1 rounded-md border border-indigo-100">
                <button
                  onClick={() => setCodeType("sql")}
                  className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                    codeType === "sql" ? "bg-white text-indigo-600 shadow-3xs" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  PostgreSQL DDL
                </button>
                <button
                  onClick={() => setCodeType("drizzle")}
                  className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                    codeType === "drizzle" ? "bg-white text-indigo-600 shadow-3xs" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <FileCode2 className="w-3.5 h-3.5" />
                  Drizzle ORM
                </button>
              </div>

              <button
                onClick={() => handleCopy(codeType === "sql" ? DATABASE_SCHEMAS.postgres : DATABASE_SCHEMAS.drizzle)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy Code"}
              </button>
            </div>

            <div className="bg-slate-900 rounded-xl overflow-hidden shadow-md max-h-[350px] overflow-y-auto">
              <pre className="p-4 text-[10px] text-gray-200 font-mono leading-relaxed select-all">
                <code>{codeType === "sql" ? DATABASE_SCHEMAS.postgres : DATABASE_SCHEMAS.drizzle}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
