import type { MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import NavSideBar from "~/components/NavSideBar";
import Table from "~/components/Table";
import pool from "~/db";

export const meta: MetaFunction = () => {
  return [
    { title: "Kimba" },
    { name: "description", content: "The kimba database app" },
  ];
};

export async function loader() {
  const tables = await pool.query(
    `SELECT table_name, table_schema FROM information_schema.tables
    WHERE table_schema  != 'pg_catalog' 
    AND table_schema != 'information_schema'`
  );
  return { tables };
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Hello World!</h1>
    </div>
  );
}
