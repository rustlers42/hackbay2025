"use client";

import type React from "react";

import { type RegistrationData, tagsSchema } from "@/app/registration/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { BASE_API_URL } from "@/lib/api-config";
import { useFetchApi } from "@/lib/use-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRegistration } from "../context/RegistrationContext";

type InterestsFormData = Pick<RegistrationData, "tags">;

interface TagOption {
  id: number;
  name: string;
  emoji?: string;
}

export const InterestsStep: React.FC = () => {
  const { data, updateStepData } = useRegistration();

  const {
    data: options,
    isLoading,
    error,
  } = useFetchApi<TagOption[]>(BASE_API_URL + "/tags", {
    requireAuth: false,
  });

  const {
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InterestsFormData>({
    resolver: zodResolver(tagsSchema),
    defaultValues: {
      tags: data.tags || [],
    },
  });

  const selected = watch("tags");

  // Sync form data with registration context
  useEffect(() => {
    updateStepData({
      tags: selected,
    });
  }, [selected, updateStepData]);

  const toggleSelection = (interest: string) => {
    const current = getValues("tags") || [];
    const updated = current.includes(interest) ? current.filter((a) => a !== interest) : [...current, interest];

    setValue("tags", updated, { shouldValidate: true });
  };

  if (isLoading || !options) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600">Loading interests...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading interests. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <Label className="text-base sm:text-lg font-medium text-gray-700">Select your favorite interests:</Label>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">Choose activities you enjoy doing</p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:gap-3 max-h-48 sm:max-h-64 overflow-y-auto">
        {options.map((interest) => (
          <label
            key={interest.id}
            className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
          >
            <Checkbox
              checked={selected?.includes(interest.name)}
              onCheckedChange={() => toggleSelection(interest.name)}
              className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 w-4 h-4 sm:w-5 sm:h-5"
            />
            <span className="flex items-center gap-1 sm:gap-2 flex-1">
              {interest.emoji && <span className="text-lg sm:text-xl">{interest.emoji}</span>}
              <span className="capitalize font-medium text-gray-700 text-sm sm:text-base">{interest.name}</span>
            </span>
          </label>
        ))}
      </div>

      {selected && selected.length > 0 && (
        <div className="text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            {selected.length} interest{selected.length !== 1 ? "s" : ""} selected
          </p>
        </div>
      )}

      {errors.tags && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-xs sm:text-sm">{errors.tags.message}</p>
        </div>
      )}
    </div>
  );
};
