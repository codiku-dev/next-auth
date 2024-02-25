import { decodeJwtToken } from "@/libs/jwt";
import { z } from "zod";

export const JWT_TOKEN_MODEL = z
  .string()
  .min(1)
  .refine(
    (value) => {
      try {
        console.log("REFINE TEST");
        return decodeJwtToken<string>(value) !== null;
      } catch (e) {
        console.log("REFINE FAIL");
        return false;
      }
    },
    {
      message: "Invalid JWT token",
    }
  );

export const PASSWORD_MODEL = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[A-Z]+/, "At least 1 uppercase letter")
  .regex(/[a-z]+/, "At least 1 lowercase letter")
  .regex(/[0-9]+/, "At least 1 number")
  .regex(/[!@#$%^&*()_+[\]{};':"\\|,.<>/?]+/, "At least 1 special character");

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

export const UPDATE_PASSWORD_MODEL = z.object({
  oldPassword: STRING_REQUIRED_MODEL,
  newPassword: PASSWORD_MODEL,
});

export const IdArgModels = z.object({
  id: z.number(),
});

export const IdParamsModel = z.object({
  id: z.string(),
});
