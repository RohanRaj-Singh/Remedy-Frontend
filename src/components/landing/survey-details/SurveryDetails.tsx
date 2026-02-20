"use client";

import { useTranslation } from "react-i18next";

export default function SurveyDetails() {
  const { t } = useTranslation("common");

  return (
    <section className="flex w-full flex-col items-center justify-center bg-gray-50 p-4 pt-28 text-center">
      <h1 className="mb-4 text-4xl font-medium text-gray-900">
        {t("nav.about")} <span className="font-semibold text-[#f58220]">Details</span>
      </h1>
      <p className="mx-auto mb-8 max-w-2xl text-gray-600">{t("survey.details.subtitle")}</p>

      <div className="mx-auto mt-12 mb-12 max-w-5xl rounded-lg bg-white p-6 shadow-md">
        <p className="mb-6 text-gray-700">{t("survey.details.description")}</p>
      </div>
    </section>
  );
}
