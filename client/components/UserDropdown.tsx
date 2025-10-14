import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, Settings, ChevronDown, TicketIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "@/store/hooks";
import { signOut } from "@/store/slices/authSlice";
import { useNavigate } from "react-router-dom";

interface UserDropdownProps {
  user: {
    id: string;
    email: string;
    fullName?: string;
    phone?: string;
    birthdate?: string;
    isAuthenticated: boolean;
  } | null;
}

export function UserDropdown({ user }: UserDropdownProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  if (!user) return null;

  const displayName = user.fullName?.split(" ")[0] || user.email;
  const initials = user.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user.email.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center space-x-2 h-auto p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <div className="flex items-center space-x-1">
            <span className="text-sm text-slate-700 dark:text-slate-300 hidden sm:block">
              {t("common.hi")}, {displayName}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.fullName || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          <User className="mr-2 h-4 w-4" />
          <span>{t("common.profile", "Profile")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => navigate("/reservations")}
        >
          <TicketIcon className="mr-2 h-4 w-4" />
          <span>{t("common.myReservations", "My Reservations")}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
          onClick={() => dispatch(signOut())}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t("auth.signOut")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserDropdown;
