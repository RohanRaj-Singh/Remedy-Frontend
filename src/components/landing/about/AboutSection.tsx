"use client";

import { ArrowUpRight, Eye, Lightbulb, Shield, Target, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AboutSection() {
  const { t } = useTranslation("common");

  const missionVisionValues = [
    {
      title: t("about.mission.title"),
      icon: Target,
      description: t("about.mission.description"),
      bgColor: "bg-[#f37820]",
    },
    {
      title: t("about.vision.title"),
      icon: Eye,
      description: t("about.vision.description"),
      bgColor: "bg-gradient-to-r from-[#f37820] to-[#f37820]",
    },
    {
      title: t("about.values.title"),
      icon: Users,
      description: t("about.values.description"),
      bgColor: "bg-[#f37820]",
    },
  ];

  const whatWeStandFor = [
    {
      title: t("about.standFor.privacy.title"),
      icon: Shield,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      description: t("about.standFor.privacy.description"),
    },
    {
      title: t("about.standFor.accuracy.title"),
      icon: Target,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      description: t("about.standFor.accuracy.description"),
    },
    {
      title: t("about.standFor.simplicity.title"),
      icon: Lightbulb,
      bgColor: "bg-indigo-100",
      iconColor: "text-indigo-600",
      description: t("about.standFor.simplicity.description"),
    },
    {
      title: t("about.standFor.growth.title"),
      icon: ArrowUpRight,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
      description: t("about.standFor.growth.description"),
    },
  ];

  return (
    <section className="flex w-full flex-col items-center justify-center bg-gray-50 p-4 py-12 pt-28 text-center">
      <h1 className="mb-4 text-4xl font-medium text-gray-900">
        {t("about.title")} <span className="font-semibold text-[#f58220]">Remedy</span>
      </h1>
      <p className="mx-auto mb-8 max-w-2xl text-gray-600">{t("about.subtitle")}</p>

      <div className="mx-auto mt-12 mb-12 max-w-5xl rounded-lg bg-white p-6 shadow-md">
        <p className="mb-6 text-sm text-gray-700 md:text-base">{t("about.description")}</p>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
        {missionVisionValues.map((item, index) => (
          <div key={index} className="rounded-lg bg-white p-6 text-center shadow-md">
            <div
              className={`h-12 w-12 ${item.bgColor} mx-auto mb-4 flex items-center justify-center rounded-full`}
            >
              <item.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="mb-2 text-3xl font-bold text-gray-900">
          {t("about.standFor.title")}{" "}
          <span className="font-semibold text-[#f58220]"> Stand For</span>
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-gray-600">{t("about.subtitle")}</p>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2">
          {whatWeStandFor.map((item, index) => (
            <div key={index} className="rounded-lg border bg-white p-6 text-left shadow-md">
              <div
                className={`h-12 w-12 ${item.bgColor} mb-4 flex items-center justify-center rounded-full text-left`}
              >
                <item.icon className={`h-6 w-6 ${item.iconColor}`} />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
