import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Inter as FontSans } from "next/font/google";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { cn } from "~/lib/utils";

const fontSans = FontSans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <div className={cn("font-sans antialiased", fontSans.variable)}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </div>
  );
};

export default api.withTRPC(MyApp);
