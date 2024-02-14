import {
  type GetStaticPaths,
  GetStaticProps,
  type GetStaticPropsContext,
  type InferGetStaticPropsType,
} from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";

import { db } from "~/server/db";
import { appRouter } from "~/server/api/root";
import superjson from "superjson";

export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>,
) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      db,
      session: null,
    },
    transformer: superjson,
  });

  const calendarId = context.params?.id;

  if (!calendarId) {
    return {
      notFound: true,
    };
  }

  await helpers.calendar.getPublic.prefetch({
    calendarId,
  });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      id: calendarId,
    },
    revalidate: 60,
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const calendars = await db.query.calendars.findMany();
  return {
    paths: calendars.map((calendar) => ({
      params: {
        id: calendar.id,
      },
    })),
    fallback: "blocking",
  };
};

export default function CalendarPage(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  return <div>Calendar {props.id}</div>;
}
