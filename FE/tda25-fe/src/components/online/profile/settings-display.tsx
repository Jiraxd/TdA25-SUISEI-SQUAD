import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useLanguage } from "@/components/languageContext";
import {
  byteArrayToImageUrl,
  GetLoginCookie,
  language,
  TranslateText,
} from "@/lib/utils";
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
import { useRef, useEffect } from "react";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Edit } from "lucide-react";
import { useAlertContext } from "@/components/alertContext";
import { useRouter } from "next/navigation";

interface SettingsProfileProps {
  user: UserProfile | null;
}

const availableColors = [
  "#1a1a1a",
  "#caaa1c",
  "#78ca1c",
  "#2ca420",
  "#20beb0",
  "#2091be",
  "#6930db",
  "#db3080",
  "#c42c48",
  "#c47d2c",
];

const createSettingsFormSchema = (language: language) =>
  z
    .object({
      username: z
        .string()
        .min(3, TranslateText("USERNAME_MIN_LENGTH", language))
        .max(20, TranslateText("USERNAME_MAX_LENGTH", language)),
      email: z.string().email(TranslateText("INVALID_EMAIL", language)),
      currentPassword: z.string(),
      newPassword: z
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
        })
        .optional()
        .or(z.literal("")),
      confirmPassword: z.string().optional().or(z.literal("")),
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

export type Session = {
  uuid: string;
  deviceName: string;
  signedAt: string;
};
type SettingsFormValues = z.infer<ReturnType<typeof createSettingsFormSchema>>;

export default function SettingsProfile({ user }: SettingsProfileProps) {
  const { language } = useLanguage();
  const [currentColor, setCurrentColor] = useState(
    user?.nameColor || "#1A1A1A"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    byteArrayToImageUrl(user?.profilePicture)
  );
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    async function fetchSessions() {
      try {
        const response = await fetch("/api/v1/auth/sessions", {
          headers: {
            Authorization: GetLoginCookie() || "",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setSessions(data);
        }
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
      }
    }

    fetchSessions();
  }, []);

  const { updateSuccessMessage, updateErrorMessage } = useAlertContext();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(createSettingsFormSchema(language)),
    defaultValues: {
      username: user?.username,
      email: user?.email,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      nameColor: user?.nameColor || "#1a1a1a",
    },
  });

  const router = useRouter();

  async function onSubmit(data: SettingsFormValues) {
    try {
      if (data.profilePicture) {
        const formData = new FormData();
        formData.append("profilePicture", data.profilePicture);

        const picResponse = await fetch("/api/v1/users/profilePicture", {
          method: "POST",
          headers: {
            Authorization: GetLoginCookie() || "",
          },
          body: formData,
        });
      }

      const settings = {
        username: data.username,
        email: data.email,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword || undefined,
        nameColor: data.nameColor,
      };

      const res = await fetch("/api/v1/users/settings", {
        method: "POST",
        headers: {
          Authorization: GetLoginCookie() || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      updateSuccessMessage(TranslateText("SETTINGS_UPDATED", language));
      router.refresh();
    } catch (error) {
      updateErrorMessage(TranslateText("FAILED_SETTINGS_UPDATE", language));
    }
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
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20">
                    <Avatar className="w-20 h-20 overflow-hidden">
                      <AvatarImage
                        src={previewUrl}
                        alt={value?.name || "profile_picture"}
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                        }}
                      />
                    </Avatar>
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-75 transition-opacity duration-200 rounded-full cursor-pointer opacity-0 hover:opacity-50"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Edit className="w-6 h-6 text-white" />
                    </div>
                  </div>
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
                    {
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-defaultred hover:text-red-700"
                        onClick={() => {
                          setPreviewUrl(
                            byteArrayToImageUrl(user.profilePicture)
                          );
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
                <FormLabel className="text-md">
                  {TranslateText("USERNAME", language)}
                </FormLabel>
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
                <FormLabel className="text-md">
                  {TranslateText("EMAIL", language)}
                </FormLabel>
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
                <FormLabel className="text-md">
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
                <FormLabel className="text-md">
                  {TranslateText("NEW_PASSWORD", language)}
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
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md">
                  {TranslateText("CONFIRM_PASSWORD", language)}
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
            name="nameColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md">
                  {TranslateText("NAME_COLOR", language)}
                </FormLabel>
                <div className="flex flex-col items-start gap-4">
                  <FormControl>
                    <div className="flex items-center gap-2">
                      {availableColors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`w-8 h-8 rounded-full border border-gray-300 cursor-pointer`}
                          style={{ backgroundColor: color }}
                          onClick={() => {
                            field.onChange(color);
                            setCurrentColor(color);
                          }}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <div className="flex items-center gap-4">
                    <div className="text-md bg-muted px-2 py-1 rounded">
                      {TranslateText("CURRENT_COLOR", language)}:
                    </div>
                    <div
                      className="w-8 h-8 rounded-full border border-gray-300"
                      style={{ backgroundColor: currentColor }}
                    />
                  </div>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <div className="flex gap-4">
            <Button
              type="submit"
              className="w-full bg-defaultblue hover:bg-darkerblue text-white text-lg"
            >
              {TranslateText("SAVE_CHANGES", language)}
            </Button>
          </div>
        </form>
      </Form>
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">
          {TranslateText("ACTIVE_SESSIONS", language)}
        </h3>
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.uuid}
              className="p-4 border border-darkshade rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{session.deviceName}</p>
                <p className="text-sm text-gray-500">
                  {new Date(session.signedAt).toLocaleString()}
                </p>
              </div>
              <Button
                className="bg-defaultred hover:bg-red-700 text-white"
                onClick={async () => {
                  try {
                    const response = await fetch(
                      `/api/v1/auth/logout/${session.uuid}`
                    );
                    if (response.ok) {
                      setSessions(
                        sessions.filter((s) => s.uuid !== session.uuid)
                      );
                      updateSuccessMessage(
                        TranslateText("SESSION_TERMINATED", language)
                      );
                    }
                  } catch (error) {
                    updateErrorMessage(
                      TranslateText("SESSION_TERMINATION_FAILED", language)
                    );
                  }
                }}
              >
                {TranslateText("TERMINATE", language)}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
