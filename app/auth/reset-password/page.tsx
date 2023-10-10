"use client";
import { api } from "@/app/configs/axios-config";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SPECIAL_CHARACTERS } from "@/lib/validators";
import { Resp } from "@/types/api-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const RESET_PASSWORD_SCHEMA = z
  .object({
    password: z
      .string()
      .min(8, "Must be at least 8 characters")
      .regex(/[A-Z]+/, "Must contain at least 1 uppercase letter")
      .regex(/[a-z]+/, "Must contain at least 1 lowercase letter")
      .regex(/[0-9]+/, "Must contain at least 1 number")
      .regex(SPECIAL_CHARACTERS, "Must contain at least 1 special character"),
    passwordConfirm: z.string().min(1),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });

type Form = z.infer<typeof RESET_PASSWORD_SCHEMA>;

export default function ResetPassword() {
  const router = useRouter();
  const { mutate: resetPassword, isLoading } = useMutation(
    async (data: { token: string; password: string }) =>
      api.post<Resp<{}>>("/api/auth/reset-password", {
        token: data.token,
        password: data.password,
      }),
    {
      onSuccess: () => {
        router.push("/auth/signin");
      },
    }
  );
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const form = useForm<Form>({
    resolver: zodResolver(RESET_PASSWORD_SCHEMA),
    mode: "onChange",
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  });

  async function onSubmit({ password, passwordConfirm }: Form) {
    if (token) {
      resetPassword({ token, password });
    } else {
      toast.error("Invalid token");
    }
  }

  return (
    <div className="flex-center mt-20">
      <Form {...form}>
        <form
          className="w-96  bg-slate-100 p-6 rounded-sm space-y-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <h2 className="font-bold text-xl">Request a password reset</h2>
          <div>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <ul className="text-xs font-light">
                    <li>At least 8 characters</li>
                    <li>At least 1 lowercase, 1 uppercase,</li>
                    <li>At least 1 number, 1 special character</li>
                  </ul>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormMessage />
          </div>
          <div>
            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Type your password again"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormMessage />
          </div>

          <Button disabled={isLoading} type="submit" className="w-full mt-10">
            Reset password
          </Button>
        </form>
      </Form>
    </div>
  );
}
