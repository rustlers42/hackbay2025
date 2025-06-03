"use client";

import React from "react";
import { useRegistration } from "../context/RegistrationContext";

export const ReviewStep: React.FC = () => {
  const { data } = useRegistration();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Please review your information</h3>

      <div className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <span className="font-medium text-gray-700">Name:</span>
          <span>
            {data.firstName} {data.lastName}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <span className="font-medium text-gray-700">Birthday:</span>
          <span>{data.birthday ? new Date(data.birthday).toLocaleDateString() : "N/A"}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <span className="font-medium text-gray-700">Insurance:</span>
          <span>
            {data.insuranceProvider && data.insuranceNumber
              ? `${data.insuranceProvider} - ${data.insuranceNumber}`
              : "Not provided"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <span className="font-medium text-gray-700">Fitness Level:</span>
          <span className="capitalize">{data.fitnessLevel || "Not specified"}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <span className="font-medium text-gray-700">Activities:</span>
          <span>{data.activities || "Not specified"}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <span className="font-medium text-gray-700">Location:</span>
          <span>{data.location || "Not specified"}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <span className="font-medium text-gray-700">Available Time:</span>
          <span>{data.startTime && data.endTime ? `${data.startTime} - ${data.endTime}` : "Not specified"}</span>
        </div>
      </div>
    </div>
  );
};
