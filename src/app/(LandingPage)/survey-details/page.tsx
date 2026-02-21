import HowItWorksSection from "@/components/landing/about/HowItWorksSection";
import JourneySection from "@/components/landing/about/JourneySection";
import SurveyDetails from "@/components/landing/survey-details/SurveryDetails";
import SurveyGlanceSection from "@/components/landing/survey-details/SurveyGlanceSection";

export default function SurveyDetailsPage() {
    return (
        <div className='min-h-screen bg-gray-50'>
            <SurveyDetails />
            <SurveyGlanceSection />
            <HowItWorksSection />
            <JourneySection />
        </div>
    )
}