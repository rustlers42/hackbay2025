"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRegistration } from "../context/RegistrationContext";
import { personalSchema, RegistrationData } from "../types";

type PersonalFormData = Pick<RegistrationData, "name" | "email" | "birthday">;

export const PersonalStep: React.FC = () => {
  const { data, updateStepData, errors } = useRegistration();

  const {
    register,
    watch,
    formState: { errors: formErrors },
  } = useForm<PersonalFormData>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      name: data.name || "",
      email: data.email || "",
      birthday: data.birthday || "",
    },
  });

  // Watch form values and sync with context in real-time
  const watchedName = watch("name");
  const watchedEmail = watch("email");
  const watchedBirthday = watch("birthday");

  useEffect(() => {
    // Update context data whenever form values change
    updateStepData({
      name: watchedName,
      email: watchedEmail,
      birthday: watchedBirthday,
    });
  }, [watchedName, watchedEmail, watchedBirthday, updateStepData]);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          {...register("name")}
          autoFocus
          className={formErrors.name || errors.name ? "border-red-500" : ""}
        />
        {(formErrors.name || errors.name) && (
          <p className="text-red-500 text-sm mt-1">{formErrors.name?.message || errors.name}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" {...register("email")} className={formErrors.email || errors.email ? "border-red-500" : ""} />
        {(formErrors.email || errors.email) && (
          <p className="text-red-500 text-sm mt-1">{formErrors.email?.message || errors.email}</p>
        )}
      </div>

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
