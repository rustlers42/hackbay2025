import * as z from "zod";

export const insuranceProviders = [
  "AOK",
  "TK (Techniker Krankenkasse)",
  "Barmer",
  "DAK-Gesundheit",
  "KKH",
  "IKK classic",
] as const;

export const steps = ["name", "birthday", "insurance", "fitness", "activities", "location", "time", "review"] as const;

export type Step = (typeof steps)[number];

export const skippableSteps: Step[] = ["fitness", "activities", "location", "time", "insurance"];

// Zod schemas for each step
export const nameSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),
});

export const birthdaySchema = z.object({
  birthday: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Please enter a valid date",
    })
    .refine(
      (val) => {
        const date = new Date(val);
        const currentYear = new Date().getFullYear();
        const year = date.getFullYear();

        // Check if year is realistic (between 1900 and current year)
        return year >= 1900 && year <= currentYear;
      },
      {
        message: "Please enter a realistic birth year between 1900 and current year",
      },
    )
    .refine(
      (val) => {
        const date = new Date(val);
        const today = new Date();

        // Check if date is not in the future
        return date <= today;
      },
      {
        message: "Birthday cannot be in the future",
      },
    ),
});

export const insuranceSchema = z.object({
  insuranceProvider: z.enum(insuranceProviders).optional(),
  insuranceNumber: z
    .string()
    .regex(/^[A-Z]{1}[0-9]{9}$/i, "Insurance number must be in format A123456789")
    .optional(),
});

export const fitnessSchema = z.object({
  fitnessLevel: z.enum(["beginner", "intermediate", "pro"]).optional(),
});

export const activitiesSchema = z.object({
  activities: z.string().optional(),
});

export const locationSchema = z.object({
  location: z.string().optional(),
});

export const timeSchema = z.object({
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

// Combined schema for full registration
export const registrationSchema = nameSchema
  .merge(birthdaySchema)
  .merge(insuranceSchema)
  .merge(fitnessSchema)
  .merge(activitiesSchema)
  .merge(locationSchema)
  .merge(timeSchema);

export type RegistrationData = z.infer<typeof registrationSchema>;

// Schema mapping for each step
export const stepSchemas: Record<Step, z.ZodType<any>> = {
  name: nameSchema,
  birthday: birthdaySchema,
  insurance: insuranceSchema,
  fitness: fitnessSchema,
  activities: activitiesSchema,
  location: locationSchema,
  time: timeSchema,
  review: z.object({}), // No validation needed for review
};

export interface StepProps {
  onNext: () => void;
  onPrevious: () => void;
  canSkip?: boolean;
}
