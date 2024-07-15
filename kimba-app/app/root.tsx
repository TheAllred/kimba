import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";

import type { LinksFunction } from "@remix-run/node";
import stylesheet from "~/tailwind.css";
import favicon from "./images/favicon.ico";

export const links: LinksFunction = () => [
  {
    rel: "icon",
    href: favicon,
    type: "image/png",
  },
  { rel: "stylesheet", href: stylesheet },
];
export default function App() {
  return (
    <html lang="en" className="h-full bg-white">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full  dark:bg-gray-900">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <html>
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        {/* design a cool modal at the center of the page */}
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-4xl text-gray-800">
            {isRouteErrorResponse(error)
              ? `${error.status} ${error.statusText}`
              : error instanceof Error
                ? error.message
                : "Unknown Error"}
          </h1>
          <h2>How did we get here?</h2>
          <br />
          <h2>What did you do??</h2>
        </div>
        <h1 className="text-4xl text-gray-900">Hi Mom</h1>
        <Scripts />
      </body>
    </html>
  );
}
