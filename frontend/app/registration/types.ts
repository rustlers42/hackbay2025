import * as z from "zod";

export const steps = ["personal", "who", "tag"] as const;

export type Step = (typeof steps)[number];

// Zod schemas for each step
export const personalSchema = z.object({
  username: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().regex(/@/, "Not correct email format"),
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
        return date <= today;
      },
      {
        message: "Birthday cannot be in the future",
      },
    ),
  password: z.string().min(8, "password must at least be 8 characters long"),
});

export const whoSchema = z.object({
  intensity: z.number().min(0),
});

export const tagsSchema = z.object({
  tags: z.array(z.string()).default([]),
});

// Combined schema for full registration
export const registrationSchema = personalSchema.merge(tagsSchema).merge(whoSchema);

export type RegistrationData = z.infer<typeof registrationSchema>;

// Schema mapping for each step
export const stepSchemas: Record<Step, z.ZodType<any>> = {
  personal: personalSchema,
  who: whoSchema,
  tag: tagsSchema,
};

export interface StepProps {
  onNext: () => void;
  onPrevious: () => void;
}
