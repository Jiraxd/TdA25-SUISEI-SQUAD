"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { SetLoginCookie, TranslateText } from "@/lib/utils";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();

  const [formError, setFormError] = useState<string | null>(null);
  const formSchema = z.object({
    email: z.string().email({
      message: TranslateText("INVALID_EMAIL", language),
    }),
    password: z.string().min(8, {
      message: TranslateText("PASSWORD_REQUIRED", language),
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setFormError(null);
    const response = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
        deviceName: window.navigator.userAgent,
      }),
    });

    if (response.ok) {
      const redirect = searchParams.get("redirect") || "/online";
      const data = await response.json();
      SetLoginCookie(data.token);
      router.push(redirect);
    } else {
      const errorText = await response.json();
      setFormError(
        errorText.error
          ? TranslateText(errorText.error, language)
          : TranslateText("LOGIN_FAILED", language)
      );
    }
  }

  const handleGoBack = () => {
    const redirect = searchParams.get("redirect") || "/online";
    router.push(redirect);
  };

  return (
    <>
      <title>{TranslateText("LOGIN_PAGE_TITLE", language)}</title>

      <div className="min-h-screen flex items-center justify-center font-dosis-regular ">
        <div className="bg-white p-8 rounded-xl shadow-md w-96 border-2 border-darkshade shadow-gray-400">
          <h1 className="text-2xl font-bold mb-6 text-defaultred font-dosis-bold">
            {TranslateText("LOGIN", language)}
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
                        placeholder="john@example.com"
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
                {TranslateText("LOGIN", language)}
              </Button>
              {formError && (
                <p className="text-sm text-defaultred text-center">
                  {formError}
                </p>
              )}
            </form>
          </Form>

          <p className="mt-4 text-center text-darkerblue font-dosis-medium">
            {TranslateText("NO_ACCOUNT", language)}{" "}
            <Link
              href={
                "/register" +
                ("?redirect=" + (searchParams.get("redirect") || ""))
              }
              className="text-defaultblue hover:text-darkerblue font-dosis-bold"
            >
              {TranslateText("REGISTER", language)}
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

// Suspense jenom abych mohl využívat searchParams v client componentu

export default function LoginPage() {
  return (
    <Suspense fallback={<></>}>
      <LoginContent />
    </Suspense>
  );
}
