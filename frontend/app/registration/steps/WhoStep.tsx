"use client";

import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useRegistration } from "../context/RegistrationContext";
import { RegistrationData, whoSchema } from "../types";

type WhoFormData = Pick<RegistrationData, "intensity">;

// Function to calculate age from birthday string
const calculateAge = (birthday: string): number => {
  if (!birthday) return 0;
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

// Function to calculate minutes per week based on intensity percentage and age
const calculateMinutesPerWeek = (intensityPercentage: number, age: number): number => {
  if (age >= 5 && age <= 17) {
    // Children: 420 minutes/week (7 hours) at 100%
    return Math.round((intensityPercentage * 420) / 100);
  } else if (age >= 18) {
    // Adults: 225 minutes/week (middle of 150-300 range) at 100%
    return Math.round((intensityPercentage * 225) / 100);
  }
  return 0;
};

// Function to get intensity percentage from minutes per week
const getIntensityFromMinutes = (minutesPerWeek: number, age: number): number => {
  if (age >= 5 && age <= 17) {
    return Math.round((minutesPerWeek * 100) / 420);
  } else if (age >= 18) {
    return Math.round((minutesPerWeek * 100) / 225);
  }
  return 0;
};

// Function to get WHO recommendation based on age
const getWhoRecommendation = (age: number) => {
  if (age >= 5 && age <= 17) {
    return {
      ageGroup: "🧒 Children and Adolescents (5–17 years)",
      recommendation: "~7 hours/week",
      description: "WHO recommends at least 60 minutes of moderate-to-vigorous physical activity daily",
    };
  } else if (age >= 18 && age <= 64) {
    return {
      ageGroup: "👨‍🦱 Adults (18–64 years)",
      recommendation: "150–300 minutes/week",
      description: "WHO recommends 150-300 minutes of moderate-intensity activity per week",
    };
  } else if (age >= 65) {
    return {
      ageGroup: "🧓 Older Adults (65+ years)",
      recommendation: "150–300 minutes/week",
      description: "WHO recommends same as adults: 150-300 minutes of moderate-intensity activity per week",
    };
  } else {
    return {
      ageGroup: "Please complete your birthday information first",
      recommendation: "N/A",
      description: "We need your age to show appropriate WHO recommendations",
    };
  }
};

export const WhoStep: React.FC = () => {
  const { data, updateStepData, errors } = useRegistration();

  // Calculate age
  const age = useMemo(() => calculateAge(data.birthday || ""), [data.birthday]);

  // Get default intensity percentage
  const defaultIntensity = 40;

  const {
    getValues,
    watch,
    register,
    setValue,
    formState: { errors: formErrors },
  } = useForm<WhoFormData>({
    resolver: zodResolver(whoSchema),
    defaultValues: {
      intensity: data.intensity ?? defaultIntensity,
    },
  });

  const watchedIntensity = watch("intensity");
  const whoRecommendation = useMemo(() => getWhoRecommendation(age), [age]);

  // Calculate minutes per week from intensity
  const minutesPerWeek = useMemo(() => calculateMinutesPerWeek(watchedIntensity || 0, age), [watchedIntensity, age]);

  useEffect(() => {
    updateStepData({
      intensity: minutesPerWeek || 0,
    });
  }, [watchedIntensity, updateStepData]);

  // Handle slider change
  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const intensityPercentage = parseInt(event.target.value);
    setValue("intensity", intensityPercentage);
  };

  return (
    <div className="space-y-6">
      {/* Age Group and WHO Recommendation */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-lg mb-2">{whoRecommendation.ageGroup}</h3>
        <div className="space-y-2">
          <p className="text-sm text-gray-700">{whoRecommendation.description}</p>
          <p className="font-medium text-blue-700">
            WHO Recommendation: <span className="font-bold">{whoRecommendation.recommendation}</span>
          </p>
        </div>
      </div>

      {/* Intensity Selection */}
      <div>
        <Label htmlFor="intensity" className="text-base font-medium">
          How much of the WHO recommendation do you want to meet?
        </Label>

        <input
          id="intensity"
          type="range"
          min={10}
          max={150}
          step={10}
          value={watchedIntensity || 0}
          onChange={handleSliderChange}
          className="w-full mt-2"
        />

        {/* Hidden input for form data */}
        <input type="hidden" {...register("intensity", { valueAsNumber: true })} />

        {/* Intensity Display */}
        <div className="flex justify-between items-center mt-3">
          <div className="text-2xl font-bold text-blue-600">{watchedIntensity || 0}%</div>
          <div className="text-sm text-gray-600">
            {whoRecommendation.recommendation !== "N/A" && <span>≈ {minutesPerWeek} minutes/week</span>}
          </div>
        </div>

        {/* Progress indicators */}
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>10% (Minimum)</span>
          <span>80% (Moderate)</span>
          <span>150% (Above WHO)</span>
        </div>

        {/* Validation Errors */}
        {(formErrors.intensity || errors.intensity) && (
          <p className="text-red-500 text-sm mt-2">{formErrors.intensity?.message || String(errors.intensity)}</p>
        )}
      </div>
    </div>
  );
};
