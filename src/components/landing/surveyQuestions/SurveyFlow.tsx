/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import LanguageToggle from "@/components/toggles/LanguageToggle";
import RadioOption from "@/components/ui/RadioOption";
import { translateQuestion } from "@/data/translateQuestion";
import { useSubmitResultMutation } from "@/redux/api/apis/surveyApi";
import { setNextQuestion, setSurveyData } from "@/redux/api/slice/surveySlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ThankYou from "./ThankYou";

interface Question {
  _id: string;
  id: string;
  question: string;
  options: string[];
  domain: string;
  weight: number;
  isInverted: boolean;
  isFollowUp: boolean;
  dashboardDomain: string;
  dashboardDomainMaxPossibleScore: number;
  dashboardDomainWeight: number;
  isDeleted: boolean;
}

interface Survey {
  user: {
    department: string;
    gender: string;
    age: string;
    seniorityLevel: string;
    location: string;
    _id: string;
  };
  responses: {
    question: string;
    answerIndex: number;
    score: number;
    _id: string;
  }[];
  questions: Question[];
  highRiskCount: number;
  status: string;
  followUpQuestions: Question[];
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function SurveyFlow() {
  const dispatch = useAppDispatch();
  const { survey, nextQuestion } = useAppSelector((state) => state.survey);
  const [isEnglish, setIsEnglish] = useState(false);
  const { language } = useAppSelector((state) => state.ui);
  const [submitResult, { isLoading }] = useSubmitResultMutation();

  const [currentAnswer, setCurrentAnswer] = useState<string | null>(null);

  useEffect(() => {
    if (language === "en") {
      setIsEnglish(true);
    } else {
      setIsEnglish(false);
    }
  }, [language]);

  const currentQuestion = nextQuestion;

  const followUpQuestions = survey?.followUpQuestions?.length || 0;
  const totalQuestions = survey?.questions?.length || 0;
  const answeredCount = survey?.responses?.length || 0;

  const progress =
    totalQuestions > 0
      ? currentQuestion?.isFollowUp
        ? ((answeredCount - totalQuestions) / followUpQuestions) * 100
        : (answeredCount / totalQuestions) * 100
      : 0;

  const allInitialAnswered = survey?.questions?.every((q: Question) =>
    survey.responses?.some((r: any) => r.question === q._id),
  );

  const hasFollowUp = survey?.followUpQuestions && survey.followUpQuestions.length > 0;
  const stage =
    allInitialAnswered && hasFollowUp ? "followUp" : allInitialAnswered ? "completed" : "initial";

  const handleAnswerSelect = (value: string) => {
    setCurrentAnswer(value);
  };

  const handleNext = async () => {
    if (!currentQuestion || !currentAnswer) {
      Swal.fire({
        icon: "warning",
        title: "No Answer Selected",
        text: "Please select an answer before proceeding.",
      });
      return;
    }

    if (!survey) {
      Swal.fire({
        icon: "error",
        title: "Survey Data Missing",
        text: "Survey data is not available. Please restart the survey.",
      });
      return;
    }

    try {
      const payload = {
        surveyId: survey._id,
        answer: {
          questionId: currentQuestion._id,
          answerIndex: currentQuestion.options.indexOf(currentAnswer),
        },
      };

      const res = await submitResult(payload).unwrap();

      if (res?.success) {
        const surveyData = res.data.survey as unknown as Survey;
        dispatch(setSurveyData(surveyData));
        dispatch(setNextQuestion(res.data.nextQuestion as Question));

        setCurrentAnswer(null);
      } else {
        throw new Error("Submission failed on server");
      }
    } catch (error) {
      console.error("Submission failed:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Please try again.",
      });
    }
  };

  if (stage === "completed" || !survey || !currentQuestion) {
    return <ThankYou />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gray-50 p-4 pt-28">
      <div className="mb-6 flex w-full items-center justify-between gap-4 lg:px-36">
        <Link href="/" className="z-10 flex items-center justify-center text-gray-700 lg:hidden">
          <MoveLeft className="mx-2 h-4 w-4" /> Home
        </Link>
        <Link href="/" className="z-10 hidden items-center justify-center text-gray-700 lg:flex">
          <MoveLeft className="mx-2 h-4 w-4" /> Back to Home
        </Link>

        <div className="mb-6 hidden w-2/3 lg:block">
          <div className="mb-1 flex justify-between text-sm text-gray-600">
            <span>
              Completed{" "}
              {currentQuestion.isFollowUp ? answeredCount - totalQuestions : answeredCount} of{" "}
              {currentQuestion.isFollowUp ? followUpQuestions : totalQuestions || 0} {}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-gray-200">
            <div
              className="h-2.5 rounded-full bg-[#f58220] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <LanguageToggle />
      </div>

      <div className="flex w-full items-center justify-center">
        <div className="my-4 rounded-xl md:p-6">
          <div className="mx-auto mb-6 min-w-60 md:max-w-5xl">
            <div className="mx-auto mb-6 block w-full lg:hidden">
              <div className="mb-1 flex justify-between text-sm text-gray-600">
                <span>
                  Completed{" "}
                  {currentQuestion.isFollowUp ? answeredCount - totalQuestions : answeredCount} of{" "}
                  {currentQuestion.isFollowUp ? followUpQuestions : totalQuestions || 0} {}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-gray-200">
                <div
                  className="h-2.5 rounded-full bg-[#f58220] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <h1 className="text-md mx-auto mb-4 max-w-3xl py-4 text-center font-bold text-black md:max-w-5xl md:min-w-5xl md:py-8 md:text-2xl">
              {isEnglish
                ? currentQuestion.question
                : translateQuestion.find((q) => q.english === currentQuestion.question)?.arabic}
            </h1>

            <div className="mt-4 flex flex-col gap-4 space-y-2 rounded-lg bg-white px-4 py-8 text-gray-800 shadow-lg md:px-8 md:py-12 md:text-lg">
              {currentQuestion.options.map((option, index) => (
                <RadioOption
                  key={index}
                  name={currentQuestion._id}
                  value={option}
                  label={option}
                  color="yellow"
                  checked={currentAnswer === option}
                  onChange={handleAnswerSelect}
                  required
                />
              ))}
            </div>
          </div>

          <div className="z-10 mt-6 flex justify-end">
            <button
              onClick={handleNext}
              disabled={!currentAnswer || isLoading}
              className={`inline-flex items-center justify-center gap-3 rounded-full border border-white px-7 py-2 text-xs font-medium transition-all duration-300 hover:scale-105 md:text-lg ${currentAnswer && !isLoading ? "bg-[#126479] text-white hover:bg-[#f58220]" : "bg-gray-200 text-gray-400"} ${!currentAnswer || isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              Next
              <MoveLeft className="h-4 w-4 rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
