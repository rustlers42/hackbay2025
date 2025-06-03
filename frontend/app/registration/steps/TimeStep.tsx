"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRegistration } from "../context/RegistrationContext";
import { RegistrationData, timeSchema } from "../types";

type TimeFormData = Pick<RegistrationData, "startTime" | "endTime">;

export const TimeStep: React.FC = () => {
  const { data, updateStepData, errors } = useRegistration();

  const {
    register,
    watch,
    formState: { errors: formErrors },
  } = useForm<TimeFormData>({
    resolver: zodResolver(timeSchema),
    defaultValues: {
      startTime: data.startTime || "",
      endTime: data.endTime || "",
    },
  });

  // Watch form values and sync with context in real-time
  const watchedStartTime = watch("startTime");
  const watchedEndTime = watch("endTime");

  useEffect(() => {
    // Update context data whenever form values change
    updateStepData({
      startTime: watchedStartTime,
      endTime: watchedEndTime,
    });
  }, [watchedStartTime, watchedEndTime, updateStepData]);

  return (
    <div className="space-y-4">
      <div>
        <Label>When are you usually available for sports?</Label>
        <div className="flex space-x-4 items-center mt-2">
          <div className="flex flex-col flex-1">
            <Label htmlFor="startTime" className="text-sm mb-1">
              From
            </Label>
            <Input
              id="startTime"
              type="time"
              {...register("startTime")}
              autoFocus
              className={formErrors.startTime || errors.startTime ? "border-red-500" : ""}
            />
            {(formErrors.startTime || errors.startTime) && (
              <p className="text-red-500 text-sm mt-1">{formErrors.startTime?.message || errors.startTime}</p>
            )}
          </div>

          <div className="flex flex-col flex-1">
            <Label htmlFor="endTime" className="text-sm mb-1">
              To
            </Label>
            <Input
              id="endTime"
              type="time"
              {...register("endTime")}
              className={formErrors.endTime || errors.endTime ? "border-red-500" : ""}
            />
            {(formErrors.endTime || errors.endTime) && (
              <p className="text-red-500 text-sm mt-1">{formErrors.endTime?.message || errors.endTime}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
