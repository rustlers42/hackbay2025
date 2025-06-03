"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRegistration } from "../context/RegistrationContext";
import { activitiesSchema, RegistrationData } from "../types";

type ActivitiesFormData = Pick<RegistrationData, "activities">;

export const ActivitiesStep: React.FC = () => {
  const { data, updateStepData, errors } = useRegistration();

  const {
    register,
    watch,
    formState: { errors: formErrors },
  } = useForm<ActivitiesFormData>({
    resolver: zodResolver(activitiesSchema),
    defaultValues: {
      activities: data.activities || "",
    },
  });

  // Watch form values and sync with context in real-time
  const watchedActivities = watch("activities");

  useEffect(() => {
    // Update context data whenever form values change
    updateStepData({
      activities: watchedActivities,
    });
  }, [watchedActivities, updateStepData]);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="activities">Your favorite sports or activities</Label>
        <Input
          id="activities"
          {...register("activities")}
          placeholder="e.g. Yoga, Running, Bouldering..."
          autoFocus
          className={formErrors.activities || errors.activities ? "border-red-500" : ""}
        />
        {(formErrors.activities || errors.activities) && (
          <p className="text-red-500 text-sm mt-1">{formErrors.activities?.message || errors.activities}</p>
        )}
      </div>
    </div>
  );
};
