import { z } from "zod";
import { decodeJwtToken } from "@/utils/jwt";
import { db } from "./db";

export const JWT_TOKEN_MODEL = z
  .string()
  .min(1)
  .refine((value) => decodeJwtToken(value) !== null, {
    message: "Invalid JWT token",
  });

export const PASSWORD_MODEL = z
  .string()
  .min(8, "Must be at least 8 characters")
  .regex(/[A-Z]+/, "Must contain at least 1 uppercase letter")
  .regex(/[a-z]+/, "Must contain at least 1 lowercase letter")
  .regex(/[0-9]+/, "Must contain at least 1 number")
  .regex(
    /[!@#$%^&*()_+[\]{};':"\\|,.<>/?]+/,
    "Must contain at least 1 special character"
  );

export const EMAIL_MODEL = z
  .string()
  .email("Invalid email")
  .min(1, "Email is required");

export const STRING_REQUIRED_MODEL = z.string().min(1, "Required");

export const FORGOT_PASSWORD_MODEL = z.object({
  email: EMAIL_MODEL,
});

export const SIGNIN_MODEL = z.object({
  email: EMAIL_MODEL,
  password: PASSWORD_MODEL,
});

export const REGISTER_MODEL = z.object({
  email: EMAIL_MODEL,
  password: PASSWORD_MODEL,
  resendEmail: z.boolean().optional(),
});

export const RESET_PASSWORD_MODEL = z.object({
  password: PASSWORD_MODEL,
  token: JWT_TOKEN_MODEL,
});

export const VERIFY_EMAIL_MODEL = z.object({
  token: JWT_TOKEN_MODEL,
});

export const DELETE_ACCOUNT_MODEL = z.object({
  token: JWT_TOKEN_MODEL,
});
