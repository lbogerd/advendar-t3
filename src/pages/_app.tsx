import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Inter } from "next/font/google";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { cn } from "~/lib/utils";
import { type ReactElement, type ReactNode } from "react";
import { type NextPage } from "next";
import { DefaultLayout } from "~/components/layouts/default";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  // Code below generated by CoPilot, not sure if it's correct
  // but it seems to be working
  const getLayout =
    (
      Component as NextPage & {
        getLayout?: (page: ReactElement) => ReactNode;
      }
    ).getLayout ?? ((page: ReactElement) => page);

  return getLayout(
    <SessionProvider session={session}>
      <div
        // for some reason, the font className is different
        // between server and client, so we need to suppress
        suppressHydrationWarning
        className={cn("antialiased", inter.className)}
      >
        <DefaultLayout>
          <Component {...pageProps} />
        </DefaultLayout>
      </div>
    </SessionProvider>,
  );
};

export default api.withTRPC(MyApp);
