import { useRouter } from "next/router";
import { api } from "~/utils/api";

const CalendarOverview = () => {
  // get calendarId from url
  const { calendarId } = useRouter().query;

  const { data, isLoading, isError } = api.calendar.get.useQuery(
    {
      calendarId: calendarId as string,
    },
    {
      enabled: calendarId !== undefined,
    },
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error occurred while fetching calendars.</div>;
  }

  return (
    <div>
      <h1>Calendar Overview</h1>
      {data && (
        <div>
          <h2>{data.name}</h2>
          <p>{data.descripton}</p>
        </div>
      )}
    </div>
  );
};

export default CalendarOverview;
