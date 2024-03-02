import { appRouter } from "~/server/api/root";
import {
  type InferGetServerSidePropsType,
  type GetServerSideProps,
} from "next";
import { type ZodTypeAny, type ZodType, type ZodTypeDef } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

// const parseZodObject = (zodObject: ZodTypeAny) => {
//   const shape = zodObject._def.shape();
//   const result: Set<string | Set<string>> = new Set<string | Set<string>>();
//   for (const key in shape) {
//     const value = shape[key];
//     if (value._def.typeName === "ZodObject") {
//       // @ts-ignore
//       result[key] = parseZodObject(value);
//     } else {
//       // @ts-ignore
//       result[key] = value._def.typeName;
//     }
//   }
//   return result;
// };

export const getServerSideProps = (async () => {
  const fullRouter = appRouter;

  const router1 = appRouter.calendar;

  /* eslint-disable */
  const allProcedures = fullRouter._def.procedures;
  const jsonSchemas: any[] = [];

  for (const pathName in allProcedures) {
    const procedure: {
      _def: {
        inputs: ZodTypeAny[];
      };
      // @ts-ignore
    } = allProcedures[pathName];

    const input = procedure?._def?.inputs[0];

    if (input) {
      jsonSchemas.push(zodToJsonSchema(input));
    }

    // // @ts-ignore
    // const inputSchema = input?._def?.shape();

    // // loop through all the inputs for the schema and list them
    // for (const inputKey in inputSchema) {
    //   const input = inputSchema[inputKey];
    //   const inputType = input._def.typeName;

    //   if (inputType === "ZodArray") {
    //     // it's an array, find the type of the items in the array
    //     const arrayItemType = input._def.type._def.typeName;

    //     if (arrayItemType === "ZodObject") {
    //       console.log("arrayItemType:", parseZodObject(input._def.type));
    //     }
    //     console.log("arrayItemType:", arrayItemType);
    //   }
  }
  /* eslint-enable */

  return {
    props: {
      test: jsonSchemas,
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
