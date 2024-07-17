import type { MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import kimbaLogo from "../images/kimbalogo.svg";
import kimbaDemo from "../images/localhost_3000_sql.png";
import pg from "pg";

import { myCookie } from "~/session.server";
export const meta: MetaFunction = () => {
  return [
    { title: "Kimba" },
    { name: "description", content: "The kimba database app" },
  ];
};

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const cookieValueRaw = String(formData.get("cookieValue"));
  const cookieValue = cookieValueRaw.trim();
  const cookieHeader = await myCookie.serialize(cookieValue);
  // check if connection string is valid

  const { Pool } = pg;
  const pool = new Pool({
    connectionString: String(cookieValue),
  });

  try {
    await pool.query("SELECT 1");
  } catch (e) {
    return { error: "Invalid connection string" };
  }

  return redirect("/start/", {
    headers: {
      "Set-Cookie": cookieHeader,
    },
  });
}

export default function Index() {
  const actionData = useActionData();
  return (
    <div className="relative isolate overflow-hidden bg-white">
      <svg
        aria-hidden="true"
        className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
      >
        <defs>
          <pattern
            x="50%"
            y={-1}
            id="0787a7c5-978c-4f66-83c7-11c213f99cb7"
            width={200}
            height={200}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <rect
          fill="url(#0787a7c5-978c-4f66-83c7-11c213f99cb7)"
          width="100%"
          height="100%"
          strokeWidth={0}
        />
      </svg>
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
          <img alt="Kimba Logo" src={kimbaLogo} className="h-24" />
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            <span className="block">The database app for</span>
            <span className="block text-indigo-600">developers</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Kimba is the database app for developers on the go. It's a simple
            and easy-to-use database app that allows you to manage your database
            from anywhere.
          </p>
          <Form method="POST" className="mt-10 flex items-center gap-x-6">
            <input
              type="text"
              name="cookieValue"
              className="rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              placeholder="postgresql://kevinallred:"
            />
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Connect to Database
            </button>
            {actionData?.error && (
              <p className="text-red-500">{actionData.error}</p>
            )}
          </Form>
          <Form method="POST" className="mt-10 flex items-center gap-x-6">
            <input
              hidden
              type="text"
              value={
                "postgresql://kevinallred:ZJC1rCuZGgyEOwv8Pb8K7f4LWIOULJOb@dpg-cqam4mqju9rs739akspg-a.ohio-postgres.render.com/kimba_demo?ssl=true"
              }
              name="cookieValue"
              className="rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 opacity-30 focus-visible:outline-indigo-600"
              placeholder="postgresql://kevinallred:"
            />
            <button
              type="submit"
              className="rounded-md px-3.5 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 opacity-30 focus-visible:outline-indigo-600"
            >
              Connect to demo Database
            </button>
            {actionData?.error && (
              <p className="text-red-500">{actionData.error}</p>
            )}
          </Form>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <img
                alt="App screenshot"
                src={kimbaDemo}
                width={2432}
                height={1442}
                className="w-[76rem] rounded-md shadow-2xl ring-1 ring-gray-900/10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
