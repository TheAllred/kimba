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
import SimpleBarChart from "~/components/SimpleBarChart";
import SimpleTable from "~/components/SimpleTable";
import { getCookieValue, getPool } from "~/session.server";
import OpenAI from "openai";
import { XAxis } from "recharts";

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
  const databaseNamePre = connectionString.split("/")[3];
  const databaseName = databaseNamePre.split("?")[0];

  return { tables, databaseName };
}

// action
export const action = async (args: DataFunctionArgs) => {
  const openai = new OpenAI({
    organization: "org-TNg6rKmxnR3F1jcZbF96za1S",
    project: "proj_D8c6FHDHyMOmAmRsjOMrpS8a",
    apiKey: process.env.OPENAI_API_KEY,
  });
  const formData = await args.request.formData();
  const pool = await getPool(args);

  // get intent
  const intent = formData.get("intent");
  switch (intent) {
    case "execute": {
      const sql = formData.get("sql");
      try {
        const result = await pool.query(sql);
        return { result, sql };
      } catch (error) {
        return { result: error, sql };
      }
    }
    case "askGPT": {
      const prompt = formData.get("prompt");
      const columns = await pool.query(
        `select table_schema, table_name, column_name, data_type from information_schema.columns where table_schema != 'pg_catalog' and table_schema != 'information_schema'`
      );

      try {
        // Use OpenAI's chat.completions.create method for ChatGPT
        const stream = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are an expert database administrator. The user will ask you to create queries based on the database schema provided. In all of your responses, you should assume that the user has the necessary permissions to access the database. Respond only with SQL queries. Do not provide any other information or context. Do not provide any information about the database schema or the data in the database. If the table is not provided in the context given you, IT DOES NOT EXIST DO NOT ASSUME IT DOES.",
            },
            {
              role: "system",
              content:
                "Here is JSON representation of the database schema:\n    " +
                JSON.stringify(columns),
            },
            { role: "user", content: prompt },
          ],
          stream: true,
        });

        let responseContent = "";
        for await (const chunk of stream) {
          responseContent += chunk.choices[0]?.delta?.content || "";
        }

        // Return the response content
        return { responseContent };
      } catch (error) {
        // Handle errors here
        console.error("Error calling OpenAI:", error);
        throw new Error("Failed to generate response from OpenAI.");
      }
    }
    default:
      return { error: "Invalid intent" };
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
          {/* hidden intent input */}
          <input type="hidden" name="intent" value="execute" />
          <label className="block text-sm font-medium text-gray-700">
            Run SQL
          </label>
          <textarea
            name="sql"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows={3}
            required
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
          <p className="mt-2 text-sm text-gray-500">
            * Kimba will attempt to make a bar chart of any query that returns
            2+ fields. The first field will be the x-axis and the second field
            will be the y-axis.
          </p>
          <button
            type="submit"
            className="mt-2 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Execute
          </button>
        </Form>
        {/* GPT form */}
        {actionData?.responseContent && (
          <>
            <pre className="p-4 bg-gray-100">{actionData.responseContent}</pre>
          </>
        )}
        <Form className="p-4" method="post" reloadDocument>
          {/* hidden intent input */}
          <input type="hidden" name="intent" value="askGPT" />
          <label className="block text-sm font-medium text-gray-700">
            Ask GPT
          </label>
          <textarea
            name="prompt"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows={3}
            required
            placeholder="Ask GPT"
          ></textarea>
          <button
            type="submit"
            className="mt-2 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Ask GPT
          </button>
        </Form>

        {actionData?.result &&
          (Array.isArray(actionData.result) ? (
            actionData.result.map((item, index) => (
              <div key={index}>
                <ResultMessage message={item} />
                <SimpleTable rows={item.rows} fields={item.fields} />
              </div>
            ))
          ) : (
            // Handle the case where actionData.result is not an array (e.g., an object)
            <div className="flex-col space-y-6">
              <ResultMessage message={actionData} />
              {actionData.result.rows && (
                <>
                  <SimpleTable
                    rows={actionData.result.rows}
                    fields={actionData.result.fields}
                  />
                  {actionData.result.fields &&
                    actionData.result.fields.length > 0 &&
                    actionData.result.fields[0].name &&
                    actionData.result.fields[1] &&
                    actionData.result.fields[1].name && (
                      <div className="h-screen w-screen">
                        <SimpleBarChart
                          data={actionData.result.rows}
                          xAxis={actionData.result.fields[0].name}
                          yAxis={actionData.result.fields[1].name}
                        />
                      </div>
                    )}
                </>
              )}
            </div>
          ))}
      </NavSideBar>
    </div>
  );
}
