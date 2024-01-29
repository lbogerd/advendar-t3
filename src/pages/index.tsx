import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { Button } from "~/components/ui/button";

import { api } from "~/utils/api";

export default function Home() {
  return (
    <>
      <Head>
        <title>Advendar</title>
        <meta name="description" content="Make your own advent calendar!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <div className="flex flex-col items-center gap-2">
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.post.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl italic">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <Button
        onClick={
          sessionData
            ? () => void signOut()
            : () =>
                void signIn("discord", {
                  callbackUrl: "http://localhost:3000/dashboard",
                })
        }
      >
        {sessionData ? "Sign out" : "Sign in"}
      </Button>
    </div>
  );
}
