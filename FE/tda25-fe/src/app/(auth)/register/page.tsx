"use client";

import { Suspense, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/components/languageContext";
import { TranslateText } from "@/lib/utils";

function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const formSchema = z.object({
    email: z.string().email({
      message: TranslateText("INVALID_EMAIL", language),
    }),
    username: z
      .string()
      .min(1, {
        message: TranslateText("USERNAME_REQUIRED", language),
      })
      .max(32, {
        message: TranslateText("USERNAME_TOO_LONG", language),
      }),
    password: z
      .string()
      .min(8, {
        message: TranslateText("PASSWORD_MIN_LENGTH", language),
      })
      .regex(new RegExp(".*[!@#$%^&*()_+{}\\[\\]:;<>,.?~\\\\/-].*"), {
        message: TranslateText("PASSWORD_SPECIAL_CHAR", language),
      })
      .regex(new RegExp(".*\\d.*"), {
        message: TranslateText("PASSWORD_NUMBER", language),
      })
      .regex(new RegExp(".*[a-z].*"), {
        message: TranslateText("PASSWORD_LOWERCASE", language),
      })
      .regex(new RegExp(".*[A-Z].*"), {
        message: TranslateText("PASSWORD_UPPERCASE", language),
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setFormError(null);
    setFormSuccess(null);
    const response = await fetch("/api/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    console.log(response);
    setFormSuccess(TranslateText("REGISTER_SUCCESS", language));
    return;
    if (response.ok) {
      setFormSuccess(TranslateText("REGISTER_SUCCESS", language));
    } else {
      const errorText = await response.json();
      setFormError(
        errorText.error
          ? TranslateText(errorText.error, language)
          : TranslateText("REGISTER_FAILED", language)
      );
    }
  }

  const handleGoBack = () => {
    const redirect = searchParams.get("redirect") || "/online";
    router.push(redirect);
  };

  return (
    <>
      <title>{TranslateText("REGISTER_PAGE_TITLE", language)}</title>
      <div className="min-h-screen flex items-center justify-center font-dosis-regular">
        <div className="bg-white p-8 rounded-xl shadow-md w-96 border-2 border-darkshade shadow-gray-400">
          <h1 className="text-2xl font-bold mb-6 text-defaultred font-dosis-bold">
            {TranslateText("REGISTER", language)}
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-darkshade font-dosis-bold">
                      {TranslateText("EMAIL", language)}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="pepanovak@gmail.com"
                        {...field}
                        className="bg-white placeholder:text-gray-500 text-black border border-darkshade"
                      />
                    </FormControl>
                    <FormMessage className="text-defaultred" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-darkshade font-dosis-bold">
                      {TranslateText("USERNAME", language)}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Pepa Novak"
                        {...field}
                        className="bg-white placeholder:text-gray-500 text-black border border-darkshade"
                      />
                    </FormControl>
                    <FormMessage className="text-defaultred" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-darkshade font-dosis-bold">
                      {TranslateText("PASSWORD", language)}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                        className="bg-white placeholder:text-gray-500 text-black border border-darkshade"
                      />
                    </FormControl>
                    <FormMessage className="text-defaultred" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-defaultred hover:bg-red-700 text-white font-dosis-bold"
              >
                {TranslateText("REGISTER", language)}
              </Button>
              {formError && (
                <p className="text-sm text-defaultred text-center">
                  {formError}
                </p>
              )}
              {formSuccess && (
                <p className="text-sm text-green-600 text-center">
                  {formSuccess}
                </p>
              )}
            </form>
          </Form>
          <p className="mt-4 text-center text-darkerblue font-dosis-medium">
            {TranslateText("NO_ACCOUNT", language)}{" "}
            <Link
              href={
                "/login" + ("?redirect=" + (searchParams.get("redirect") || ""))
              }
              className="text-defaultblue hover:text-darkerblue font-dosis-bold"
            >
              {TranslateText("LOGIN", language)}
            </Link>
          </p>
          <Button
            onClick={handleGoBack}
            className="mt-4 w-full bg-defaultblue hover:bg-darkerblue text-white font-dosis-medium"
          >
            {TranslateText("GO_BACK", language)}
          </Button>
        </div>
      </div>
    </>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<></>}>
      <RegisterPageContent />
    </Suspense>
  );
}
