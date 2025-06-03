"use client";

import { BASE_API_URL } from "@/lib/api-config";
import { useRouter } from "next/navigation";
import React, { createContext, useCallback, useContext, useState } from "react";
import { birthdaySchema, nameSchema, RegistrationData, skippableSteps, Step, steps, stepSchemas } from "../types";

interface RegistrationContextType {
  currentStep: Step;
  currentStepIndex: number;
  data: Partial<RegistrationData>;
  errors: Record<string, string>;
  isLoading: boolean;

  // Navigation
  nextStep: () => Promise<boolean>;
  previousStep: () => void;
  goToStep: (step: Step) => void;
  canSkipCurrentStep: boolean;

  // Data management
  updateStepData: <T extends keyof RegistrationData>(stepData: Pick<RegistrationData, T>) => void;
  validateCurrentStep: () => Promise<boolean>;

  // Form submission
  submitRegistration: () => Promise<void>;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export const useRegistration = (): RegistrationContextType => {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error("useRegistration must be used within a RegistrationProvider");
  }
  return context;
};

interface RegistrationProviderProps {
  children: React.ReactNode;
}

export const RegistrationProvider: React.FC<RegistrationProviderProps> = ({ children }) => {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [data, setData] = useState<Partial<RegistrationData>>({
    fitnessLevel: "beginner", // Default value
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const currentStep = steps[currentStepIndex];
  const canSkipCurrentStep = skippableSteps.includes(currentStep);

  const updateStepData = useCallback(<T extends keyof RegistrationData>(stepData: Pick<RegistrationData, T>) => {
    setData((prev) => ({ ...prev, ...stepData }));
    setErrors({}); // Clear errors when data changes
  }, []);

  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    try {
      const schema = stepSchemas[currentStep];
      const stepData = data;

      const result = schema.safeParse(stepData);

      if (!result.success) {
        const newErrors: Record<string, string> = {};
        result.error.errors.forEach((error) => {
          if (error.path.length > 0) {
            newErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(newErrors);
        return false;
      }

      setErrors({});
      return true;
    } catch (error) {
      console.error("Validation error:", error);
      return false;
    }
  }, [currentStep, data]);

  const nextStep = useCallback(async (): Promise<boolean> => {
    const isValid = await validateCurrentStep();

    if (isValid || canSkipCurrentStep) {
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
        return true;
      }
    }

    return false;
  }, [currentStepIndex, validateCurrentStep, canSkipCurrentStep]);

  const previousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setErrors({}); // Clear errors when going back
    }
  }, [currentStepIndex]);

  const goToStep = useCallback((step: Step) => {
    const stepIndex = steps.indexOf(step);
    if (stepIndex !== -1) {
      setCurrentStepIndex(stepIndex);
      setErrors({});
    }
  }, []);

  const submitRegistration = useCallback(async () => {
    try {
      setIsLoading(true);

      // Final validation of all data
      const requiredSchema = nameSchema.merge(birthdaySchema);
      const result = requiredSchema.safeParse(data);
      if (!result.success) {
        throw new Error("Please complete all required fields");
      }

      // Clean up insurance data if not provided
      const submissionData = { ...data };

      console.log(submissionData);

      const response = await fetch(BASE_API_URL + "/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        console.log(await response.json());
        throw new Error("Registration failed. Please try again.");
      }

      // Handle successful registration
      router.push("/events/map");
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({
        submit: error instanceof Error ? error.message : "Registration failed",
      });
    } finally {
      setIsLoading(false);
    }
  }, [data, router]);

  const value: RegistrationContextType = {
    currentStep,
    currentStepIndex,
    data,
    errors,
    isLoading,
    nextStep,
    previousStep,
    goToStep,
    canSkipCurrentStep,
    updateStepData,
    validateCurrentStep,
    submitRegistration,
  };

  return <RegistrationContext.Provider value={value}>{children}</RegistrationContext.Provider>;
};
