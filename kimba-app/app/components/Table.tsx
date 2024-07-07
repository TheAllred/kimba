import { PencilSquareIcon } from "@heroicons/react/16/solid";

import React, { useState } from "react";

export default function Table({
  columns,
  contents,
  actionData,
  target_table,
  table_schema,
}: {
  columns: any[];
  contents: any[];
  actionData: any;
  target_table: string;
  table_schema: string;
}) {
  // State to track the clicked indices
  const [clickedIndices, setClickedIndices] = useState<number[]>([]);
  const [isResultVisible, setIsResultVisible] = useState(true);

  const handleRowClick = (index: number) => {
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
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {/* Div that is styled like a table */}
            {/* json of what is in clickedIndices */}
            {/* <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
              <pre>{JSON.stringify(clickedIndices, null, 2)}</pre>
            </div> */}
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <div className="flex flex-row">
                {/* Table heading */}
                {columns.map((column: any) => (
                  <div className="flex-1 p-2 bg-gray-100 border-b border-gray-200">
                    {column.column_name}
                    {/* Json of whats contained in column */}
                    {/* <div className="bg-gray-100 border-b border-gray-200 p-4">
                      <pre>{JSON.stringify(column, null, 2)}</pre>
                    </div> */}
                  </div>
                ))}
              </div>
              {contents.map((content: any, index: number) => {
                const primaryKeyColumn = findPrimaryKey(columns);
                const primaryKey = contents[index][primaryKeyColumn];
                return (
                  // hidden inputs for a form containing clickedIndices and the primary key column name, the form name is delete rows
                  // form is hidden and the submit button is hidden
                  <a
                    key={primaryKey}
                    className={`flex flex-row ${
                      clickedIndices.includes(primaryKey)
                        ? "border-red-500 border-s-2"
                        : ""
                    }`}
                    onClick={() => handleRowClick(primaryKey)}
                    style={{ cursor: "pointer" }}
                  >
                    {columns.map((column: any, index: number) => {
                      return (
                        <div
                          title={column.constraint_type}
                          className="flex-1 p-4 border-b border-gray-200"
                        >
                          {/* {content[columns[index].column_name]} jsonified */}

                          {/* {JSON.stringify(
                            content[columns[index].column_name],
                            null,
                            2
                          )}
                          If the value is anything but a string, json stringify it
                          */}
                          {typeof content[columns[index].column_name] ===
                          "string"
                            ? content[columns[index].column_name]
                            : JSON.stringify(
                                content[columns[index].column_name],
                                null,
                                2
                              )}
                        </div>

                      );
                    })}
                    <a
                      className="border-none bg-transparent text-blue-600 opacity-10 hover:opacity-100"
                      href={`/table/${table_schema}/${target_table}/${primaryKeyColumn}/${primaryKey}`}
                    >
                      <PencilSquareIcon className="h-6 w-6" />
                    </a>
                  </a>
                );
              })}
              {/* INPUT NEW ROW */}
              {/* div styled like a table row */}
              <div className="flex flex-row">
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
                    name: columns[index]["column_name"],
                    form: "newRow",
                    type: "text",
                    className:
                      "block w-full sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-none rounded-md placeholder-gray-500 ml-0 mr-4 my-2",
                    placeholder: columns[index]["column_name"],
                  };
                  if (
                    actionData &&
                    actionData.result.name === "error" &&
                    actionData.object[columns[index]["column_name"]]
                  ) {
                    inputProps = {
                      ...inputProps,
                      defaultValue:
                        actionData.object[columns[index]["column_name"]],
                    };
                  }
                  return <input {...inputProps} />;
                })}
              </div>
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
                Delete Selected
              </button>
            )}
            {/* Display Json of action Data */}
            <div className="mt-4">
              {actionData && actionData.result.name === "error" && (
                <div
                  className={`p-4 bg-red-100 border border-red-600 rounded-md ${
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
                  className={`p-4 bg-green-100 border border-green-600 rounded-md  ${
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
                  <pre>
                    {JSON.stringify(actionData.result.command, null, 2)}
                  </pre>
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
    </div>
  );
}
