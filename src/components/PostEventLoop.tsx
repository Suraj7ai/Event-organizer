import React, { useState } from "react";
import { FeedbackItem } from "../types";
import { 
  HeartHandshake, 
  Star, 
  MessageSquare, 
  BarChart3, 
  Plus, 
  Award,
  ChevronRight,
  TrendingUp,
  UserCheck
} from "lucide-react";

interface PostEventLoopProps {
  feedbacks: FeedbackItem[];
  onAddFeedback: (feedback: Omit<FeedbackItem, "id" | "timestamp">) => void;
}

export default function PostEventLoop({
  feedbacks,
  onAddFeedback,
}: PostEventLoopProps) {
  // Form state
  const [role, setRole] = useState<"Attendee" | "Presenter" | "Organizer">("Attendee");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text) return;
    onAddFeedback({
      role,
      rating,
      feedbackText: text,
    });
    setText("");
    setRating(5);
    setShowForm(false);
  };

  // Calculations
  const averageRating = feedbacks.length > 0 
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : "0.0";

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "Attendee":
        return "bg-indigo-50 text-indigo-700 border-indigo-150";
      case "Presenter":
        return "bg-purple-50 text-purple-700 border-purple-150";
      case "Organizer":
        return "bg-cyan-50 text-cyan-700 border-cyan-150";
      default:
        return "bg-gray-50 text-gray-700 border-gray-150";
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full" id="post-event-loop-section">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-50/20">
        <div>
          <h2 className="text-xl font-display font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-indigo-600" />
            Post-Event Feedback Loop
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Automated closing surveys triggered post-keynote. Aggregating live responses across organizers, speakers, and hackers.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          {showForm ? "View Feedbacks" : "Leave Feedback"}
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Feedback Analytics (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between shadow-2xs">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <BarChart3 className="w-4.5 h-4.5 text-indigo-600" />
              Operations Quality Index
            </h3>

            {/* Average Big Stat */}
            <div className="text-center bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Average Rating Score</span>
              <div className="flex items-center justify-center gap-1 mt-1">
                <span className="text-4xl font-mono font-bold text-indigo-950">{averageRating}</span>
                <span className="text-lg text-slate-400 font-bold">/ 5.0</span>
              </div>
              <div className="flex items-center justify-center gap-0.5 mt-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star 
                    key={s} 
                    className={`w-4 h-4 ${s <= Math.round(parseFloat(averageRating)) ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} 
                  />
                ))}
              </div>
              <span className="text-[10px] text-slate-400 block mt-2 font-semibold">{feedbacks.length} survey submittals accounted.</span>
            </div>

            {/* Compliance Note */}
            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 flex items-start gap-2">
              <Award className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <p className="text-[10px] text-indigo-950 leading-relaxed font-semibold">
                Feedback metrics are automatically archived into Firestore logs. System managers receive summary sheets via PDF integrations post-session.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 text-[10px] text-slate-400 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-550" />
            <span>Target Operations SLA Rating Goal: &gt;4.5 Stars</span>
          </div>
        </div>

        {/* Right Side: Feedback Submission Form OR Active Feedbacks List (8 Cols) */}
        <div className="lg:col-span-8">
          {showForm ? (
            <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <MessageSquare className="w-4.5 h-4.5 text-indigo-600" />
                Submit Survey Evaluation
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Role */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Stakeholder Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                  >
                    <option value="Attendee">Attendee (Hackathon Hacker)</option>
                    <option value="Presenter">Presenter (Speaker / Mentor)</option>
                    <option value="Organizer">Organizer (Hack2Skill / Google Admin)</option>
                  </select>
                </div>

                {/* Rating Stars Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rating Out of 5 Stars</label>
                  <div className="flex items-center gap-1 h-9">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="text-slate-300 hover:text-amber-500 focus:outline-none cursor-pointer"
                      >
                        <Star 
                          className={`w-6 h-6 transition-all ${
                            star <= (hoverRating ?? rating) 
                              ? "text-amber-400 fill-amber-400 scale-110" 
                              : "text-slate-200"
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feedback text */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Feedback Comments *</label>
                <textarea
                  required
                  rows={3}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Share details about logistics alignment, wait times, IT connectivity, and presentation coordination..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs cursor-pointer transition-colors"
                >
                  Submit Survey Feedback
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {feedbacks.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p className="text-xs font-bold">No feedback responses logged yet.</p>
                </div>
              ) : (
                feedbacks.slice().reverse().map((fb) => (
                  <div key={fb.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 shadow-3xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getRoleBadgeClass(fb.role)}`}>
                          {fb.role}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">{fb.timestamp}</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star 
                            key={s} 
                            className={`w-3 h-3 ${s <= fb.rating ? "text-amber-450 fill-amber-450" : "text-slate-200"}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 leading-normal font-semibold">{fb.feedbackText}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
