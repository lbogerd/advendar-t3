import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/utils/api";

const DashboardPage = () => {
  const calendarsQuery = api.calendar.getAll.useQuery();

  return (
    <>
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-2">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="italic">{calendarsQuery.data?.length} calendars</p>
        </div>
        <ul className="mx-auto flex w-full flex-col gap-2">
          {calendarsQuery.data?.map((calendar) => (
            <li key={calendar.id} className="group">
              <Link href={`dashboard/${calendar.id}`}>
                <Card className="transition-colors group-hover:border-yellow-300 group-hover:bg-yellow-50">
                  <CardHeader>
                    <CardTitle className="text-lg">{calendar.name}</CardTitle>
                    <CardDescription>{calendar.descripton}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <Button className="sticky bottom-0 right-0">
        <Link href="/dashboard/new">New Calendar</Link>
      </Button>
    </>
  );
};

export default DashboardPage;
