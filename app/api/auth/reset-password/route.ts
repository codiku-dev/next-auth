import { db } from "@/libs/db";
import { decodeJwtToken, safeEndPoint } from "@/libs/jwt";
import { RESET_PASSWORD_MODEL } from "@/libs/models";
import { compare, hash } from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = safeEndPoint(
  async (req: NextRequest, _, { password, token }) => {
    const data = decodeJwtToken<{ email: string }>(token);
    if (data?.email) {
      const user = await db.user.findUnique({ where: { email: data?.email } });

      if (user && user.isVerified) {
        // compare body password and hashed user password
        const passwordMatch = await compare(password, user.password!);
        if (passwordMatch) {
          return NextResponse.json(
            {
              message: "New password is the same as the current password",
              error: true,
            },
            { status: StatusCodes.CONFLICT }
          );
        }
        const hashedPassword = await hash(
          password,
          Number(process.env.HASH_ROUND)
        );
        const userUpdated = await db.user.update({
          where: { email: data?.email },
          data: { password: hashedPassword },
        });
        if (userUpdated) {
          return NextResponse.json({}, { status: StatusCodes.CREATED });
        }
      } else {
        return NextResponse.json(
          {
            message: "You can't change the password of an unverified account",
            error: true,
          },
          { status: StatusCodes.INTERNAL_SERVER_ERROR }
        );
      }
    }
    return NextResponse.json(
      { message: "Error during password reset", error: true },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  },
  false,
  undefined,
  RESET_PASSWORD_MODEL
);
