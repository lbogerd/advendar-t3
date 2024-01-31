import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Inter } from "next/font/google";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { cn } from "~/lib/utils";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import { DefaultLayout } from "~/components/layouts/default";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  // Using 'any's because the 'correct' way to do this isn't working
  // https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts#with-typescript
  const getLayout = (Component as any).getLayout || ((page: any) => page);

  return getLayout(
    <SessionProvider session={session}>
      <div className={cn("antialiased", inter.className)}>
        <DefaultLayout>
          <Component {...pageProps} />
        </DefaultLayout>
      </div>
    </SessionProvider>,
  );
};

export default api.withTRPC(MyApp);
