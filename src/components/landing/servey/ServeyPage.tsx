"use client";

import LanguageToggle from "@/components/toggles/LanguageToggle";
import CommonButton from "@/components/ui/CommonButton";
import CustomLabel from "@/components/ui/CustomLabel";
import PillGroup from "@/components/ui/PillGroup";
import RadioGroup from "@/components/ui/RadioGroup";
import SelectInput from "@/components/ui/SelectInput";
import {
  ageOptions,
  departments,
  genderOptions,
  locationOptions,
  seniorityOptions,
} from "@/data/survey";
import { useGetStartSurveyMutation } from "@/redux/api/apis/surveyApi";
import { setNextQuestion, setSurveyData } from "@/redux/api/slice/surveySlice";
import { useAppDispatch } from "@/redux/hooks";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

const genderValueMap: { [key: string]: string } = {
  "survey.gender.options.male": "male",
  "survey.gender.options.female": "female",
};

const ageValueMap: { [key: string]: string } = {
  "survey.age.options.age18to24": "18-24",
  "survey.age.options.age25to34": "25-34",
  "survey.age.options.age35to44": "35-44",
  "survey.age.options.age45to54": "45-54",
};

const seniorityValueMap: { [key: string]: string } = {
  "survey.seniority.options.seniorManagement": "senior",
  "survey.seniority.options.manager": "manager",
  "survey.seniority.options.employee": "employee",
};

const locationValueMap: { [key: string]: string } = {
  "survey.location.options.block60": "block60",
  "survey.location.options.musundam": "msusundam",
  "survey.location.options.headOffice": "headOffice",
};

export default function SurveyPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const organizationIdParams = searchParams.get("organizationId");
  const [startSurvey] = useGetStartSurveyMutation();
  const { t } = useTranslation("common");

  const [formData, setFormData] = useState({
    stream: "",
    function: "",
    department: "",
    gender: "",
    age: "",
    seniority: "",
    location: "",
  });

  // Get available functions based on selected stream
  const availableFunctions = departments.find((d) => d.stream === formData.stream)?.functions || [];

  // Get available departments based on selected stream and function
  const availableDepartments =
    availableFunctions.find((f) => f.function === formData.function)?.departments || [];

  const handleRadioChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.stream ||
      !formData.function ||
      !formData.department ||
      !formData.gender ||
      !formData.age ||
      !formData.seniority ||
      !formData.location
    ) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in all required fields.",
      });
      return;
    }

    const englishGender = genderValueMap[formData.gender] || formData.gender;
    const englishAge = ageValueMap[formData.age] || formData.age;
    const englishSeniority = seniorityValueMap[formData.seniority] || formData.seniority;
    const englishLocation = locationValueMap[formData.location] || formData.location;

    const body = {
      stream: formData.stream,
      function: formData.function,
      department: formData.department,
      gender: englishGender,
      age: englishAge,
      seniorityLevel: englishSeniority,
      location: englishLocation,
      organizationId: organizationIdParams || "6902bda0c0f78f02d2067668",
    };

    try {
      const res = await startSurvey(body).unwrap();
      if (res?.success) {
        const survey = res?.data?.survey;
        dispatch(setSurveyData(survey));
        dispatch(setNextQuestion(res?.data?.nextQuestion));
        router.push("/survey-questions");
      } else {
        Swal.fire({
          icon: "warning",
          title: "Something went wrong",
          text: "Please try again later",
        });
      }
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        "Unable to start survey. Please try again.";

      Swal.fire({
        icon: "error",
        title: "Survey Start Failed",
        text: message,
      });
    }
  };

  // Helper function to convert strings to translation keys
  const toTranslationKey = (str: string) => {
    return str
      .replace(/[^a-zA-Z0-9_\s]/g, "") // Remove special characters but keep underscores
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .toLowerCase();
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50 p-4 pt-20">
      <div className="mb-6 flex w-full items-center justify-between md:px-36">
        <Link href="/" className="z-10 flex items-center justify-center text-gray-700">
          <MoveLeft className="mx-2 h-4 w-4" />
          {t("survey.backButton") || "Back to Home"}
        </Link>
        <LanguageToggle />
      </div>

      <div className="w-full max-w-2xl">
        <form className="my-4 space-y-6 rounded-xl bg-white p-6 shadow-lg" onSubmit={handleSubmit}>
          <div>
            <CustomLabel color="red" required>
              {t("survey.location.question") || "Which location do you work at?"}
            </CustomLabel>
            <RadioGroup
              name="location"
              options={locationOptions}
              value={formData.location}
              onChange={(val) => handleRadioChange("location", val)}
              color="red"
              required
            />
          </div>

          {/* Stream Selection */}
          <SelectInput
            label={t("survey.stream.question") || "Which stream do you work in?"}
            value={formData.stream}
            onChange={(val) =>
              setFormData({
                ...formData,
                stream: val,
                function: "",
                department: "",
              })
            }
            options={departments.map((stream) => ({
              label: t(`survey.streams.${toTranslationKey(stream.stream)}`) || stream.stream,
              value: stream.stream,
            }))}
            placeholder={t("survey.stream.placeholder") || "Select your stream"}
            required
          />

          {/* Function Selection */}
          {formData.stream && (
            <SelectInput
              label={t("survey.function.question") || "Which function do you work in?"}
              value={formData.function}
              onChange={(val) =>
                setFormData({
                  ...formData,
                  function: val,
                  department: "",
                })
              }
              options={availableFunctions.map((func) => ({
                label: t(`survey.functions.${toTranslationKey(func.function)}`) || func.function,
                value: func.function,
              }))}
              placeholder={t("survey.function.placeholder") || "Select your function"}
              required
            />
          )}

          {/* Department Selection */}
          {formData.stream && formData.function && (
            <SelectInput
              label={t("survey.department.question") || "Which department do you work in?"}
              value={formData.department}
              onChange={(val) => setFormData({ ...formData, department: val })}
              options={availableDepartments.map((dept) => ({
                label: t(`survey.departments.${toTranslationKey(dept)}`) || dept,
                value: dept,
              }))}
              placeholder={t("survey.department.placeholder") || "Select your department"}
              required
            />
          )}

          <div>
            <CustomLabel color="yellow" required>
              {t("survey.seniority.question") || "What is your seniority level?"}
            </CustomLabel>
            <RadioGroup
              name="seniority"
              options={seniorityOptions}
              value={formData.seniority}
              onChange={(val) => handleRadioChange("seniority", val)}
              color="yellow"
              required
            />
          </div>

          <div>
            <CustomLabel color="blue" required>
              {t("survey.gender.question") || "Please select your gender"}
            </CustomLabel>
            <PillGroup
              name="gender"
              options={genderOptions}
              value={formData.gender}
              onChange={(val) => handleRadioChange("gender", val)}
              required
            />
          </div>

          <div>
            <CustomLabel color="purple" required>
              {t("survey.age.question") || "Please select your age"}
            </CustomLabel>
            <PillGroup
              name="age"
              options={ageOptions}
              value={formData.age}
              onChange={(val) => handleRadioChange("age", val)}
              required
            />
          </div>
        </form>

        <div className="mb-6 flex w-full items-center justify-between">
          <CommonButton
            arrow="left"
            text={t("survey.backButton") || "Back to Home"}
            href="/"
            bgClass="bg-[#F5F7FA]"
            hoverColor="bg-[#F5F7FA]"
            textColor="text-gray-800 shadow-lg"
          />

          <button type="submit" onClick={handleSubmit}>
            <CommonButton text={t("survey.startButton") || "Start Survey"} />
          </button>
        </div>
      </div>
    </div>
  );
}

