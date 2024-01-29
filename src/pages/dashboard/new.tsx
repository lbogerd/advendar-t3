import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { createCalendarSchema } from "~/lib/validation";
import { api } from "~/utils/api";
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
import { useRouter } from "next/router";

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
    <main className="flex flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold">New Calendar</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calendar name</FormLabel>
                    <FormControl>
                      <Input placeholder="Calendar name" {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a name for your calendar.
                    </FormDescription>
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
                      <Input placeholder="Calendar description" {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a description for your calendar.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <button type="submit">Create calendar</button>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}
