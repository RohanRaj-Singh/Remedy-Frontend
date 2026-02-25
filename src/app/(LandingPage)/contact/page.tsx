"use client";

import { useTranslation } from "react-i18next";

export default function ContactPage() {
  const { t } = useTranslation("common");

  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50 p-4 py-12 pt-28 text-center">
      <h1 className="mb-4 text-4xl font-medium text-gray-900">
        {t("contact.title")} <span className="font-semibold text-[#f58220]">Us</span>
      </h1>
      <p className="mx-auto mb-8 max-w-2xl text-gray-600">{t("contact.subtitle")}</p>
      <div className="mx-auto mt-12 mb-12 max-w-5xl rounded-lg bg-white p-6 shadow-md">
        <p className="mb-6 text-gray-700">{t("contact.description")}</p>
        <p className="text-lg">Email : info@remedyway.om</p>
      </div>
    </section>
  );
}
