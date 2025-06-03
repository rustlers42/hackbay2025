"use client";

import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRegistration } from "../context/RegistrationContext";
import { RegistrationData, whoSchema } from "../types";

type WhoFormData = Pick<RegistrationData, "intensity">;

export const WhoStep: React.FC = () => {
  const { data, updateStepData, errors } = useRegistration();

  const {
    getValues,
    watch,
    register,
    formState: { errors: formErrors },
  } = useForm<WhoFormData>({
    resolver: zodResolver(whoSchema),
    defaultValues: {
      intensity: data.intensity ?? 40,
    },
  });

  const watchedIntensity = watch("intensity");

  useEffect(() => {
    updateStepData({
      intensity: watchedIntensity,
    });
  }, [watchedIntensity, updateStepData]);

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="intensity"></Label>
        <input
          id="intensity"
          type="range"
          min={0}
          max={100}
          step={10}
          {...register("intensity", { valueAsNumber: true })}
          className="w-full mt-2"
        />

        {/* Validation Errors */}
        {(formErrors.intensity || errors.intensity) && (
          <p className="text-red-500 text-sm mt-2">{formErrors.intensity?.message || errors.intensity}</p>
        )}
      </div>
      <div>{`${getValues().intensity || "0"}%`}</div>
    </div>
  );
};
