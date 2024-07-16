import type {
  ActionFunctionArgs,
  DataFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  Form,
  Outlet,
  useActionData,
  useLoaderData,
  Await,
  defer,
} from "@remix-run/react";
import { Suspense } from "react";
import LoaderSkeleton from "~/components/LoaderSkeleton";
import Table from "~/components/Table";
import { getPool } from "~/session.server";

export const meta: MetaFunction = ({ params }) => {
  const target_table = params.tableName;
  return [
    { title: target_table + " - Kimba" },
    { name: "description", content: "The kimba database app" },
  ];
};

export async function loader(args: DataFunctionArgs) {
  const pool = await getPool(args);
  const target_table = args.params.tableName;
  const table_schema = args.params.schema;

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

  const columnsPromise = await pool.query(columnsQuery);
  const contentsPromise = pool.query(contentsQuery);

  return defer({
    contents: contentsPromise,
    columns: columnsPromise,
    target_table,
    table_schema,
  });
}

// Note the "action" export name, this will handle our form POST
export const action = async (args: ActionFunctionArgs) => {
  const pool = await getPool(args);
  const target_table = args.params.tableName;
  const formData = await args.request.formData();
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
  const {
    contents: contents,
    columns: columns,
    target_table,
    table_schema,
  } = useLoaderData<typeof loader>();
  return (
    <div className=" dark:bg-gray-900">
      {/* reload Form on submission */}
      <div className="relative  ">
        <Outlet />
      </div>
      <Form id="newRow" method="post" reloadDocument></Form>
      <Form id="deleteRows" method="post" reloadDocument></Form>
      <Suspense fallback={<LoaderSkeleton />}>
        <Await resolve={contents}>
          {(contents) => (
            <Table
              target_table={target_table}
              table_schema={table_schema}
              columns={columns.rows}
              contents={contents.rows}
              actionData={actionData}
            />
          )}
        </Await>
      </Suspense>
    </div>
  );
}
