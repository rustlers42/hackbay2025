"use client";

import { RegistrationWizard } from "./components/RegistrationWizard";
import { RegistrationProvider } from "./context/RegistrationContext";

export default function RegistrationPage() {
  return (
    <RegistrationProvider>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <RegistrationWizard />
      </div>
    </RegistrationProvider>
  );
}
