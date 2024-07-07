import type { MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
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

export async function loader({ params }: { params: { tableName: string, schema: string } }) {
  const target_table = params.tableName;
  const table_schema = params.schema;

  const contentsQuery = `SELECT * from ${table_schema}.${target_table};`;
  const columnsQuery = `SELECT 
    c.column_name, 
    c.data_type, 
    k.constraint_name, 
    c.is_nullable,
    tc.constraint_type
  FROM 
    information_schema.columns c  
  LEFT JOIN 
    information_schema.key_column_usage k 
  ON 
    k.column_name = c.column_name 
    AND c.table_name = k.table_name  
  LEFT JOIN 
    information_schema.table_constraints tc
  ON 
    tc.constraint_name = k.constraint_name
    AND tc.table_schema = k.table_schema
  WHERE 
    c.table_name = '${target_table}' 
  ORDER BY 
    c.ordinal_position`;

  const columns = await pool.query(columnsQuery);
  const contents = await pool.query(contentsQuery);

  return { contents, columns, target_table, table_schema };
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
    case "DELETE": {
      // take the primary key column from the form data and make a query that deletes the rows with the primary key
      const primaryKeyColumn = Object.values(Object.fromEntries(formData))[1];
      const primaryKey = JSON.parse(formData.get("primaryKey")); // Assuming primaryKey is a JSON string of an array
      const primaryKeys = primaryKey
        .map((value) => {
          const stringValue = String(value); // Convert value to string to safely call .replace
          return `'${stringValue.replace(/'/g, "''")}'`;
        })
        .join(", ");
      const query = `DELETE FROM public.${target_table} WHERE ${primaryKeyColumn} IN (${primaryKeys});`;
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
      <Form id="deleteRows" method="post" reloadDocument></Form>
      <Table
        target_table={data.target_table}
        table_schema={data.table_schema}
        columns={data.columns.rows}
        contents={data.contents.rows}
        actionData={actionData}
      />
      {/* json of what is contained in columns */}
      {/* <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
        <pre>{JSON.stringify(data.target_table, null, 2)}</pre>
      </div> */}
      {/* relative position div */}
      <div className="relative ">
        <Outlet />
      </div>
    </>
  );
}
