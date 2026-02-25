import CommonButton from "@/components/ui/CommonButton";
import { CircleCheckBig } from "lucide-react";

export default function ThankYou() {
    return (
        <div className="min-h-screen bg-gray-50 pt-20 w-full flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl min-h-[30vh] mx-auto">
                <div className="bg-white py-8 md:py-24 rounded-xl shadow-lg text-center">
                    <div className={`w-12 h-12 bg-[#126479] rounded-full mx-auto mb-4 flex items-center justify-center`}>
                        <CircleCheckBig className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Thank You!</h1>
                    <p className="text-gray-600 mb-6">Your wellbeing survey has been completed successfully. We appreciate you taking the time to share your thoughts and experiences with us.</p>
                </div>
            </div>
        </div>
    )
}
