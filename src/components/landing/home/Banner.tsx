"use client";

import CommonButton from "@/components/ui/CommonButton";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function Banner() {
  const { t } = useTranslation("common");

  return (
    <section className="flex min-h-screen items-center justify-center">
      {/* Ellipse Image at Top */}
      <Image
        src="/images/Ellipse.png"
        alt="Wellbeing Survey Banner"
        width={1600}
        height={1600}
        className="absolute inset-0 top-0 z-10 h-64 w-full"
        priority
      />
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/banner.png"
          alt="Wellbeing Survey Banner"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-white/80" />
      </div>

      {/* Content */}

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
       
        <h1 className="mb-6 bg-gradient-to-r from-[#f58220] to-[#f37820] bg-clip-text md:p-6 pt-20  text-4xl md:text-6xl font-bold text-transparent">
          {t("banner.title")}
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-[#6b7280]">
          {t("banner.description")}
        </p>
        <CommonButton text={t("banner.button")} href="/survey" />
      </div>
    </section>
  );
}
