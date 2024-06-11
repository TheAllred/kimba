import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Table from "~/components/Table";
import pool from "~/db";

import { Form } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { useActionData } from "@remix-run/react";

export const meta: MetaFunction = ({
  params,
}: {
  params: { tableName: string };
}) => {
  const target_table = params.tableName;
  return [
    { title: target_table + " - Kimba" },
    { name: "description", content: "The kimba database app" },
  ];
};

export async function loader({ params }: { params: { tableName: string } }) {
  const target_table = params.tableName;

  const contentsQuery = `SELECT * from public.${target_table};`;
  const columnsQuery = `SELECT c.column_name, c.data_type, k.constraint_name, c.is_nullable from information_schema.columns c  left join information_schema.key_column_usage k on k.column_name = c.column_name and c.table_name = k.table_name  where c.table_name = '${target_table}' order by c.ordinal_position;`;
  const columns = await pool.query(columnsQuery);
  const contents = await pool.query(contentsQuery);

  return { contents, columns };
}

// Note the "action" export name, this will handle our form POST
export const action = async ({ request, params }: ActionFunctionArgs) => {
  const target_table = params.tableName;
  const formData = await request.formData();
  // remove the action from the form data and assign it to a new variable
  const action = formData.get("action-KIMBAUSEONLY");
  formData.delete("action-KIMBAUSEONLY");


  switch (action) {
    case "INSERT": {
      const query = `INSERT INTO public.${target_table} (${Object.keys(
        Object.fromEntries(formData)
      ).join(", ")}) VALUES (${Object.values(Object.fromEntries(formData))
        // map values to strings but if its null return null
        .map((value) => (value ? `'${value}'` : "null"))
        .join(",")});`;

      let queryResult;
      let queryError;
      try {
        queryResult = await pool
          .query(query)
          .then((res) => res)
          .catch((err) => err);
      } catch (error) {
        queryError = error;
      }
      return {
        object: Object.fromEntries(formData),
        result: queryResult,
        query: query,
      };
    }
    default:
      // Handle other cases or do nothing

      return null;
  }
};

export default function Index() {
  const actionData = useActionData<typeof action>();
  const data = useLoaderData<typeof loader>();
  return (
    <>
      {/* reload Form on submission */}
      <Form id="newRow" method="post" reloadDocument></Form>
      <Table
        columns={data.columns.rows}
        contents={data.contents.rows}
        actionData={actionData}
      />
    </>
  );
}
