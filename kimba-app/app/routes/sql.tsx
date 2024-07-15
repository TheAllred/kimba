// ignore typescript error
// @ts-ignore
import type {
  ActionFunctionArgs,
  DataFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  Form,
  Outlet,
  redirect,
  useActionData,
  useLoaderData,
} from "@remix-run/react";
import NavSideBar from "~/components/NavSideBar";
import ResultMessage from "~/components/ResultMessage";
import SimpleTable from "~/components/SimpleTable";
import { getCookieValue, getPool } from "~/session.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Kimba" },
    { name: "description", content: "The kimba database app" },
  ];
};

export async function loader(args: DataFunctionArgs) {
  const pool = await getPool(args);

  const tables = await pool.query(
    `SELECT 
  table_schema, 
  jsonb_agg(table_name) AS tables
FROM 
  information_schema.tables 
WHERE 
  table_schema != 'pg_catalog' 
  AND table_schema != 'information_schema' 
GROUP BY 
  table_schema 
ORDER BY 
  table_schema;`
  );

  const connectionString = await getCookieValue(args);
  const databaseName = connectionString.split("/")[3];

  return { tables, databaseName };
}

// action
export const action = async (args: DataFunctionArgs) => {
  const pool = await getPool(args);
  const formData = await args.request.formData();
  const sql = formData.get("sql");
  if (sql !== null) {
    try {
      const result = await pool.query(String(sql));
      console.log(result.rows);
      return { sql, result };
    } catch (e) {
      return { sql, error: e.message };
    }
  } else {
    return { sql, error: "No SQL query provided" };
  }
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <NavSideBar tables={data.tables.rows} databaseName={data.databaseName}>
        {/* Large text input inside a form  */}
        <Form className="p-4" method="post" reloadDocument>
          <label className="block text-sm font-medium text-gray-700"></label>
          <textarea
            name="sql"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows={3}
            placeholder="SELECT * FROM table;"
            // if sql exists set it to be default value
            {...(actionData?.sql && { defaultValue: actionData.sql })}

            // defaultValue={"select * from states;"}
          ></textarea>
          {/* Disclaimer */}
          <p className="mt-2 text-sm text-gray-500">
            * Write your SQL query in the text area above. Zero security
            measures, use at your own risk.
          </p>
          <button
            type="submit"
            className="mt-2 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Execute
          </button>
        </Form>
        {/* Display the result of the query */}

        {actionData?.result && (
          <div className="flex-col space-y-6">
            <ResultMessage message={actionData.result} />
            <SimpleTable
              rows={actionData.result.rows}
              fields={actionData.result.fields}
            />
          </div>
        )}
      </NavSideBar>
    </div>
  );
}
