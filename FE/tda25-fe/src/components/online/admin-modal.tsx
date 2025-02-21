import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GetLoginCookie, language, TranslateText } from "@/lib/utils";
import { useEffect, useState } from "react";
import { UserProfile } from "@/models/UserProfile";
import { Ban, UserCheck } from "lucide-react";
import { useAlertContext } from "../alertContext";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: language;
}

export function AdminModal({ isOpen, onClose, language }: AdminModalProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { updateErrorMessage, updateSuccessMessage } = useAlertContext();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/v1/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      updateErrorMessage(TranslateText("FAILED_TO_FETCH_USERS", language));
    }
  };

  const displayedUsers =
    searchQuery.trim() === ""
      ? users
      : users.filter((user) =>
          user.username.toLowerCase().includes(searchQuery.toLowerCase())
        );

  const handleBanUnbanUser = async (userId: string, isBanned: boolean) => {
    try {
      const response = await fetch(
        `/api/v1/users/${isBanned ? "unban" : "ban"}/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${GetLoginCookie()}`,
          },
        }
      );

      if (response.ok) {
        updateSuccessMessage(
          TranslateText(
            isBanned ? "USER_UNBANNED_SUCCESS" : "USER_BANNED_SUCCESS",
            language
          )
        );
        setUsers((prev) =>
          prev.map((user) =>
            user.uuid === userId ? { ...user, banned: !isBanned } : user
          )
        );
      } else {
        updateErrorMessage(TranslateText("USER_ACTION_FAILED", language));
      }
    } catch (error) {
      updateErrorMessage(TranslateText("USER_ACTION_FAILED", language));
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="bg-white border-2 border-darkshade shadow-darkshade shadow-md max-w-2xl [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="border-b border-darkshade pb-4">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-dosis-bold text-defaultred">
              {TranslateText("ADMIN_PANEL", language)}
            </DialogTitle>
            <Button
              variant="default"
              className="bg-defaultred hover:bg-red-700 text-white font-dosis-bold"
              onClick={onClose}
            >
              {TranslateText("CLOSE", language)}
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder={TranslateText("SEARCH_USERS", language)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-darkshade border-2 placeholder:text-gray-500 text-black"
            />
            {searchQuery.trim() !== "" && (
              <Button
                variant="ghost"
                onClick={() => setSearchQuery("")}
                className="text-white hover:text-black bg-defaultblue hover:bg-darkerblue"
              >
                {TranslateText("CLEAR", language)}
              </Button>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-2">
            {displayedUsers.length > 0 ? (
              displayedUsers.map((user) => (
                <div
                  key={user.uuid}
                  className="flex items-center justify-between p-3 border border-darkshade rounded-md hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        user.profilePicture || "/images/placeholder-avatar.png"
                      }
                      alt="Avatar"
                      className="w-8 h-8 rounded-full"
                    />
                    <a
                      href={`/profile/${user.uuid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-dosis-medium hover:text-defaultblue"
                    >
                      {user.username}
                    </a>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => handleBanUnbanUser(user.uuid, user.banned)}
                    className={`${
                      user.banned
                        ? "text-green-600 hover:text-green-700"
                        : "text-red-600 hover:text-red-700"
                    }`}
                  >
                    {user.banned ? (
                      <UserCheck className="h-5 w-5" />
                    ) : (
                      <Ban className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 font-dosis-medium py-4">
                {TranslateText("NO_USERS_FOUND", language)}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
