import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

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
          {!pageTitle && (
            <span className="hidden sm:block">{pageTitle} Asdf</span>
          )}
        </div>
        <MiniProfile />
      </header>

      <main>{children}</main>
    </div>
  );
};

const MiniProfile = () => {
  const session = useSession();

  return (
    <div className="flex items-center justify-center gap-2">
      <img
        src={session.data?.user.image ?? undefined}
        alt="user avatar"
        className="h-8 w-8"
      />
      <span>{session.data?.user.name}</span>
    </div>
  );
};
