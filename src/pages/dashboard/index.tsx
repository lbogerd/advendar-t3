import Link from "next/link";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";

const DashboardPage = () => {
  const calendarsQuery = api.calendar.getAll.useQuery();

  return (
    <main className="flex flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-center text-2xl italic">
            {calendarsQuery.data?.length} calendars
          </p>

          <ul className="flex flex-col gap-2">
            {calendarsQuery.data?.map((calendar) => (
              <li key={calendar.id}>
                <Link href={`dashboard/${calendar.id}`}>{calendar.name}</Link>
              </li>
            ))}
          </ul>

          <Button>
            <Link href="/dashboard/new">New Calendar</Link>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
