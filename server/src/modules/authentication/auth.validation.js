
import { z } from "zod";

export const registerValidation = z.object({
  username: z
    .string()
    .trim()
    .min(3, "username is too small")
    .max(20, "username is too long")
    .transform((val) => val.toLowerCase()),

  email: z
    .string()
    .email()
    .trim()
    .transform((email) => email.toLowerCase()),

  password: z
    .string()
    .trim()
    .min(8, "password must have 8 latters minimum")
    .max(12, "password m"),
});
