import { useEffect, useState } from "react";

const steps = [
  "Analyzing ...",
  "Fetching latest data ...",
  "Processing ...",
  "Optimizing ...",
  "Loading modules ...",
  "Finalizing ...",
];

const StepLoader = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2000); // Step every 2 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex max-w-[60vw] flex-col items-center justify-center p-4">
      {/* Fixed-width Progress Bar */}
      <div className="mb-4 h-2 w-full min-w-[50vw] overflow-hidden rounded-full bg-gray-300">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${((currentStep + 1) / steps.length) * 100}%`,
            backgroundColor: "#f58220",
          }}
        ></div>
      </div>

      {/* Step Text */}
      <div className="text-center text-lg font-semibold whitespace-nowrap text-gray-700">
        {steps[currentStep]}
      </div>
    </div>
  );
};

export default StepLoader;
