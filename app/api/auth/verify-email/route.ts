import { db } from "@/libs/db";
import { decodeJwtToken, safeEndPoint } from "@/libs/jwt";
import { VERIFY_EMAIL_MODEL } from "@/libs/models";
import { User } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export const GET = safeEndPoint(
  async (req: NextRequest, _, __, { token }) => {
    const user = decodeJwtToken<User>(token);
    if (user?.id) {
      const existingUser = await db.user.findUnique({
        where: { email: user.email },
      });
      if (existingUser) {
        if (!existingUser.isVerified) {
          await db.user.update({
            where: { email: existingUser.email },
            data: { isVerified: true },
          });
        }
      }
      return NextResponse.redirect(
        (process.env.SIGNUP_CALLBACK_URL as string) + "?token=" + token
      );
    } else {
      return NextResponse.json(
        { message: "User not found from token", error: true },
        { status: StatusCodes.FORBIDDEN }
      );
    }
  },
  false,
  undefined,
  undefined,
  VERIFY_EMAIL_MODEL
);
