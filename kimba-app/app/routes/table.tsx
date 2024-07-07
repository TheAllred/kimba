import type { MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import NavSideBar from "~/components/NavSideBar";
import pool from "~/db";

export const meta: MetaFunction = () => {
  return [
    { title: "Kimba" },
    { name: "description", content: "The kimba database app" },
  ];
};

export async function loader() {
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
  return { tables };
}

export default function Index() {
  const data = useLoaderData<typeof loader>();



  return (
    <div>
      <NavSideBar tables={data.tables.rows}>
        <Outlet />
      </NavSideBar>
    </div>
  );
}
