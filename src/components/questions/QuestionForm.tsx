"use client";

import type React from "react";

import type { QuestionItem } from "@/typesAndIntefaces/question";
import { useState } from "react";
import Swal from "sweetalert2";

type Question = QuestionItem;

export default function QuestionForm({
  title,
  initial,
  onClose,
  onSubmit,
}: {
  title: string;
  initial?: Question;
  onClose: () => void;
  onSubmit: (payload: Partial<QuestionItem>) => void;
}) {
  const [question, setQuestion] = useState(initial?.question ?? "");
  const [domain, setDomain] = useState(initial?.domain ?? "");
  const [weight, setWeight] = useState(initial?.weight ?? 1);
  const [isInverted, setIsInverted] = useState(initial?.isInverted ?? false);
  const [isFollowUp, setIsFollowUp] = useState(initial?.isFollowUp ?? false);
  const [dashboardDomain, setDashboardDomain] = useState(initial?.dashboardDomain ?? "");

  const [optionNever, setOptionNever] = useState(
    Array.isArray(initial?.options) && initial.options.length === 4 ? initial.options[0] : "Never"
  );
  const [optionRarely, setOptionRarely] = useState(
    Array.isArray(initial?.options) && initial.options.length === 4 ? initial.options[1] : "Rarely"
  );
  const [optionOften, setOptionOften] = useState(
    Array.isArray(initial?.options) && initial.options.length === 4 ? initial.options[2] : "Often"
  );
  const [optionAlways, setOptionAlways] = useState(
    Array.isArray(initial?.options) && initial.options.length === 4 ? initial.options[3] : "Always"
  );

  const domainOptions = [
    "Personal Wellbeing",
    "Burnout",
    "Workload & Efficiency",
    "Workplace Satisfaction",
    "Leadership & Alignment",
    "Coworker Relationships",
    "Psych. Safety",
    "Depression Risk",
    "Anxiety Risk",
    "Mental Health Risk",
    "Burnout Risk",
    "Fairness & Recognition",
    "Burnout Intensity",
    "Depression Severity",
    "Anxiety Severity",
    "Anxiety Symptom",
    "Health Impact",
    "Root Cause Intensity",
    "Fear/Blame Intensity",
    "Trust Refinement",
  ];

  const dashboardDomainOptions = [
    "Clinical Risk Index",
    "Psychological Safety Index",
    "Workload & Efficiency",
    "Leadership & Alignment",
    "Satisfaction & Engagement",
  ];

  const allOptionsValid =
    optionNever.trim() && optionRarely.trim() && optionOften.trim() && optionAlways.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!allOptionsValid) {
      Swal.fire({
        icon: "error",
        title: "Invalid Options",
        text: "All 4 options are required and cannot be empty!",
      });
      return;
    }

    const payload: Partial<QuestionItem> = {
      question: question.trim(),
      domain,
      weight: Number(weight),
      isInverted,
      isFollowUp,
      dashboardDomain,
      options: [optionNever.trim(), optionRarely.trim(), optionOften.trim(), optionAlways.trim()],
      // These might need to be calculated or provided:
      dashboardDomainMaxPossibleScore: 3, // Default value, adjust as needed
      dashboardDomainWeight: 1, // Default value, adjust as needed
    };

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0  z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div className="bg-card w-full max-w-4xl rounded-xl p-6 shadow-2xl sm:p-8 mt-96 md:mt-12">
        <h3 className="text-foreground mb-6 text-2xl font-bold">{title}</h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-foreground mb-2 block text-sm font-semibold">Question *</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              placeholder="e.g., How often do you feel overwhelmed at work?"
              className="border-input bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full resize-none rounded-lg border px-4 py-3 text-sm transition focus:ring-2 focus:outline-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="text-foreground mb-2 block text-sm font-semibold">Domain *</label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                required
                className="border-input bg-card text-foreground focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-2.5 text-sm transition focus:ring-2 focus:outline-none"
              >
                <option value="">Select Domain</option>
                {domainOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-foreground mb-2 block text-sm font-semibold">
                Dashboard Domain *
              </label>
              <select
                value={dashboardDomain}
                onChange={(e) => setDashboardDomain(e.target.value)}
                required
                className="border-input bg-card text-foreground focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-2.5 text-sm transition focus:ring-2 focus:outline-none"
              >
                <option value="">Select Dashboard Domain</option>
                {dashboardDomainOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="text-foreground mb-2 block text-sm font-semibold">Weight *</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || /^\d+$/.test(val)) {
                    setWeight(val === "" ? 1 : Number.parseInt(val, 10));
                  }
                }}
                step="1"
                min="1"
                required
                className="border-input bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-2.5 text-sm transition focus:ring-2 focus:outline-none"
              />
              <p className="text-muted-foreground mt-1 text-xs">Enter a whole number (e.g., 1, 2, 3)</p>
            </div>
          </div>

          <div>
            <label className="text-foreground mb-3 block text-sm font-semibold">
              Response Options *
            </label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-foreground mb-1.5 block text-xs font-medium">Never *</label>
                <input
                  type="text"
                  value={optionNever}
                  onChange={(e) => setOptionNever(e.target.value)}
                  required
                  placeholder="e.g., Never"
                  className="border-input bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-2.5 text-sm transition focus:ring-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-foreground mb-1.5 block text-xs font-medium">Rarely *</label>
                <input
                  type="text"
                  value={optionRarely}
                  onChange={(e) => setOptionRarely(e.target.value)}
                  required
                  placeholder="e.g., Rarely"
                  className="border-input bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-2.5 text-sm transition focus:ring-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-foreground mb-1.5 block text-xs font-medium">Often *</label>
                <input
                  type="text"
                  value={optionOften}
                  onChange={(e) => setOptionOften(e.target.value)}
                  required
                  placeholder="e.g., Often"
                  className="border-input bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-2.5 text-sm transition focus:ring-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-foreground mb-1.5 block text-xs font-medium">Always *</label>
                <input
                  type="text"
                  value={optionAlways}
                  onChange={(e) => setOptionAlways(e.target.value)}
                  required
                  placeholder="e.g., Always"
                  className="border-input bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-2.5 text-sm transition focus:ring-2 focus:outline-none"
                />
              </div>
            </div>
            <p
              className={`mt-2 text-xs font-medium ${allOptionsValid ? "text-primary" : "text-destructive"}`}
            >
              {allOptionsValid ? "All options filled" : "Warning: All 4 options are required"}
            </p>
          </div>

          <div className="bg-secondary space-y-3 rounded-lg p-4">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={isInverted}
                onChange={(e) => setIsInverted(e.target.checked)}
                className="border-input text-primary focus:ring-primary/20 h-4 w-4 rounded transition"
              />
              <span className="text-foreground text-sm font-medium">Inverted Scoring</span>
            </label>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={isFollowUp}
                onChange={(e) => setIsFollowUp(e.target.checked)}
                className="border-input text-primary focus:ring-primary/20 h-4 w-4 rounded transition"
              />
              <span className="text-foreground text-sm font-medium">Follow-up Question</span>
            </label>
          </div>

          <div className="border-border flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-secondary text-foreground hover:bg-secondary/80 rounded-lg px-6 py-2.5 font-semibold transition active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-2.5 font-semibold shadow-md transition active:scale-95"
            >
              {initial ? "Update Question" : "Create Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}