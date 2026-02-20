"use client";

import { BarChart3, CircleCheckBig, Rocket } from "lucide-react";
// Added useTranslation import
import { useTranslation } from "react-i18next";

export default function HowItWorksSection() {
  // Added translation hook
  const { t } = useTranslation("common");

  const steps = [
    {
      number: 1,
      icon: CircleCheckBig,
      title: t("howItWorks.steps.answer.title") || "Answer Questions",
      description:
        t("howItWorks.steps.answer.description") ||
        "Respond honestly to each question to get accurate insights. Take your time and consider each question carefully for the most meaningful results.",
      color: "bg-[#10b981]",
      iconBg: "bg-[#d1fae5]",
      iconColor: "text-[#f58220]",
    },
    {
      number: 2,
      icon: BarChart3,
      title: t("howItWorks.steps.summary.title") || "View Summary",
      description:
        t("howItWorks.steps.summary.description") ||
        "Receive a quick overview of your responses with detailed insights and personalized recommendations based on your wellbeing assessment.",
      color: "bg-[#f59e0b]",
      iconBg: "bg-[#fef3c7]",
      iconColor: "text-[#f59e0b]",
    },
    {
      number: 3,
      icon: Rocket,
      title: t("howItWorks.steps.action.title") || "Take Action",
      description:
        t("howItWorks.steps.action.description") ||
        "Use insights to improve wellbeing personally or within your organization. Implement suggested strategies and track your progress over time.",
      color: "bg-[#a855f7]",
      iconBg: "bg-[#f3e8ff]",
      iconColor: "text-[#a855f7]",
    },
  ];

  return (
    <section className="overflow-hidden bg-gray-50 px-10 py-20 text-black md:px-8">
      <div className="relative mx-auto max-w-6xl">
        <h2 className="mb-24 text-center text-4xl font-bold md:mb-16">
          {t("howItWorks.title.part1") || "How It"}{" "}
          <span className="text-[#f58220]">{t("howItWorks.title.part2") || "Works"}</span>
        </h2>

        <div className="relative">
          <div className="absolute top-18 left-1/2 z-0 hidden h-3/4 w-1 -translate-x-1/2 transform overflow-hidden bg-white md:block" />
          <div className="absolute top-0 right-6 z-0 block h-full w-[2px] bg-white md:hidden" />

          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative mb-40 flex flex-col items-center justify-center last:mb-0 md:mb-20 md:flex-row"
            >
              <div
                className={`absolute left-0 w-full max-w-md md:w-[calc(50%-3rem)] ${
                  index % 2 === 0
                    ? "md:absolute md:right-1/2 md:mr-12"
                    : "md:absolute md:left-1/2 md:ml-12"
                }`}
              >
                <div className="relative mt-6 rounded-2xl bg-white p-6 shadow-sm md:mt-0 md:p-8">
                  <div className="gap-4">
                    <div className="flex items-center justify-start md:gap-4">
                      <div className={`flex-shrink-0 rounded-lg p-3`}>
                        <step.icon className={`h-6 w-6 ${step.iconColor}`} strokeWidth={2} />
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-[#1a1a1a] md:text-xl">
                        {step.title}
                      </h3>
                    </div>

                    <div className="">
                      <p className="text-sm leading-relaxed text-[#6b7280]">{step.description}</p>
                    </div>
                  </div>

                  <div
                    className={`${step.color} absolute top-1/2 right-[-2rem] z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white shadow-md md:hidden`}
                  >
                    <span className="text-lg font-bold text-white">{step.number}</span>
                  </div>
                </div>
              </div>

              <div
                className={`${step.color} relative z-10 hidden h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-4 border-white shadow-lg md:flex`}
              >
                <span className="text-2xl font-bold text-white">{step.number}</span>
              </div>

              <div className="h-24 md:h-48" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
