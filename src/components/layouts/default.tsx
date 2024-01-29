import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import ActiveLink from "../ui/active-link";

export const DefaultLayout = ({
  pageTitle,
  children,
}: {
  pageTitle?: string;
  children: React.ReactNode;
}) => {
  return (
    <div>
      <header className="sticky top-0 flex justify-between bg-yellow-400 p-1.5 sm:px-4 sm:py-2">
        <div className="flex items-center sm:gap-2">
          <Link href={"/"}>
            <h1 className="text-2xl font-bold">📆 Advendar</h1>
          </Link>
          {!pageTitle && <span className="hidden sm:block">{pageTitle}</span>}
        </div>
        <div id="links" className="mt-auto">
          <ActiveLink href={"/dashboard"} activeClassName="underline">
            Dashboard
          </ActiveLink>
        </div>
        <MiniProfile />
      </header>

      <main className="p-4 md:p-6">{children}</main>
    </div>
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
        </>
      ) : (
        <Link href={"/api/auth/signin"}>
          <Button variant={"secondary"}>Sign in</Button>
        </Link>
      )}
    </div>
  );
};
