"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const germanHealthInsurances = ["AOK", "TK (Techniker Krankenkasse)", "Barmer", "DAK-Gesundheit", "KKH", "IKK classic"];

const registrationSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  birthday: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date",
  }),
  insuranceProvider: z.enum(["AOK", "TK (Techniker Krankenkasse)", "Barmer", "DAK-Gesundheit", "KKH", "IKK classic"]),
  insuranceNumber: z.string().regex(/^[A-Z]{1}[0-9]{9}$/i, "Invalid insurance number"),
  fitnessLevel: z.enum(["beginner", "intermediate", "pro"]),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export default function RegistrationForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = async (data: RegistrationFormData) => {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert("Registration successful!");
    } else {
      alert("Failed to register");
    }
  };

  return (
    <form onSubmit={handleSdfghjkubmit(onSubmit)} className="space-y-4 max-w-md mx-auto mt-8">
      <div>
        <Label>First Name</Label>
        <Input {...register("firstName")} />
        {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
      </div>
      <div>
        <Label>Last Name</Label>
        <Input {...register("lastName")} />
        {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
      </div>
      <div>
        <Label>Birthday</Label>
        <Input type="date" {...register("birthday")} />
        {errors.birthday && <p className="text-red-500">{errors.birthday.message}</p>}
      </div>

      <div>
        <Label>Insurance Provider</Label>
        <Select onValueChange={(val) => setValue("insuranceProvider", val as any)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a provider" />
          </SelectTrigger>
          <SelectContent>
            {germanHealthInsurances.map((provider) => (
              <SelectItem key={provider} value={provider}>
                {provider}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.insuranceProvider && <p className="text-red-500">{errors.insuranceProvider.message}</p>}
      </div>

      <div>
        <Label>Insurance Number</Label>
        <Input {...register("insuranceNumber")} placeholder="e.g., A123456789" />
        {errors.insuranceNumber && <p className="text-red-500">{errors.insuranceNumber.message}</p>}
      </div>

      <div>
        <Label>Fitness Level</Label>
        <RadioGroup defaultValue="beginner" onValueChange={(val) => setValue("fitnessLevel", val as any)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="beginner" id="beginner" />
            <Label htmlFor="beginner">Beginner</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="intermediate" id="intermediate" />
            <Label htmlFor="intermediate">Intermediate</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pro" id="pro" />
            <Label htmlFor="pro">Pro</Label>
          </div>
        </RadioGroup>
        {errors.fitnessLevel && <p className="text-red-500">{errors.fitnessLevel.message}</p>}
      </div>

      <Button type="submit">Register</Button>
    </form>
  );
}
