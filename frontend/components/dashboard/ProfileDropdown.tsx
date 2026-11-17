"use client";

import Link from "next/link";
import { User, LogOut, Coins } from "lucide-react";
import { useAuthStore } from "@/lib/hooks/useAuthStore";
import { useLogoutMutation } from "@/lib/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfileDropdown() {
  const user = useAuthStore((state) => state.userProfile);
  const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation();

  const initials = `${user?.firstName?.[0] ?? "S"}${user?.lastName?.[0] ?? "X"}`.toUpperCase();
  const fullName = user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "Student User";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full border border-border p-0.5 hover:ring-2 hover:ring-mint/50 transition-all cursor-pointer outline-none">
        <Avatar className="size-8">
          <AvatarImage src={user?.avatarUrl ?? undefined} alt={fullName} />
          <AvatarFallback className="bg-mint text-ink font-bold text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal p-2">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-semibold text-ink leading-none">{fullName}</p>
              <p className="text-xs text-muted truncate leading-none mt-1">
                {user?.email ?? "student@university.edu"}
              </p>
              {user?.university && (
                <p className="text-[11px] text-faint truncate mt-1">
                  {user.university}
                </p>
              )}
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <div className="mx-1 my-1 px-2.5 py-1.5 bg-slate-50 border border-border rounded flex items-center justify-between text-xs">
          <span className="text-muted flex items-center gap-1.5">
            <Coins className="size-3.5 text-purple" />
            Credits
          </span>
          <span className="font-bold text-purple bg-purple/10 px-1.5 py-0.5 rounded text-[11px]">
            100 Tokens
          </span>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link href="/dashboard/profile" className="flex items-center gap-2 w-full" />}>
            <User className="size-4" />
            <span>Profile &amp; Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => logout()}
          disabled={isLoggingOut}
          variant="destructive"
          className="cursor-pointer flex items-center gap-2 text-rose-600 focus:text-rose-700"
        >
          <LogOut className="size-4" />
          <span>{isLoggingOut ? "Signing out…" : "Sign out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
