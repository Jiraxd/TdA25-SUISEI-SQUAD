import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useLanguage } from "@/components/languageContext";
import { language, TranslateText } from "@/lib/utils";
import { type UserProfile } from "@/models/UserProfile";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";

interface SettingsProfileProps {
  user: UserProfile | null;
}

const createSettingsFormSchema = (language: language) =>
  z
    .object({
      username: z
        .string()
        .min(3, TranslateText("USERNAME_MIN_LENGTH", language))
        .max(20, TranslateText("USERNAME_MAX_LENGTH", language)),
      email: z.string().email(TranslateText("INVALID_EMAIL", language)),
      currentPassword: z
        .string()
        .min(6, TranslateText("PASSWORD_MIN_LENGTH", language)),
      newPassword: z
        .string()
        .min(6, TranslateText("PASSWORD_MIN_LENGTH", language))
        .optional(),
      confirmPassword: z
        .string()
        .min(6, TranslateText("PASSWORD_MIN_LENGTH", language))
        .optional(),
      profilePicture: z.instanceof(File).optional(),
      nameColor: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i, TranslateText("INVALID_COLOR", language)),
    })
    .refine(
      (data) => {
        if (data.newPassword || data.confirmPassword) {
          return data.newPassword === data.confirmPassword;
        }
        return true;
      },
      {
        message: TranslateText("PASSWORDS_DO_NOT_MATCH", language),
      }
    );

type SettingsFormValues = z.infer<ReturnType<typeof createSettingsFormSchema>>;

export default function SettingsProfile({ user }: SettingsProfileProps) {
  const { language } = useLanguage();
  const [currentColor, setCurrentColor] = useState(
    user?.nameColor || "#000000"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    user?.profilePicture || ""
  );

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(createSettingsFormSchema(language)),
    defaultValues: {
      username: user?.username,
      email: user?.email,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      nameColor: user?.nameColor || "#000000",
    },
  });

  function onSubmit(data: SettingsFormValues) {
    console.log(data);
  }

  if (!user) return null;
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">
        {TranslateText("PROFILE_SETTINGS", language)}
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="profilePicture"
            render={({ field: { value, ...field } }) => (
              <FormItem>
                <FormLabel>
                  {TranslateText("PROFILE_PICTURE", language)}
                </FormLabel>
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage
                      src={previewUrl || "/images/placeholder-avatar.png"}
                      alt={"profile_picture"}
                    />
                  </Avatar>
                  <div className="flex flex-col gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          field.onChange(file);
                          const url = URL.createObjectURL(file);
                          setPreviewUrl(url);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="border border-darkshade"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {TranslateText("CHOOSE_PICTURE", language)}
                    </Button>
                    {
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-defaultred hover:text-red-700"
                        onClick={() => {
                          setPreviewUrl(user.profilePicture || "");
                          form.setValue("profilePicture", undefined);
                        }}
                      >
                        {TranslateText("REMOVE_PICTURE", language)}
                      </Button>
                    }
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            defaultValue={user.username}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{TranslateText("USERNAME", language)}</FormLabel>
                <FormControl>
                  <Input {...field} className="border border-darkshade" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            defaultValue={user.email}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{TranslateText("EMAIL", language)}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    {...field}
                    className="border border-darkshade"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {TranslateText("CURRENT_PASSWORD", language)}
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    className="border border-darkshade"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{TranslateText("NEW_PASSWORD", language)}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    className="border border-darkshade"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nameColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{TranslateText("NAME_COLOR", language)}</FormLabel>
                <div className="flex items-center gap-4">
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <Input
                        type="color"
                        {...field}
                        id="colorPicker"
                        className="sr-only"
                        onChange={(e) => {
                          field.onChange(e);
                          setCurrentColor(e.target.value);
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="flex items-center gap-2 border border-darkshade"
                        onClick={() =>
                          document.getElementById("colorPicker")?.click()
                        }
                      >
                        <div
                          className="w-4 h-4 rounded-sm border border-gray-300 "
                          style={{ backgroundColor: currentColor }}
                        />
                        {TranslateText("CHOOSE_COLOR", language)}
                      </Button>
                      <div className="text-sm bg-muted px-2 py-1 rounded border border-darkshade">
                        {currentColor.toUpperCase()}
                      </div>
                    </div>
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4">
            <Button
              type="submit"
              className="w-full bg-defaultblue hover:bg-darkerblue text-white"
            >
              {TranslateText("SAVE_CHANGES", language)}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
