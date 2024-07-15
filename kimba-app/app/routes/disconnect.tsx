// ignore typescript error
// @ts-ignore
import type { DataFunctionArgs, MetaFunction } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";

import { getCookieValue, myCookie } from "~/session.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Kimba" },
    { name: "description", content: "The kimba database app" },
  ];
};

export async function loader(args: DataFunctionArgs) {
  const cookieHeader = await myCookie.serialize("");

  return redirect("/", {
    headers: {
      "Set-Cookie": cookieHeader,
    },
  });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return <div>Disconnecting</div>;
}
