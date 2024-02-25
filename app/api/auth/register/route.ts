import { db, excludeField } from "@/libs/db";
import { hash } from "bcrypt";
import { sendEmail } from "@/libs/email";
import { generateJwtToken, safeEndPoint } from "@/libs/jwt";
import { REGISTER_MODEL } from "@/libs/models";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import { User } from "@prisma/client";

// Register can be call, with a resendEmail params , that will just resend an email link
// to redirect the user to get verified
export const POST = safeEndPoint(
  async (req: NextRequest, _, { email, password, resendEmail }) => {
    const existingUser = await db.user.findUnique({ where: { email: email } });
    if (existingUser) {
      if (resendEmail) {
        // If the user exist and just want another email
        sendVerificationEmail(existingUser);
        //RETURN RESPONSE
        return NextResponse.json({
          message: "Email has been sent",
          error: false,
        });
      } else {
        // Just trying to create the same account twice
        return NextResponse.json(
          { message: "User already exist", error: true },
          { status: StatusCodes.CONFLICT }
        );
      }
    } else {
      const hashedPassword = await hash(
        password,
        Number(process.env.HASH_ROUND)
      );
      const newUser = await db.user.create({
        data: {
          email,
          password: hashedPassword,
          isVerified: false,
        },
      });
      sendVerificationEmail(newUser);

      return NextResponse.json({
        user: excludeField(newUser, ["password"]),
      });
    }
  },
  false,
  undefined,
  REGISTER_MODEL
);

async function sendVerificationEmail(user: User) {
  const token = generateJwtToken(user);

  const emailResponse = await sendEmail(
    user.email,
    "Verify your email", // Email subject
    `<html>
      <body>
        <p>Click the following link to verify your account:</p>
        <a href="http://${headers().get(
          "host"
        )}/api/auth/verify-email?token=${token}">
          Verify account
        </a>
      </body>
    </html>`
  );
  if (emailResponse.rejected.length > 0) {
    return NextResponse.json(
      { message: "Email has been rejected", error: true },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  } else {
    console.log("Email sent to ", user.email);
  }
}
