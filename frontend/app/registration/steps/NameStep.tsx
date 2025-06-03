"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRegistration } from "../context/RegistrationContext";
import { nameSchema, RegistrationData } from "../types";

type NameFormData = Pick<RegistrationData, "firstName" | "lastName">;

export const NameStep: React.FC = () => {
  const { data, updateStepData, errors } = useRegistration();

  const {
    register,
    watch,
    formState: { errors: formErrors },
  } = useForm<NameFormData>({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
    },
  });

  // Watch form values and sync with context in real-time
  const watchedFirstName = watch("firstName");
  const watchedLastName = watch("lastName");

  useEffect(() => {
    // Update context data whenever form values change
    updateStepData({
      firstName: watchedFirstName,
      lastName: watchedLastName,
    });
  }, [watchedFirstName, watchedLastName, updateStepData]);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          {...register("firstName")}
          autoFocus
          className={formErrors.firstName || errors.firstName ? "border-red-500" : ""}
        />
        {(formErrors.firstName || errors.firstName) && (
          <p className="text-red-500 text-sm mt-1">{formErrors.firstName?.message || errors.firstName}</p>
        )}
      </div>

      <div>
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          {...register("lastName")}
          className={formErrors.lastName || errors.lastName ? "border-red-500" : ""}
        />
        {(formErrors.lastName || errors.lastName) && (
          <p className="text-red-500 text-sm mt-1">{formErrors.lastName?.message || errors.lastName}</p>
        )}
      </div>
    </div>
  );
};
