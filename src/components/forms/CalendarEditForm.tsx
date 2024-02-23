import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { updateCalendarSchema } from "~/lib/validation";
import { api } from "~/utils/api";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";

type props = z.infer<typeof updateCalendarSchema>;

export default function CalendarEditForm(defaultValues: props) {
  const utils = api.useUtils();

  const updateCalendarMutation = api.calendar.update.useMutation({
    async onMutate(data) {
      await utils.calendar.get.cancel({
        calendarId: data.calendarId,
      });

      const previousData = utils.calendar.get.getData();
      utils.calendar.get.setData({ calendarId: data.calendarId }, (oldData) => {
        if (oldData) {
          return {
            ...oldData,
            ...data,
          };
        }

        return oldData;
      });

      return { previousData };
    },
    onError: (_error, variables, context) => {
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

  const form = useForm<props>({
    resolver: zodResolver(updateCalendarSchema),
    defaultValues: defaultValues,
  });

  const onSubmit = async (data: props) => {
    await updateCalendarMutation.mutateAsync(data, {
      onSuccess: () => {
        void utils.calendar.get.refetch({
          calendarId: data.calendarId,
        });

        form.reset();
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} required />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Description" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shareable"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="pl-2">
                Make this calendar shareable
              </FormLabel>
            </FormItem>
          )}
        />

        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
