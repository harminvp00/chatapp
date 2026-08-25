import { toLowerCase, transform, z } from "zod";

export const registerValidation = z.object({
  username: z
    .string()
    .trim()
    .min(3, "username must contain 8 letters")
    .max(20, "username cannot contain more than 20 latters")
    .transform((val) => val.toLowerCase()),

  email: z
    .string()
    .email()
    .trim()
    .transform((email) => email.toLowerCase()),

  password: z
    .string()
    .trim()
    .min(8, "password must have minimum 8 characters")
    .max(12, "password must have maximum 12 characters, not more"),
});
