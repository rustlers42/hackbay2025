"use client";

import { interestsSchema, RegistrationData } from "@/app/registration/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useFetchApi } from "@/lib/use-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type InterestsFormData = Pick<RegistrationData, "interests">;

export const InterestsStep: React.FC = () => {
  const { data: options = [], isLoading, error } = useFetchApi<{ interest: string; id: string }[]>("/interests");
  const {
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InterestsFormData>({
    resolver: zodResolver(interestsSchema),
    defaultValues: {
      interests: [],
    },
  });

  const selected = watch("interests");

  const toggleSelection = (interest: string) => {
    const current = getValues("interests") || [];
    const updated = current.includes(interest) ? current.filter((a) => a !== interest) : [...current, interest];

    setValue("interests", updated, { shouldValidate: true });
  };

  if (isLoading || !options) return <p>Loading interests...</p>;
  if (error) return <p>Error loading interests.</p>;

  return (
    <div>
      <Label className="text-lg">Select your favorite interests:</Label>
      <div className="grid gap-3 mt-2">
        {options.map((interest) => (
          <label key={interest.id} className="flex items-center space-x-2">
            <Checkbox
              checked={selected?.includes(interest.interest)}
              onCheckedChange={() => toggleSelection(interest.interest)}
            />
            <span>{interest.interest}</span>
          </label>
        ))}
      </div>
      {errors.interests && <p className="text-red-500 text-sm">{errors.interests.message}</p>}
    </div>
  );
};
