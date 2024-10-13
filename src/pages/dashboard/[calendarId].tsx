import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import CalendarEditForm from "~/components/forms/CalendarEditForm";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { TextArea } from "~/components/ui/text-area";
import { itemSchema, type addItemsSchema } from "~/lib/validation";
import { api } from "~/utils/api";

const CalendarOverview = () => {
  const { calendarId } = useRouter().query;

  const calendarItemsQuery = api.calendar.get.useQuery(
    {
      calendarId: calendarId as string,
    },
    {
      enabled: typeof calendarId === "string",
    },
  );

  if (typeof calendarId !== "string") {
    return <div>Invalid calendar ID</div>;
  }

  if (calendarItemsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (calendarItemsQuery.isError) {
    return <div>Error occurred while fetching calendars.</div>;
  }

  return (
    <>
      <h1 className="pb-3 text-2xl font-bold">Calendar Overview</h1>
      {calendarItemsQuery.data && (
        <>
          <CalendarEditForm
            calendarId={calendarId}
            name={calendarItemsQuery.data.name ?? ""}
            description={calendarItemsQuery.data.description ?? ""}
            shareable={calendarItemsQuery.data.shareable ?? false}
          />

          <hr className="my-6" />

          <ol className="mx-auto flex w-full flex-col gap-2 md:grid md:grid-cols-2">
            {calendarItemsQuery.data.items.map((item) => (
              <li key={item.id} className="group">
                <Card className="flex h-full transition-colors">
                  <CardHeader className="justify-center rounded-l-lg border-r bg-yellow-300">
                    <CardTitle className="w-10 text-center">
                      {item.displayText}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex h-full w-full flex-col items-center justify-center py-2">
                    <CardTitle className="text-lg">
                      {item.contentTitle}
                    </CardTitle>
                    <CardDescription>{item.contentDescription}</CardDescription>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ol>

          <hr className="my-6" />

          <CalendarItemForm calendarId={calendarId} />
        </>
      )}
    </>
  );
};

export default CalendarOverview;

function CalendarItemForm({ calendarId }: { calendarId: string }) {
  const utils = api.useUtils();

  const addItemsMutation = api.calendar.addItems.useMutation({
    async onMutate(data) {
      // cancel possible queries and optimistically update the cache
      await utils.calendar.get.cancel({
        calendarId: data.calendarId,
      });

      const previousData = utils.calendar.get.getData();
      // TODO: make this work properly by limiting the amount of data required by the query
      // possibly by making the query return the calendarId and items only
      utils.calendar.get.setData({ calendarId: data.calendarId }, (oldData) => {
        if (oldData) {
          oldData.items.push(
            ...data.items.map(
              (item) =>
                ({
                  ...item,
                  calendarId: data.calendarId,
                }) as (typeof oldData.items)[number],
            ),
          );
        }

        return oldData;
      });

      return { previousData };
    },
    onError(_error, variables, context) {
      // revert to the previous state
      if (context?.previousData) {
        utils.calendar.get.setData(
          {
            calendarId: variables.calendarId,
          },
          () => context.previousData,
        );
      }
    },
  });

  const form = useForm<z.infer<typeof itemSchema>>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      contentTitle: "",
      contentDescription: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof itemSchema>) => {
    const mutationData: z.infer<typeof addItemsSchema> = {
      calendarId: calendarId,
      items: [data],
    };

    await addItemsMutation.mutateAsync(mutationData, {
      onSuccess: () => {
        // refetch the calendar items
        void utils.calendar.get.refetch({
          calendarId: calendarId,
        });

        form.reset();
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto flex w-full max-w-lg flex-col gap-4"
      >
        <h3 className="text-lg font-medium">Add new calendar item</h3>
        <FormField
          control={form.control}
          name="contentTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Title for the content of the calendar item"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contentDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content description</FormLabel>
              <FormControl>
                <TextArea
                  placeholder="Content for the calendar item"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Add item</Button>
      </form>
    </Form>
  );
}
