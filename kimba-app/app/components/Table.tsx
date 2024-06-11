import { act } from "react-dom/test-utils";

export default function Table({ columns, contents, actionData }: any) {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center"></div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  {columns.map((column: any) => (
                    <th
                      key={column.column_name}
                      className=" sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                    >
                      {column.column_name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* DISPLAY ROWS IN DATABASE */}
                {contents.map((content: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {columns.map((column: any, index: number) => (
                      <th
                        key={index}
                        className="py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        <input
                          type="text"
                          about={columns[index].column_name}
                          className="block w-full sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-none rounded-md placeholder-gray-900"
                          defaultValue={content[columns[index].column_name]}
                          // if constraint name ends with _pkey, then it is a primary key and should be disabled
                          disabled
                          // disabled={columns[index].constraint_name?.endsWith(
                          //   "_pkey"
                          // )}
                        />
                      </th>
                    ))}
                  </tr>
                ))}

                {/* INPUT NEW ROW */}
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
                      name: columns[index]["column_name"],
                      form: "newRow",
                      type: "text",
                      className:
                        "block w-full sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-none rounded-md placeholder-gray-500",
                      placeholder: columns[index]["column_name"],
                      disabled:
                        columns[index]["constraint_name"]?.endsWith("_pkey"),
                      // required: columns[index].is_nullable,
                    };

                    // if actionData.result.name === "error" then set the input to have an error border and fill the default value as the column name
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

                    return (
                      <th
                        key={index}
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        <input {...inputProps} />
                      </th>
                    );
                  })}
                  {/* Save button */}
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-indigo-500">
                    <button
                      type="submit"
                      form="newRow"
                      className="block w-full sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-none rounded-md"
                    >
                      Save
                    </button>
                  </th>
                </tr>
              </tbody>
            </table>
            {/* Display Json of action Data */}
            <div className="mt-4">
              {actionData && actionData.result.name === "error" && (
                <div className="p-4 bg-red-100 border border-red-600 rounded-md">
                  <pre>{JSON.stringify(actionData, null, 2)}</pre>
                </div>
              )}
              {actionData && actionData.result.command && (
                <div className="p-4 bg-green-100 border border-green-600 rounded-md">
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
