"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRegistration } from "../context/RegistrationContext";
import { locationSchema, RegistrationData } from "../types";

type LocationFormData = Pick<RegistrationData, "location">;

export const LocationStep: React.FC = () => {
  const { data, updateStepData, errors } = useRegistration();

  const {
    register,
    watch,
    formState: { errors: formErrors },
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      location: data.location || "",
    },
  });

  // Watch form values and sync with context in real-time
  const watchedLocation = watch("location");

  useEffect(() => {
    // Update context data whenever form values change
    updateStepData({
      location: watchedLocation,
    });
  }, [watchedLocation, updateStepData]);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="location">Where do you live?</Label>
        <Input
          id="location"
          {...register("location")}
          placeholder="City or area"
          autoFocus
          className={formErrors.location || errors.location ? "border-red-500" : ""}
        />
        {(formErrors.location || errors.location) && (
          <p className="text-red-500 text-sm mt-1">{formErrors.location?.message || errors.location}</p>
        )}
      </div>
    </div>
  );
};
