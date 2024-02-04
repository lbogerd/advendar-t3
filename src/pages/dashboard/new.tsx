import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { createCalendarSchema } from "~/lib/validation";
import { api } from "~/utils/api";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useRouter } from "next/router";
import { Button } from "~/components/ui/button";
import { TextArea } from "~/components/ui/text-area";

export default function New() {
  const router = useRouter();

  const form = useForm<z.infer<typeof createCalendarSchema>>({
    resolver: zodResolver(createCalendarSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const createCalendarMutation = api.calendar.create.useMutation();

  const onSubmit = async (data: z.infer<typeof createCalendarSchema>) => {
    await createCalendarMutation.mutateAsync(data, {
      onSuccess: (data) => {
        void router.push(`/dashboard/${data[0]!.id}`);
      },
    });
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <h1 className="text-2xl font-bold">New Calendar</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full max-w-lg flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Calendar name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="What is your calendar called?"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Calendar description</FormLabel>
                <FormControl>
                  <TextArea
                    placeholder="What is the calendar for?"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Create calendar</Button>
        </form>
      </Form>
    </div>
  );
}
