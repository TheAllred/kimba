import { PencilSquareIcon } from "@heroicons/react/16/solid";

import { useState } from "react";

export default function Table({
  columns,
  contents,
  actionData,
  table_schema,
  target_table,
}: {
  columns: any[];
  contents: any[];
  actionData: any;
  table_schema: string;
  target_table: string;
}) {
  // State to track the clicked indices
  const [clickedIndices, setClickedIndices] = useState<number[]>([]);
  const [isResultVisible, setIsResultVisible] = useState(true);

  const handleRowClick = (index: number) => {
    console.log("CLICK ME!");
    if (clickedIndices.includes(index)) {
      setClickedIndices(clickedIndices.filter((i) => i !== index));
    } else {
      setClickedIndices([...clickedIndices, index]);
    }
  };

  // function to find column name of primary key using constraint type, else return  first column_name with constraint type of unique else all return null
  const findPrimaryKey = (columns: any[]) => {
    let primaryKey = columns.find(
      (column) => column.constraint_type === "PRIMARY KEY"
    );
    if (primaryKey) {
      return primaryKey.column_name;
    }
    let uniqueKey = columns.find(
      (column) => column.constraint_type === "UNIQUE"
    );
    if (uniqueKey) {
      return uniqueKey.column_name;
    }
    return null;
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 ">
            {/* Div that is styled like a table */}
            {/* json of what is in clickedIndices */}
            {/* <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
              <pre>{JSON.stringify(clickedIndices, null, 2)}</pre>
            </div> */}
            <table className="w-full">
              <thead>
                <tr>
                  {columns.map((column: any) => (
                    <th
                      key={column.column_name}
                      className="p-4 border-b border-gray-200 dark:border-gray-600 dark:text-white text-left"
                    >
                      {column.column_name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contents.map((content: any, index: number) => {
                  const primaryKeyColumn = findPrimaryKey(columns);
                  const primaryKey = content[primaryKeyColumn];
                  return (
                    <tr
                      key={primaryKey}
                      className={`${
                        clickedIndices.includes(primaryKey)
                          ? "border-red-500 border-s-2 dark:border-red-600"
                          : "border-s-2 border-gray-200 dark:border-gray-600 "
                      }`}
                      onClick={() => handleRowClick(primaryKey)}
                    >
                      {columns.map((column: any) => (
                        <td
                          key={column.column_name}
                          title={column.constraint_type}
                          className="flex-1 p-4 border-b border-gray-200 dark:border-gray-600 dark:text-white"
                        >
                          {typeof content[column.column_name] === "string"
                            ? content[column.column_name]
                            : JSON.stringify(
                                content[column.column_name],
                                null,
                                2
                              )}
                        </td>
                      ))}
                      <td className="pl-4 border-b border-gray-200 dark:border-gray-600 dark:text-white w-min">
                        <a
                          className="border-none bg-transparent text-blue-600 dark:text-blue-300 opacity-10 hover:opacity-100 dark:opacity-80"
                          href={`/table/${table_schema}/${target_table}/${primaryKeyColumn}/${primaryKey}`}
                          title="Edit"
                        >
                          <PencilSquareIcon className="h-6 w-6" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <input
                    form="newRow"
                    name="action-KIMBAUSEONLY"
                    type="text"
                    hidden
                    defaultValue={"INSERT"}
                    readOnly
                  ></input>
                  {columns.map((column: any, index: number) => {
                    let inputProps = {
                      name: column["column_name"],
                      form: "newRow",
                      type: "text",
                      className:
                        "block w-full sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 m-0 border-none rounded-md placeholder-gray-500 dark:bg-gray-800 dark:text-white",
                      placeholder: column["column_name"],
                    };
                    if (
                      actionData &&
                      actionData.result.name === "error" &&
                      actionData.object[column["column_name"]]
                    ) {
                      inputProps = {
                        ...inputProps,
                        defaultValue: actionData.object[column["column_name"]],
                      };
                    }
                    return (
                      <td key={index} className=" pt-4 pr-4 whitespace-nowrap">
                        <input {...inputProps} />
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="hidden">
            <input
              form="deleteRows"
              name="action-KIMBAUSEONLY"
              type="text"
              hidden
              defaultValue={"DELETE"}
              readOnly
            ></input>
            <input
              form="deleteRows"
              name="primaryKey"
              type="text"
              hidden
              value={JSON.stringify(clickedIndices)}
              readOnly
            ></input>
            <input
              form="deleteRows"
              name="primaryKeyColumn"
              type="text"
              hidden
              value={findPrimaryKey(columns)}
              readOnly
            ></input>
          </div>
          <button
            type="submit"
            form="newRow"
            className="block sm:text-sm rounded-md text-blue-600 m-4 "
          >
            Insert New Row
          </button>
          {/* delete button */}
          {/* only show delete button if there are items in checkedIndices */}
          {clickedIndices.length > 0 && (
            <button
              type="submit"
              form="deleteRows"
              className="block sm:text-sm border-none rounded-md text-red-600 m-4 "
            >
              Delete Selected ({clickedIndices.length} Row{clickedIndices.length > 1 ? "s" : ""})
            </button>
          )}
          {/* Display Json of action Data */}
          <div className="mt-4">
            {actionData && actionData.result.name === "error" && (
              <div
                className={`p-4 bg-red-100 border border-red-600 dark:bg-red-950 dark:text-white rounded-md overflow-hidden ${
                  !isResultVisible ? "hidden" : ""
                }`}
              >
                <button
                  className="float-right"
                  onClick={() => setIsResultVisible(false)}
                  title="Close"
                >
                  X
                </button>
                <pre>{JSON.stringify(actionData, null, 2)}</pre>
              </div>
            )}
            {actionData && actionData.result.command && (
              <div
                className={`p-4 bg-green-100 border border-green-600 rounded-md dark:bg-green-800 dark:text-white overflow-hidden  ${
                  !isResultVisible ? "hidden" : ""
                }`}
              >
                <button
                  className="float-right"
                  onClick={() => setIsResultVisible(false)}
                  title="Close"
                >
                  X
                </button>
                <pre>{JSON.stringify(actionData.object, null, 2)}</pre>
                <pre>{JSON.stringify(actionData.query, null, 2)}</pre>
                <pre>{JSON.stringify(actionData.result.command, null, 2)}</pre>
                <pre>
                  Row Count :{" "}
                  {JSON.stringify(actionData.result.rowCount, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
