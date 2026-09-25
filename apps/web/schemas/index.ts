import * as z from "zod";

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  STARTUP_HUB = "STARTUP_HUB",
  MENTOR = "MENTOR"
}

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{6,}$/, "6+ chars, [a-z], [A-Z], [0-9], and [!@#$.....]"),
  confirmPassword: z.string().min(1, "Confirm Password is required"),
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const ResetSchema = z.object({
  email: z.string().email(),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{6,}$/, "6+ chars, [a-z], [A-Z], [0-9], and [!@#$.....]"),
});

export const SettingSchema = z.object({
  firstName: z.optional(z.string()),
  lastName: z.optional(z.string()),
  isTwoFactorEnabled: z.optional(z.boolean()),
  role: z.nativeEnum(UserRole).optional(),
  email: z.optional(z.string().email()),
  password: z.optional(z.string().min(6, "Password must be at least 6 characters").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{6,}$/, "6+ chars, [a-z], [A-Z], [0-9], and [!@#$.....]")),
  newPassword: z.optional(z.string().min(6, "Password must be at least 6 characters").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{6,}$/, "6+ chars, [a-z], [A-Z], [0-9], and [!@#$.....]")),
  image: z.optional(z.string()),
  bannerImage: z.optional(z.string()),
}).catchall(z.any());

export const OnboardingSchema = z.any();

export const StartupHubAccessRequestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.optional(z.string()),
  startupHubName: z.string().min(1),
  details: z.optional(z.string()),
});
