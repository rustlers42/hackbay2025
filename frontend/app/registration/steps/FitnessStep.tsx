"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRegistration } from "../context/RegistrationContext";
import { fitnessSchema, RegistrationData } from "../types";

type FitnessFormData = Pick<RegistrationData, "fitnessLevel">;

const fitnessLevels = ["beginner", "intermediate", "pro"] as const;

export const FitnessStep: React.FC = () => {
  const { data, updateStepData, errors } = useRegistration();

  const {
    setValue,
    watch,
    formState: { errors: formErrors },
  } = useForm<FitnessFormData>({
    resolver: zodResolver(fitnessSchema),
    defaultValues: {
      fitnessLevel: data.fitnessLevel || "beginner",
    },
  });

  // Watch form values and sync with context in real-time
  const watchedLevel = watch("fitnessLevel");

  useEffect(() => {
    // Update context data whenever form values change
    updateStepData({
      fitnessLevel: watchedLevel,
    });
  }, [watchedLevel, updateStepData]);

  return (
    <div className="space-y-4">
      <div>
        <Label>Fitness Level</Label>
        <RadioGroup
          value={watchedLevel || "beginner"}
          onValueChange={(value) => setValue("fitnessLevel", value as "beginner" | "intermediate" | "pro")}
          className="mt-2"
        >
          {fitnessLevels.map((level) => (
            <div key={level} className="flex items-center space-x-2">
              <RadioGroupItem value={level} id={level} />
              <Label htmlFor={level} className="capitalize cursor-pointer">
                {level}
              </Label>
            </div>
          ))}
        </RadioGroup>
        {(formErrors.fitnessLevel || errors.fitnessLevel) && (
          <p className="text-red-500 text-sm mt-1">{formErrors.fitnessLevel?.message || errors.fitnessLevel}</p>
        )}
      </div>
    </div>
  );
};
