"use client";
import { Resp } from "@/types/api-type";
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
import { EMAIL_MODEL, PASSWORD_MODEL } from "@/libs/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { ZodError, ZodIssue, z } from "zod";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { Divider } from "@/components/ui/divider";
import { FieldPassword } from "@/components/ui/field-password";
import { useTranslations } from "next-intl";
import { UnsensitiveUser } from "@/types/user";
import { api } from "@/configs/ky-config";

const SIGNUP_MODEL = z
  .object({
    email: EMAIL_MODEL,
    password: PASSWORD_MODEL,
    passwordConfirm: z.string().min(1, "Required"),
    resendEmail: z.boolean().optional(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });

type Form = z.infer<typeof SIGNUP_MODEL>;
let POSSIBLE_ERRORS: ZodIssue[] = [];
try {
  PASSWORD_MODEL.parse("");
} catch (err) {
  POSSIBLE_ERRORS = (err as ZodError).issues;
}

export default function Signup() {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const t = useTranslations("Auth.signup");
  const formDataRef = useRef<Form>();
  const [disabledEmailButton, setDisabledEmailButton] = useState(false);
  const [currentZodIssues, setCurrentZodIssues] = useState<ZodIssue[]>([]);
  const { mutate: signup, isPending } = useMutation({
    mutationFn: async (formValues: Form) =>
      api
        .post("/api/auth/register/", { json: formValues })
        .json<Resp<UnsensitiveUser>>(),
    onSuccess: () => {
      setIsEmailSent(true);
    },
  });

  const form = useForm<Form>({
    resolver: zodResolver(SIGNUP_MODEL),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
    },
    mode: "onChange",
  });
  const password = form.watch("password");

  // Submit either a signup or a resend email
  async function onSubmit(values: Form) {
    if (!formDataRef.current) {
      formDataRef.current = values;
      signup({ ...values });
    } else {
      console.log("resend an email ?");
      signup({ ...values, resendEmail: true });
      setDisabledEmailButton(true);
      setTimeout(() => {
        setDisabledEmailButton(false);
      }, 30000);
    }
  }

  // Revalidate confirm password when password changes
  useEffect(() => {
    if (password !== form.getValues().passwordConfirm) {
      form.setError("passwordConfirm", {
        type: "manual",
        message: t("passwordDontMatch"),
      });
    } else {
      form.clearErrors("passwordConfirm");
    }
    try {
      PASSWORD_MODEL.parse(password);
      setCurrentZodIssues([]);
    } catch (err) {
      setCurrentZodIssues((err as ZodError).issues);
    }
  }, [form, password, t]);

  const renderEmailSent = () => {
    return (
      <div>
        <h2 className="mb-5">{t("emailSent")}</h2>
        <p>{t("checkInbox")}</p>
        <p>
          <br />
          {t("closeWindow")}
        </p>

        <h2 className="mt-20">{t("didNotReceiveEmail")}</h2>
        <Button
          type="submit"
          variant={"outline"}
          disabled={isPending || disabledEmailButton}
          className="w-full mt-10"
        >
          {isPending
            ? t("loading")
            : disabledEmailButton
            ? t("waitBeforeSending")
            : t("sendEmailAgain")}
        </Button>
      </div>
    );
  };

  const shoudCrossPasswordError = (possibleIssue: ZodIssue) => {
    const element = currentZodIssues.find(
      (currIssue) => currIssue.message === possibleIssue.message
    );
    return element == undefined;
  };
  return (
    <div className="flex-center mt-20">
      <Form {...form}>
        <form className="card" onSubmit={form.handleSubmit(onSubmit)}>
          {isEmailSent ? (
            renderEmailSent()
          ) : (
            <>
              <div className="space-y-4">
                <h2>{t("register")}</h2>
                <div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("email")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("email")} {...field} />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormMessage className="text-xs" />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("password")}</FormLabel>
                        <FormControl>
                          <FieldPassword
                            placeholder={t("enterYourPassword")}
                            {...field}
                          />
                        </FormControl>
                        <ul className="text-xs font-light">
                          {password &&
                            currentZodIssues.length > 0 &&
                            POSSIBLE_ERRORS.map((possibleError, index) => (
                              <li
                                key={possibleError.message}
                                className={`text-red-500 font-medium ${
                                  shoudCrossPasswordError(possibleError)
                                    ? "line-through"
                                    : ""
                                }`}
                              >
                                {possibleError.message}
                              </li>
                            ))}
                        </ul>
                      </FormItem>
                    )}
                  />
                  <FormMessage className="text-xs" />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="passwordConfirm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("confirmPassword")}</FormLabel>
                        <FormControl>
                          <FieldPassword
                            placeholder={t("typeYourPasswordAgain")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormMessage className="text-xs" />
                </div>
              </div>

              <Button
                disabled={isPending}
                type="submit"
                className="w-full mt-10"
              >
                {t("signUp")}
              </Button>
              <Divider>{t("orContinueWith")}</Divider>
              <div className="flex-center mt-5">
                <div
                  onClick={async () => {
                    signIn("google", {
                      redirect: true,
                      callbackUrl: process.env.NEXT_PUBLIC_GOOGLE_CALLBACK_URL,
                    });
                  }}
                  className="rounded-full border cursor-pointer p-2"
                >
                  <FcGoogle size={25} />
                </div>
              </div>

              <div className="mt-4 text-sm">
                {t("alreadyHaveAccount")}
                <Link href="/auth/signin" className="ml-1">
                  {t("signIn")}
                </Link>
              </div>
            </>
          )}
        </form>
      </Form>
    </div>
  );
}
