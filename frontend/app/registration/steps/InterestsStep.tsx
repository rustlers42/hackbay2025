"use client";

import { RegistrationData, tagsSchema } from "@/app/registration/types";
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

  if (isLoading || !options) return <p>Loading interests...</p>;
  if (error) return <p>Error loading interests.</p>;

  console.log(options);

  return (
    <div>
      <Label className="text-lg">Select your favorite interests:</Label>
      <div className="grid gap-3 mt-2">
        {options.map((interest) => (
          <label key={interest.id} className="flex items-center space-x-2">
            <Checkbox
              checked={selected?.includes(interest.name)}
              onCheckedChange={() => toggleSelection(interest.name)}
            />
            <span className="flex items-center gap-2">
              {interest.emoji && <span className="text-lg">{interest.emoji}</span>}
              <span className="capitalize">{interest.name}</span>
            </span>
          </label>
        ))}
      </div>
      {errors.tags && <p className="text-red-500 text-sm">{errors.tags.message}</p>}
    </div>
  );
};
