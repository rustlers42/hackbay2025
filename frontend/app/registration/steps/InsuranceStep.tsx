"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRegistration } from "../context/RegistrationContext";
import { insuranceProviders, insuranceSchema, RegistrationData } from "../types";

type InsuranceFormData = Pick<RegistrationData, "insuranceProvider" | "insuranceNumber">;

export const InsuranceStep: React.FC = () => {
  const { data, updateStepData, errors } = useRegistration();

  const {
    register,
    setValue,
    watch,
    formState: { errors: formErrors },
  } = useForm<InsuranceFormData>({
    resolver: zodResolver(insuranceSchema),
    defaultValues: {
      insuranceProvider: data.insuranceProvider || undefined,
      insuranceNumber: data.insuranceNumber || "",
    },
  });

  // Watch form values and sync with context in real-time
  const watchedProvider = watch("insuranceProvider");
  const watchedNumber = watch("insuranceNumber");

  useEffect(() => {
    // Update context data whenever form values change
    updateStepData({
      insuranceProvider: watchedProvider,
      insuranceNumber: watchedNumber,
    });
  }, [watchedProvider, watchedNumber, updateStepData]);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="insuranceProvider">Insurance Provider</Label>
        <Select value={watchedProvider || ""} onValueChange={(value) => setValue("insuranceProvider", value as any)}>
          <SelectTrigger className={formErrors.insuranceProvider || errors.insuranceProvider ? "border-red-500" : ""}>
            <SelectValue placeholder="Select your insurance provider" />
          </SelectTrigger>
          <SelectContent>
            {insuranceProviders.map((provider) => (
              <SelectItem key={provider} value={provider}>
                {provider}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(formErrors.insuranceProvider || errors.insuranceProvider) && (
          <p className="text-red-500 text-sm mt-1">
            {formErrors.insuranceProvider?.message || errors.insuranceProvider}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="insuranceNumber">Insurance Number</Label>
        <Input
          id="insuranceNumber"
          {...register("insuranceNumber")}
          placeholder="A123456789"
          className={formErrors.insuranceNumber || errors.insuranceNumber ? "border-red-500" : ""}
        />
        {(formErrors.insuranceNumber || errors.insuranceNumber) && (
          <p className="text-red-500 text-sm mt-1">{formErrors.insuranceNumber?.message || errors.insuranceNumber}</p>
        )}
      </div>
    </div>
  );
};
