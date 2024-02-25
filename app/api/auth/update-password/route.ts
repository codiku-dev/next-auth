import { db } from "@/libs/db";
import { safeEndPoint } from "@/libs/jwt";
import { UPDATE_PASSWORD_MODEL } from "@/libs/models";
import { compare, hash } from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = safeEndPoint(
  async (req: NextRequest, _, { newPassword, oldPassword }, __, token) => {
    const user = await db.user.findUnique({
      where: { email: token!.email! },
    });

    if (user) {
      const oldPasswordMatch = await compare(oldPassword, user.password!);
      // Correctly type his own current password
      if (oldPasswordMatch) {
        // Prevent using same as before
        const newPasswordMatch = await compare(newPassword, user.password!);
        if (newPasswordMatch) {
          return NextResponse.json({
            error: false,
            message: "You can't set the same password",
          });
        }
        // It's ok it's a new password and the user remember his old password
        const newPasswordHash = await hash(
          newPassword,
          Number(process.env.HASH_ROUND)
        );
        // Updating the password with the hash of the new one
        const updatedUser = await db.user.update({
          where: { id: user.id },
          data: { password: newPasswordHash },
        });
        if (updatedUser) {
          return NextResponse.json({
            error: false,
            message: "Password updated successfully",
          });
        }
      } else {
        return NextResponse.json(
          {
            error: true,
            message: "That is not your old password",
          },
          { status: StatusCodes.BAD_REQUEST }
        );
      }
    }
  },
  false,
  undefined,
  UPDATE_PASSWORD_MODEL
);
