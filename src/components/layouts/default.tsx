import { ChevronDown } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import ActiveLink from "../ui/active-link";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export const DefaultLayout = ({
  pageTitle,
  children,
}: {
  pageTitle?: string;
  children: React.ReactNode;
}) => {
  return (
    <>
      <header className="sticky top-0 z-50 flex h-12 justify-between bg-yellow-400 px-1.5 sm:px-4 sm:py-2">
        <div className="flex shrink-0 items-center sm:gap-2">
          <Link href={"/"}>
            <h1 className="text-2xl font-bold">📆 Advendar</h1>
          </Link>
          {!pageTitle && <span className="hidden sm:block">{pageTitle}</span>}
        </div>
        <div id="links" className="mt-auto hidden sm:block">
          <ActiveLink href={"/dashboard"} activeClassName="underline">
            Dashboard
          </ActiveLink>
        </div>
        <MiniProfile />
      </header>

      <main className="container px-4 py-6 md:px-8">{children}</main>
    </>
  );
};

const MiniProfile = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex items-center justify-center gap-2">
      {sessionData ? (
        <>
          <img
            src={sessionData.user.image ?? undefined}
            alt="user avatar"
            className="h-8 w-8"
          />
          <span>{sessionData.user.name}</span>
          <div className="static my-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <ChevronDown />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem className="border-collapse border border-transparent focus:border-yellow-200 focus:bg-yellow-50">
                  <Button
                    variant={"invisible"}
                    size={"xs"}
                    className="w-full justify-normal"
                    onClick={() =>
                      signOut({
                        callbackUrl: "/",
                      })
                    }
                  >
                    <Link href={"/api/auth/signout"}>Sign out</Link>
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      ) : (
        <Link href={"/api/auth/signin"}>
          <Button>Sign in</Button>
        </Link>
      )}
    </div>
  );
};
