import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { type z } from "zod";
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
import { type addItemsSchema, itemSchema } from "~/lib/validation";
import { api } from "~/utils/api";

const CalendarOverview = () => {
  const { calendarId } = useRouter().query;
  const utils = api.useUtils();

  const calendarItemsQuery = api.calendar.get.useQuery(
    {
      calendarId: calendarId as string,
    },
    {
      enabled: calendarId !== undefined,
    },
  );

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
      displayText:
        // display the number of the day by adding 1 to the length of the items array
        // or 1 if the array is empty
        // FIXME: this is not working properly, it's always 1
        // possible fix: use useEffect to update the default value?
        ((calendarItemsQuery.data?.items?.length ?? 0) + 1).toString(),
      contentTitle: "",
      contentDescription: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof itemSchema>) => {
    const mutationData: z.infer<typeof addItemsSchema> = {
      calendarId: calendarId as string,
      items: [data],
    };

    await addItemsMutation.mutateAsync(mutationData, {
      onSuccess: () => {
        // refetch the calendar items
        void utils.calendar.get.refetch({
          calendarId: calendarId as string,
        });

        form.reset();
      },
    });
  };

  if (calendarItemsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (calendarItemsQuery.isError) {
    return <div>Error occurred while fetching calendars.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1>Calendar Overview</h1>
      {calendarItemsQuery.data && (
        <div>
          <h2>{calendarItemsQuery.data.name}</h2>
          <p>{calendarItemsQuery.data.descripton}</p>
          <ol>
            {calendarItemsQuery.data.items.map((item) => (
              <li key={item.id}>{item.displayText}</li>
            ))}
          </ol>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="displayText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display text</FormLabel>
                    <FormControl>
                      <Input placeholder="Display text" {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a display text for your calendar item.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contentTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content title</FormLabel>
                    <FormControl>
                      <Input placeholder="Content title" {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a content title for your calendar item.
                    </FormDescription>
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
                      <Input placeholder="Content description" {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a content description for your calendar item.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <button type="submit">Add item</button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};

export default CalendarOverview;
