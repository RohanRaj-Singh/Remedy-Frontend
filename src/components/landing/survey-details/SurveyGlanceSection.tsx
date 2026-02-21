"use client";

import { CircleHelp, Clock, PencilLine, Shield, Target } from "lucide-react";
// Added useTranslation import
import { useTranslation } from "react-i18next";

export default function SurveyGlanceSection() {
  // Added translation hook
  const { t } = useTranslation("common");

  const surveyDetails = [
    {
      title: t("surveyGlance.duration.title") || "Survey Duration",
      icon: Clock,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      description:
        t("surveyGlance.duration.description") || "Takes approximately 5-10 minutes to complete.",
    },
    {
      title: t("surveyGlance.questions.title") || "Number of Questions",
      icon: CircleHelp,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      description:
        t("surveyGlance.questions.description") ||
        "10-15 multiple-choice questions covering various aspects of wellbeing.",
    },
    {
      title: t("surveyGlance.types.title") || "Question Types",
      icon: PencilLine,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      description:
        t("surveyGlance.types.description") ||
        "Likert scale (1-5), agree/disagree, and other multiple-choice formats.",
    },
    {
      title: t("surveyGlance.privacy.title") || "Privacy",
      icon: Shield,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
      description:
        t("surveyGlance.privacy.description") || "All responses are anonymous and securely stored.",
    },
    {
      title: t("surveyGlance.purpose.title") || "Purpose",
      icon: Target,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
      description:
        t("surveyGlance.purpose.description") ||
        "Understand wellbeing levels, identify areas for improvement, and gain actionable insights.",
    },
  ];

  return (
    <section className="bg-gray-50 px-4 text-center">
      <h2 className="mb-8 text-3xl font-bold text-[#f58220]">
        {t("surveyGlance.title.part1") || "Survey"}{" "}
        <span className="text-black">{t("surveyGlance.title.part2") || "at a Glance"}</span>
      </h2>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6">
        {surveyDetails.map((item, index) => (
          <div
            key={index}
            className={`rounded-lg bg-white p-8 py-12 text-center shadow-md ${
              ["Privacy", "Purpose"].includes(item.title)
                ? "cols-span-2 lg:col-span-3"
                : "cols-span-2 lg:col-span-2"
            }`}
          >
            <div
              className={`h-12 w-12 ${item.bgColor} mx-auto mb-4 flex items-center justify-center rounded-full`}
            >
              <item.icon className={`h-6 w-6 ${item.iconColor}`} />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
