import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Home() {
  const session = useSession();
  const router = useRouter();

  if (session.status === "authenticated") {
    router.push("dashboard");
  }

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
