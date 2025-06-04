import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import * as React from "react";
import { steps } from "../types";

interface ProgressBarProps {
  currentStepIndex: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStepIndex }) => {
  const totalSteps = steps.length;
  const progressValue = ((currentStepIndex + 1) / totalSteps) * 100;

  return (
    <div className="w-full mb-6 px-2 sm:px-0">
      {/* Top: Numeric and visual step indicator */}
      <div className="flex justify-between items-center mb-4">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isActive = index === currentStepIndex;

          return (
            <div key={step} className="flex-1 flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                  isCompleted
                    ? "bg-blue-500 text-white"
                    : isActive
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-200 text-gray-500",
                )}
              >
                {isCompleted ? "✓" : index + 1}
              </div>
              {index < totalSteps - 1 && (
                <div className="hidden sm:block w-full h-1 bg-transparent relative">
                  <div
                    className={cn(
                      "absolute top-1/2 transform -translate-y-1/2 w-full h-1 rounded-full",
                      index < currentStepIndex ? "bg-blue-500" : "bg-gray-200",
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom: Linear Progress Bar */}
      <Progress value={progressValue} className="h-2 bg-gray-200" />
    </div>
  );
};
