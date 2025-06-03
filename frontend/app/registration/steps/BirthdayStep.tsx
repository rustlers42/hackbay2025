"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRegistration } from "../context/RegistrationContext";
import { birthdaySchema, RegistrationData } from "../types";

type BirthdayFormData = Pick<RegistrationData, "birthday">;

export const BirthdayStep: React.FC = () => {
  const { data, updateStepData, errors } = useRegistration();

  const {
    register,
    watch,
    formState: { errors: formErrors },
  } = useForm<BirthdayFormData>({
    resolver: zodResolver(birthdaySchema),
    defaultValues: {
      birthday: data.birthday || "",
    },
  });

  // Watch form values and sync with context in real-time
  const watchedBirthday = watch("birthday");

  useEffect(() => {
    // Update context data whenever form values change
    updateStepData({
      birthday: watchedBirthday,
    });
  }, [watchedBirthday, updateStepData]);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="birthday">Birthday</Label>
        <Input
          id="birthday"
          type="date"
          {...register("birthday")}
          autoFocus
          className={formErrors.birthday || errors.birthday ? "border-red-500" : ""}
        />
        {(formErrors.birthday || errors.birthday) && (
          <p className="text-red-500 text-sm mt-1">{formErrors.birthday?.message || errors.birthday}</p>
        )}
      </div>
    </div>
  );
};
