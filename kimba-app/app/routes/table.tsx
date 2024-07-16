import type { DataFunctionArgs, MetaFunction } from "@remix-run/node";
import { Await, defer, Outlet, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import LoaderSkeleton from "~/components/LoaderSkeleton";
import NavSideBar from "~/components/NavSideBar";
import NavSideBarSkeleton from "~/components/NavSideBarSkeleton";
import { getCookieValue, getPool } from "~/session.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Kimba" },
    { name: "description", content: "The kimba database app" },
  ];
};

export async function loader(args: DataFunctionArgs) {
  const pool = await getPool(args);
  const tablesPromise = pool.query(
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
  return defer({ tables: tablesPromise, dataBaseName });
}

export default function Index() {
  const { tables, dataBaseName } = useLoaderData<typeof loader>();

  return (
    <>
      <Suspense fallback={<NavSideBarSkeleton />}>
        <Await resolve={tables}>
          {(tables) => (
            <NavSideBar tables={tables.rows} databaseName={dataBaseName}>
              <Outlet />
            </NavSideBar>
          )}
        </Await>
      </Suspense>
    </>
  );
}
