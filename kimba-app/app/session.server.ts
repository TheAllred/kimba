// postgresql://kevinallred@localhost:5432/kimba_dev
// postgresql://kevinallred:ZJC1rCuZGgyEOwv8Pb8K7f4LWIOULJOb@dpg-cqam4mqju9rs739akspg-a.ohio-postgres.render.com/kimba_demo?ssl=true
import {
  DataFunctionArgs,
  AppLoadContext,
  createCookie,
  redirect,
} from "@remix-run/node";
import pg from "pg";
const { Pool } = pg;

type GetterFn<T> = (args: DataFunctionArgs) => T;

// Create an HTTP-only cookie
export const myCookie = createCookie("connection-string", {
  httpOnly: true,
  secure: false, // Set to false if you're not using HTTPS during development
  sameSite: "strict",
  path: "/",
  maxAge: 3600, // 1 hour in seconds
});

export function createGetter<T>(fn: GetterFn<T>) {
  let weakMap = new WeakMap<AppLoadContext, T>();

  return function (args: DataFunctionArgs) {
    const key = args.context;

    if (weakMap.has(key)) {
      return weakMap.get(key)!;
    }

    let result = fn(args);
    weakMap.set(key, result);

    return result;
  };
}

export const getPool = createGetter(async function getPool(
  args: DataFunctionArgs
) {
  const connectionString = await getCookieValue(args);
  if (!connectionString) {
    throw redirect("/", {
      headers: {
        "Set-Cookie": await myCookie.serialize(""),
      },
    });
  }

  const pool = new Pool({
    connectionString: await getCookieValue(args),
  });

  return pool;
});

export async function getCookieValue(args: DataFunctionArgs) {
  const cookieValue = await myCookie.parse(
    args.request.headers.get("Cookie") || ""
  );
  return cookieValue;
}
