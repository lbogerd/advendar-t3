import { createServerSideHelpers } from "@trpc/react-query/server";
import { subDays } from "date-fns";
import { and, eq, gt } from "drizzle-orm";
import {
  type GetStaticPaths,
  type GetStaticPropsContext,
  type InferGetStaticPropsType,
} from "next";
import { useState } from "react";
import superjson from "superjson";
import type { ItemsArrayType } from "~/lib/types";
import { cn } from "~/lib/utils";
import { appRouter } from "~/server/api/root";
import { db } from "~/server/db";
import { calendars } from "~/server/db/schema";
import { api, type RouterOutputs } from "~/utils/api";

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
  const recentShareableCalendars = await db.query.calendars.findMany({
    where: and(
      gt(calendars.updatedAt, subDays(new Date(), 7)),
      eq(calendars.shareable, true),
    ),
  });

  return {
    paths: recentShareableCalendars.map((calendar) => ({
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
  const { id } = props;
  const calendarQuery = api.calendar.getPublic.useQuery({ calendarId: id });

  if (calendarQuery.error) {
    return <div>Error: {calendarQuery.error.message}</div>;
  }

  if (calendarQuery.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
      {calendarQuery.data?.items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          canBeOpened={true}
          initialState="partiallyOpen"
        />
      ))}
    </div>
  );
}

type CardItem = ItemsArrayType<RouterOutputs["calendar"]["getPublic"]>[number];
type CardOpenState = "closed" | "partiallyOpen" | "open";

function ItemCard({
  item,
  canBeOpened,
  initialState,
}: {
  item: CardItem;
  canBeOpened: boolean;
  initialState: CardOpenState;
}) {
  const [currentOpenState, setCurrentOpenState] = useState(initialState);

  return (
    <div
      className="group relative aspect-square h-full w-full overflow-hidden rounded shadow-inner"
      data-testClass="calendarItemCard"
    >
      <div
        className={cn(
          "absolute left-0 top-0 z-10 h-full w-full items-center justify-center overscroll-contain rounded-t bg-yellow-300 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] transition ease-in-out @container",
          currentOpenState === "open" ? "hidden" : "flex",
          currentOpenState === "partiallyOpen" ? "translate-y-8" : "",
          canBeOpened && currentOpenState !== "open"
            ? "group-hover:translate-y-full"
            : "",
        )}
      >
        <h2 className="text-lg font-bold">{item.displayText}</h2>
      </div>
      <div
        className={cn(
          "absolute left-0 z-0 h-full w-full bg-purple-300 p-2 text-sm",
          currentOpenState === "closed" ? "hidden" : "block",
        )}
      >
        <h2 className="mb-2 font-bold">{item.contentTitle}</h2>
        <p className="h-[85%] overflow-y-auto">{item.contentDescription}</p>
      </div>
    </div>
  );
}
