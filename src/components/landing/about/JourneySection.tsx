"use client";

import CommonButton from "@/components/ui/CommonButton";
import { useTranslation } from "react-i18next";

export default function JourneySection() {
    const { t } = useTranslation("common");
    
    return (
        <section className="py-12  text-center bg-transparent  pt-20 w-full flex flex-col items-center justify-center p-4 ">
            <div className="md:min-w-3xl max-w-3xl mx-auto  bg-[#f5822010] p-6 rounded-lg shadow-md py-20">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t("about.journey.title") || "Ready to Start Your Wellbeing Journey?"}</h2>
                <p className="text-gray-700 mb-6 max-w-xl mx-auto">
                    {t("about.journey.description") || "Join thousands of organizations and individuals who are using our platform to understand and improve their wellbeing."}
                </p>

                <CommonButton href="/survey" text={t("about.journey.button") || "Get Started Today"} className=" px-6 py-3 " />
            </div>
        </section>
    );
}