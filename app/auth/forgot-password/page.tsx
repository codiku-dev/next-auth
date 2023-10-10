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
import { FORGOT_PASSWORD_SCHEMA } from "@/lib/validators";
import { Resp } from "@/types/api-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Form = z.infer<typeof FORGOT_PASSWORD_SCHEMA>;

export default function ForgotPassword() {
  const [isEmailSent, setISEmailSent] = useState(false);
  const { mutate: forgotPassword, isLoading } = useMutation(
    async (email: string) =>
      api.post<Resp<{}>>("/api/auth/forgot-password", { email }),
    {
      onSuccess: () => {
        setISEmailSent(true);
      },
    }
  );

  const form = useForm<Form>({
    resolver: zodResolver(FORGOT_PASSWORD_SCHEMA),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit({ email }: Form) {
    forgotPassword(email);
  }

  return (
    <div className="flex-center mt-20">
      {isEmailSent ? (
        <div>
          <h2 className="font-bold mb-5 text-xl">Email sent</h2>
          <p>Check your inbox and click the link to reset your password.</p>
          <p>
            <br />
            You can close this window.
          </p>
        </div>
      ) : (
        <Form {...form}>
          <form
            className="w-96  bg-slate-100 p-6 rounded-sm space-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <h2 className="font-bold text-xl">Request a password reset</h2>
            <div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormMessage />
            </div>

            <Button disabled={isLoading} type="submit" className="w-full mt-10">
              Send me an email
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}