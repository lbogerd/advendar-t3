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
    </>
  );
}
