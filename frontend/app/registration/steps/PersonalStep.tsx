"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRegistration } from "../context/RegistrationContext";
import { personalSchema, type RegistrationData } from "../types";

type PersonalFormData = Pick<RegistrationData, "username" | "email" | "birthday" | "password">;

export const PersonalStep: React.FC = () => {
  const { data, updateStepData, errors } = useRegistration();

  const {
    register,
    watch,
    formState: { errors: formErrors },
  } = useForm<PersonalFormData>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      username: data.username || "",
      email: data.email || "",
      birthday: data.birthday || "",
      password: data.password || "",
    },
  });

  // Watch form values and sync with context in real-time
  const watchedName = watch("username");
  const watchedEmail = watch("email");
  const watchedBirthday = watch("birthday");
  const watchedPassword = watch("password");

  useEffect(() => {
    // Update context data whenever form values change
    updateStepData({
      username: watchedName,
      email: watchedEmail,
      birthday: watchedBirthday,
      password: watchedPassword,
    });
  }, [watchedName, watchedEmail, watchedBirthday, watchedPassword, updateStepData]);

  return (
    <form className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="username" className="text-sm font-medium text-gray-700">
          Name
        </Label>
        <Input
          id="username"
          {...register("username")}
          autoComplete="name"
          autoFocus
          className={`px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            formErrors.username || errors.username ? "border-red-500 focus:ring-red-500" : ""
          }`}
          placeholder="Enter your full name"
        />
        {(formErrors.username || errors.username) && (
          <p className="text-red-500 text-sm mt-1">{formErrors.username?.message || errors.username}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          autoComplete="email"
          className={`px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            formErrors.email || errors.email ? "border-red-500 focus:ring-red-500" : ""
          }`}
          placeholder="Enter your email address"
        />
        {(formErrors.email || errors.email) && (
          <p className="text-red-500 text-sm mt-1">{formErrors.email?.message || errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="birthday" className="text-sm font-medium text-gray-700">
          Birthday
        </Label>
        <Input
          id="birthday"
          type="date"
          {...register("birthday")}
          autoComplete="bday"
          className={`px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            formErrors.birthday || errors.birthday ? "border-red-500 focus:ring-red-500" : ""
          }`}
        />
        {(formErrors.birthday || errors.birthday) && (
          <p className="text-red-500 text-sm mt-1">{formErrors.birthday?.message || errors.birthday}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          {...register("password")}
          autoComplete="new-password"
          className={`px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            formErrors.password || errors.password ? "border-red-500 focus:ring-red-500" : ""
          }`}
          placeholder="Create a secure password"
        />
        {(formErrors.password || errors.password) && (
          <p className="text-red-500 text-sm mt-1">{formErrors.password?.message || errors.password}</p>
        )}
      </div>
    </form>
  );
};
