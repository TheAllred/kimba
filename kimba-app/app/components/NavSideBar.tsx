import { Fragment, useState } from "react";

import kimbaLogo from "../images/kimbalogo.svg";
import kevinPic from "../images/IMG_1122.jpg";

import {
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  Cog6ToothIcon,
  TableCellsIcon,
  XMarkIcon,
  CommandLineIcon,
  CircleStackIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { getCookieValue } from "~/session.server";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import handleRequest from "~/entry.server";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function NavSideBar({
  children,
  tables,
  databaseName,
}: {
  children: any;
  tables: any;
  databaseName: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleDisconnect() {}

  return (
    <>
      <div>
        <Transition show={sidebarOpen}>
          <Dialog className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
            <TransitionChild
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </TransitionChild>

            <div className="fixed inset-0 flex">
              <TransitionChild
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <TransitionChild
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </TransitionChild>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 dark:bg-black dark:text-white">
                    <div className="flex h-16 shrink-0 items-center">
                      <img
                        className="pt-1 h-16 w-auto aspect-square"
                        src={kimbaLogo}
                        alt="Kimba"
                      />
                      <h1 className="text-2xl">Kimba</h1>
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {
                              // tables is an object with table_schema being the name of the schema. tables is an array of table names. I want the nav to be a list of schemas with the tables as children links that have an href as /table/${table.table_schema}/${table.table_name}
                              tables.map((schema: any) => (
                                <div>
                                  {/* Small title for displaying the schema name */}

                                  <span className="text-m font-semibold text-blue-500 dark:text-blue-400 border-b-4 dark:border-gray-600">
                                    {schema.table_schema}
                                  </span>

                                  {schema.tables.map((table: any) => (
                                    <li key={table}>
                                      <a
                                        href={`/table/${schema.table_schema}/${table}`}
                                        className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-600 dark:hover:bg-gray-800 "
                                      >
                                        <TableCellsIcon
                                          className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                                          aria-hidden="true"
                                        />
                                        {table}
                                      </a>
                                    </li>
                                  ))}
                                </div>
                              ))
                            }
                          </ul>
                        </li>
                        <li className="mt-auto">
                          <a
                            href={"/sql"}
                            className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-600 dark:hover:bg-gray-800"
                          >
                            <CommandLineIcon
                              className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                              aria-hidden="true"
                            />
                            SQL Query
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </Dialog>
        </Transition>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-5 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4 dark:bg-gray-900 dark:border-gray-800 dark:text-white ">
            {/* Give this element some more padding */}
            <div className="flex h-16 shrink-0 items-center">
              <img
                className="h-24 pt-4 w-auto aspect-square"
                src={kimbaLogo}
                alt="Kimba Logo"
              />
              <h1 className="text-2xl">Kimba</h1>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {
                      // tables is an object with table_schema being the name of the schema. tables is an array of table names. I want the nav to be a list of schemas with the tables as children links that have an href as /table/${table.table_schema}/${table.table_name}
                      tables.map((schema: any) => (
                        <div>
                          {/* Small title for displaying the schema name */}

                          <span className="text-m font-semibold text-blue-500 border-b-4 dark:text-blue-400 dark:border-gray-800">
                            {schema.table_schema}
                          </span>

                          {schema.tables.map((table: any) => (
                            <li key={table}>
                              <a
                                href={`/table/${schema.table_schema}/${table}`}
                                className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600  dark:text-white dark:hover:text-indigo-600 dark:hover:bg-gray-800"
                              >
                                <TableCellsIcon
                                  className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                                  aria-hidden="true"
                                />
                                {table}
                              </a>
                            </li>
                          ))}
                        </div>
                      ))
                    }
                  </ul>
                </li>
                <li className="mt-auto">
                  <a
                    href={"/sql"}
                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600  dark:text-white dark:hover:text-indigo-600 dark:hover:bg-gray-800"
                  >
                    <CommandLineIcon
                      className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                      aria-hidden="true"
                    />
                    SQL Query
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72 dark:bg-gray-900 dark:border-gray-900">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 dark:bg-gray-900">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div
              className="h-6 w-px bg-gray-200 dark:bg-gray-600 lg:hidden"
              aria-hidden="true"
            />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="relative flex flex-1"></div>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                {/* Separator */}
                <div
                  className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:bg-gray-600"
                  aria-hidden="true"
                />

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <MenuButton className="-m-1.5 flex items-center p-1.5">
                    <span className="sr-only">Open user menu</span>
                    {/* database icon */}
                    <CircleStackIcon
                      className="h-6 w-6 text-gray-400"
                      aria-hidden="true"
                    />
                    <span className="hidden lg:flex lg:items-center">
                      <span
                        className="ml-4 text-sm font-semibold leading-6 text-gray-900 dark:text-gray-200"
                        aria-hidden="true"
                      >
                        {databaseName}
                      </span>
                      <ChevronDownIcon
                        className="ml-2 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </MenuButton>
                  <Transition
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <MenuItems className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                      <MenuItem key="Disconnect">
                        {({ focus }) => (
                          <a
                            href="/disconnect"
                            className={classNames(
                              focus
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700",
                              "block px-4 py-2 text-sm"
                            )}
                          >
                            Disconnect
                          </a>
                        )}
                      </MenuItem>
                    </MenuItems>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
}
