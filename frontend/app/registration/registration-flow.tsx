"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { RegistrationProvider } from "./context/RegistrationContext";
import { InterestsStep } from "./steps/InterestsStep";
import { PersonalStep } from "./steps/PersonalStep";
import { WhoStep } from "./steps/WhoStep";
import type { RegistrationData } from "./types";

const steps = [
  {
    name: "Personal",
    component: PersonalStep,
  },
  {
    name: "Interests",
    component: InterestsStep,
  },
  {
    name: "Who",
    component: WhoStep,
  },
];

export default function RegistrationFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<RegistrationData>({
    username: "",
    email: "",
    birthday: "",
    password: "",
    tags: [],
  });
  const [errors, setErrors] = useState<Partial<RegistrationData>>({});

  const StepComponent = steps[currentStep].component;

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    alert(JSON.stringify(data));
  };

  return (
    <RegistrationProvider>
      <div className="container h-screen flex items-center justify-center">
        <Card className="w-[500px]">
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>
              Step {currentStep + 1} of {steps.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <StepComponent />
          </CardContent>
          <div className="flex justify-between p-4">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
              Previous
            </Button>
            {currentStep === steps.length - 1 ? (
              <Button onClick={handleSubmit}>Submit</Button>
            ) : (
              <Button onClick={nextStep}>Next</Button>
            )}
          </div>
        </Card>
      </div>
    </RegistrationProvider>
  );
}
