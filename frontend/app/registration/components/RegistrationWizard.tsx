"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { useRegistration } from "../context/RegistrationContext";
import {
  ActivitiesStep,
  BirthdayStep,
  FitnessStep,
  InsuranceStep,
  LocationStep,
  NameStep,
  ReviewStep,
  TimeStep,
} from "../steps";
import { Step, steps } from "../types";

// Map steps to their corresponding components
const stepComponents: Record<Step, React.ComponentType> = {
  name: NameStep,
  birthday: BirthdayStep,
  insurance: InsuranceStep,
  fitness: FitnessStep,
  activities: ActivitiesStep,
  location: LocationStep,
  time: TimeStep,
  review: ReviewStep,
};

// Step titles and descriptions
const stepInfo: Record<Step, { title: string; description: string }> = {
  name: {
    title: "Personal Information",
    description: "Let's start with your name",
  },
  birthday: {
    title: "Birthday",
    description: "When were you born?",
  },
  insurance: {
    title: "Insurance Information",
    description: "Your insurance details (optional)",
  },
  fitness: {
    title: "Fitness Level",
    description: "How would you describe your fitness level?",
  },
  activities: {
    title: "Favorite Activities",
    description: "What sports or activities do you enjoy?",
  },
  location: {
    title: "Location",
    description: "Where are you located?",
  },
  time: {
    title: "Availability",
    description: "When are you usually available?",
  },
  review: {
    title: "Review & Submit",
    description: "Please review your information before submitting",
  },
};

export const RegistrationWizard: React.FC = () => {
  const {
    currentStep,
    currentStepIndex,
    nextStep,
    previousStep,
    canSkipCurrentStep,
    submitRegistration,
    errors,
    isLoading,
  } = useRegistration();

  const CurrentStepComponent = stepComponents[currentStep];
  const { title, description } = stepInfo[currentStep];
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleNext = async () => {
    if (isLastStep) {
      await submitRegistration();
    } else {
      await nextStep();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    }
  };

  return (
    <div className="max-w-xl w-full mx-auto mt-10">
      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-blue-500 transition-all duration-300 ease-out"
          style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
        />
      </div>

      <Card className="min-h-[420px] flex flex-col justify-between">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>

        <CardContent className="flex-1" onKeyDown={handleKeyDown}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="h-full"
            >
              <CurrentStepComponent />
            </motion.div>
          </AnimatePresence>

          {/* Display submission errors */}
          {errors.submit && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">{errors.submit}</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          {/* Back Button */}
          {currentStepIndex > 0 ? (
            <Button type="button" variant="outline" onClick={previousStep} disabled={isLoading}>
              Back
            </Button>
          ) : (
            <div />
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2">
            {/* Skip Button */}
            {canSkipCurrentStep && !isLastStep && (
              <Button type="button" variant="ghost" onClick={nextStep} disabled={isLoading}>
                Skip
              </Button>
            )}

            {/* Next/Submit Button */}
            <Button type="button" onClick={handleNext} disabled={isLoading} className="min-w-[80px]">
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : isLastStep ? (
                "Submit"
              ) : (
                "Next"
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
