"use client";

import CommonButton from "@/components/ui/CommonButton";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function Banner() {
  const { t } = useTranslation("common");

  return (
    <section className="flex min-h-screen items-center justify-center">
      {/* Ellipse Image at Top */}
      {/* <Image
        src="/images/Ellipse green.png"
        alt="Wellbeing Survey Banner"
        width={1600}
        height={1600}
        className="absolute inset-0 top-0 z-10 h-64 w-full"
        priority
      /> */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/bannerImage.png"
          alt="Wellbeing Survey Banner"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gray-50/60" />
      </div>

      {/* Content */}

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <h1 className="mb-6 bg-gradient-to-r from-[#126479] to-[#1386a3] bg-clip-text pt-20 text-4xl font-bold text-transparent md:p-6 md:text-6xl">
          {t("banner.title")}
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-[#1e1f22]">
          {t("banner.description")}
        </p>
        <CommonButton text={t("banner.button")} href="/survey" />
      </div>
    </section>
  );
}
