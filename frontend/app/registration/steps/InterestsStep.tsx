"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRegistration } from "../context/RegistrationContext";
import { interestsSchema, RegistrationData } from "../types";

type InterestsFormData = Pick<RegistrationData, "interests">;

export const InterestsStep: React.FC = () => {
  const { data, updateStepData, errors } = useRegistration();

  const {
    register,
    watch,
    formState: { errors: formErrors },
  } = useForm<InterestsFormData>({
    resolver: zodResolver(interestsSchema),
    defaultValues: {
      interests: data.interests || "",
    },
  });

  // Watch form values and sync with context in real-time
  const watchedinterests = watch("interests");

  useEffect(() => {
    // Update context data whenever form values change
    updateStepData({
      interests: watchedinterests,
    });
  }, [watchedinterests, updateStepData]);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="interests">Your favorite sports or interests</Label>
        <Input
          id="interests"
          {...register("interests")}
          placeholder="e.g. Yoga, Running, Bouldering..."
          autoFocus
          className={formErrors.interests || errors.interests ? "border-red-500" : ""}
        />
        {(formErrors.interests || errors.interests) && (
          <p className="text-red-500 text-sm mt-1">{formErrors.interests?.message || errors.interests}</p>
        )}
      </div>
    </div>
  );
};
