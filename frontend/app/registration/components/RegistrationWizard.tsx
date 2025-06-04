"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { useRegistration } from "../context/RegistrationContext";
import { InterestsStep, PersonalStep, WhoStep } from "../steps";
import { type Step, steps } from "../types";

// Map steps to their corresponding components
const stepComponents: Record<Step, React.ComponentType> = {
  personal: PersonalStep,
  who: WhoStep,
  tag: InterestsStep,
};

// Step titles and descriptions
const stepInfo: Record<Step, { title: string; description: string }> = {
  personal: {
    title: "Personal Information",
    description: "Let's start with your basic details",
  },
  who: {
    title: "Activity Goals",
    description: "Set your physical activity targets",
  },
  tag: {
    title: "Your Interests",
    description: "What activities do you enjoy?",
  },
};

export const RegistrationWizard: React.FC = () => {
  const { currentStep, currentStepIndex, nextStep, previousStep, submitRegistration, errors, isLoading } =
    useRegistration();

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-8 px-2">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4"
          >
            <span>
              Step {currentStepIndex + 1} of {steps.length}
            </span>
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Join MeetMatch</h1>
          <p className="text-sm sm:text-base text-gray-600">Connect with like-minded people in your area</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full mb-4 sm:mb-8 px-2">
          <div className="flex justify-between items-center mb-2">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all ${
                    index <= currentStepIndex ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {index < currentStepIndex ? "✓" : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 sm:w-16 h-1 mx-1 sm:mx-2 rounded-full transition-all ${
                      index < currentStepIndex ? "bg-blue-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm min-h-[400px] sm:min-h-[500px] flex flex-col justify-between mx-2 sm:mx-0">
            <CardHeader className="pb-4 sm:pb-6 px-4 sm:px-6">
              <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">{title}</CardTitle>
              <CardDescription className="text-sm sm:text-lg text-gray-600">{description}</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 px-4 sm:px-8" onKeyDown={handleKeyDown}>
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
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{errors.submit}</p>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-between px-4 sm:px-8 pb-4 sm:pb-8 pt-4">
              {/* Back Button */}
              {currentStepIndex > 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={previousStep}
                  disabled={isLoading}
                  className="flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base px-3 sm:px-4 py-2"
                >
                  <span>←</span>
                  <span className="hidden sm:inline">Back</span>
                </Button>
              ) : (
                <div />
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2">
                {/* Next/Submit Button */}
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isLoading}
                  className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 min-w-[100px] sm:min-w-[120px] text-sm sm:text-base px-4 sm:px-6 py-2"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs sm:text-sm">Loading...</span>
                    </div>
                  ) : (
                    <>
                      <span>{isLastStep ? "Complete" : "Continue"}</span>
                      {!isLastStep && <span className="hidden sm:inline">→</span>}
                    </>
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-4 sm:mt-8 text-xs sm:text-sm text-gray-500 px-2">
          <p>
            Already have an account?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
