"use client";

import { signOut as customSignOut } from "@/app/(login)/actions";
import { signOut as nextAuthSignOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User, LogIn } from "lucide-react";
import { use } from "react";
import { useUser } from "@/lib/auth";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export function UserMenu() {
  const router = useRouter();
  const { userPromise } = useUser();
  const { data: session } = useSession();
  const user = use(userPromise);

  const handleSignOut = async () => {
    if (session) {
      // NextAuth session - use NextAuth sign out
      await nextAuthSignOut({ redirect: false });
    } else {
      // Custom session - use custom sign out
      await customSignOut();
    }
    router.push("/sign-in");
  };

  return (
    <>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <User className="h-[1.2rem] w-[1.2rem] text-amber-500" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user.name || "User"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/dashboard")}>
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/live")}>
              Create Diagram
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link href="/sign-in">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-emerald-600 text-white hover:bg-emerald-600/80"
          >
            <LogIn className="h-4 w-4" />
            <span className="hidden sm:inline">Sign In</span>
          </Button>
        </Link>
      )}
    </>
  );
}
