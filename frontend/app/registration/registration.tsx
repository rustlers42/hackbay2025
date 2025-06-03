"use client";
import { insuranceProviders, skippableSteps, Step, steps } from "@/app/registration/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const stepFields: Record<Step, (keyof RegistrationFormData)[]> = {
  name: ["firstName", "lastName"],
  birthday: ["birthday"],
  insurance: ["insuranceProvider", "insuranceNumber"],
  fitness: ["fitnessLevel"],
  activities: ["activities"],
  location: ["location"],
  time: ["startTime", "endTime"],
  review: [],
};

const formSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  birthday: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  insuranceProvider: z.enum(insuranceProviders as [string, ...string[]]),
  insuranceNumber: z.string().regex(/^[A-Z]{1}[0-9]{9}$/i, "Invalid insurance number"),
  fitnessLevel: z.enum(["beginner", "intermediate", "pro"]).optional(),
  activities: z.string().optional(),
  location: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

type RegistrationFormData = z.infer<typeof formSchema>;

function handleLogin() {
  /*!todo;*/
}

export default function RegistrationWizard() {
  const [stepIndex, setStepIndex] = useState(0);
  const currentStep = steps[stepIndex];

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      fitnessLevel: "beginner",
    },
  });

  const next = async () => {
    const fieldsToValidate = stepFields[currentStep];
    const valid = await trigger(fieldsToValidate);
    if (valid || skippableSteps.includes(currentStep)) {
      setStepIndex((i) => Math.min(i + 1, steps.length - 1));
    }
  };

  const prev = () => setStepIndex((i) => Math.max(i - 1, 0));
  const skip = () => setStepIndex((i) => i + 1);

  const onSubmit = async (data: RegistrationFormData) => {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    alert(res.ok ? "Registered!" : "Registration failed.");
    handleLogin();
    redirect("events/map");
  };

  return (
    <form className="max-w-xl w-full mx-auto mt-10">
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
        />
      </div>

      <Card className="min-h-[420px] flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="capitalize">Step: {currentStep}</CardTitle>
          <CardDescription>Please fill in the information for this step.</CardDescription>
        </CardHeader>

        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {currentStep === "name" && (
                <>
                  <Label>First Name</Label>
                  <Input {...register("firstName")} />
                  {errors.firstName && <p className="text-red-500 max-w-[100%]">{errors.firstName.message}</p>}

                  <Label className="mt-2">Last Name</Label>
                  <Input {...register("lastName")} />
                  {errors.lastName && <p className="text-red-500 max-w-[100%]">{errors.lastName.message}</p>}
                </>
              )}

              {currentStep === "birthday" && (
                <>
                  <Label>Birthday</Label>
                  <Input type="date" {...register("birthday")} />
                  {errors.birthday && <p className="text-red-500 max-w-[100%]">{errors.birthday.message}</p>}
                </>
              )}

              {currentStep === "insurance" && (
                <>
                  <Label>Insurance Provider</Label>
                  <select {...register("insuranceProvider")} className="w-full border p-2 rounded">
                    <option value="">Select</option>
                    {insuranceProviders.map((provider) => (
                      <option key={provider} value={provider}>
                        {provider}
                      </option>
                    ))}
                  </select>
                  {errors.insuranceProvider && (
                    <p className="text-red-500 max-w-[100%]">{errors.insuranceProvider.message}</p>
                  )}

                  <Label className="mt-4">Insurance Number</Label>
                  <Input {...register("insuranceNumber")} placeholder="A123456789" />
                  {errors.insuranceNumber && (
                    <p className="text-red-500 max-w-[100%]">{errors.insuranceNumber.message}</p>
                  )}
                </>
              )}

              {currentStep === "fitness" && (
                <>
                  <Label>Fitness Level</Label>
                  <RadioGroup
                    defaultValue="beginner"
                    onValueChange={(val) => setValue("fitnessLevel", val as "beginner" | "intermediate" | "pro")}
                  >
                    {["beginner", "intermediate", "pro"].map((level) => (
                      <div className="flex items-center space-x-2" key={level}>
                        <RadioGroupItem value={level} id={level} {...register("fitnessLevel")} />
                        <Label htmlFor={level} className="capitalize">
                          {level}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </>
              )}

              {currentStep === "activities" && (
                <>
                  <Label>Your favorite sports or activities</Label>
                  <Input {...register("activities")} placeholder="e.g. Yoga, Running, Bouldering..." />
                  {errors.activities && <p className="text-red-500 max-w-[100%]">{errors.activities.message}</p>}
                </>
              )}

              {currentStep === "location" && (
                <>
                  <Label>Where do you live?</Label>
                  <Input {...register("location")} placeholder="City or area" />
                  {errors.location && <p className="text-red-500 max-w-[100%]">{errors.location.message}</p>}
                </>
              )}

              {currentStep === "time" && (
                <>
                  <Label>When are you usually available for sports?</Label>
                  <div className="flex space-x-4 items-center">
                    <div className="flex flex-col">
                      <span className="text-sm mb-1">From</span>
                      <Input type="time" {...register("startTime")} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm mb-1">To</span>
                      <Input type="time" {...register("endTime")} />
                    </div>
                  </div>
                </>
              )}

              {currentStep === "review" && (
                <div className="space-y-2 text-sm text-gray-800">
                  <p>
                    <strong>Name:</strong> {getValues().firstName} {getValues().lastName}
                  </p>
                  <p>
                    <strong>Birthday:</strong> {getValues().birthday}
                  </p>
                  <p>
                    <strong>Insurance:</strong>{" "}
                    {getValues().insuranceProvider && getValues().insuranceNumber
                      ? `${getValues().insuranceProvider} - ${getValues().insuranceNumber}`
                      : "N/A"}
                  </p>
                  <p>
                    <strong>Fitness Level:</strong> {getValues().fitnessLevel || "N/A"}
                  </p>
                  <p>
                    <strong>Activities:</strong> {getValues().activities || "N/A"}
                  </p>
                  <p>
                    <strong>Location:</strong> {getValues().location || "N/A"}
                  </p>
                  <p>
                    <strong>Available Time:</strong>{" "}
                    {getValues().startTime && getValues().endTime
                      ? `${getValues().startTime} - ${getValues().endTime}`
                      : "N/A"}
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>

        <CardFooter className="flex justify-between">
          {stepIndex > 0 ? (
            <Button type="button" variant="outline" onClick={prev}>
              Back
            </Button>
          ) : (
            <div />
          )}

          <div className="flex space-x-2">
            {skippableSteps.includes(currentStep) && (
              <Button type="button" variant="ghost" onClick={skip}>
                Skip
              </Button>
            )}

            {stepIndex < steps.length - 1 ? (
              <Button type="button" onClick={next}>
                Next
              </Button>
            ) : (
              <Button type="submit" onClick={handleSubmit(onSubmit)}>
                Submit
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
