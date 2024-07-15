import type { DataFunctionArgs, MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import NavSideBar from "~/components/NavSideBar";
import { getCookieValue, getPool } from "~/session.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Kimba" },
    { name: "description", content: "The kimba database app" },
  ];
};

export async function loader(args: DataFunctionArgs) {
  const pool = await getPool(args);
  const { rows: tables } = await pool.query(
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
  const dataBaseNamePre = connectionString.split("/")[3];
  // remove any thing after ? if there is in the database name
  const dataBaseName = dataBaseNamePre.split("?")[0];
  return { tables, dataBaseName };
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <NavSideBar tables={data.tables} databaseName={data.dataBaseName}>
        <Outlet />
      </NavSideBar>
    </>
  );
}
