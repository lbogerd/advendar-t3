import { appRouter } from "~/server/api/root";
import {
  type InferGetServerSidePropsType,
  type GetServerSideProps,
} from "next";
import util from "node:util";
import {
  type ZodTypeAny,
  type ZodObject,
  z,
  type ZodType,
  type ZodObjectDef,
  type ZodTypeDef,
} from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export const getServerSideProps = (async () => {
  // const test = util.inspect(appRouter, { depth: 15 });
  const allRouters = JSON.stringify(
    Object.keys(appRouter).filter(
      (key) => key !== "_def" && key !== "createCaller",
    ),
  );

  const router1 = appRouter.calendar;

  const time = new Date().toISOString().slice(11, 23);
  const inputSchema = (
    router1.get._def as typeof router1.get._def & {
      inputs: ZodType<unknown, ZodTypeDef, unknown>[];
    }
  ).inputs[0]!;

  const parsed = zodToJsonSchema(inputSchema);

  router1.create._def._input_in;

  // Pass data to the page via props
  return {
    props: {
      test: parsed,
    },
  };
}) satisfies GetServerSideProps;

export default function InternalPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  return (
    <div>
      <h1>Internal Page</h1>
      <pre>{JSON.stringify(props.test)}</pre>
    </div>
  );
}
