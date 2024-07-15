import {
  ActionFunctionArgs,
  DataFunctionArgs,
  redirect,
} from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { Form, useLoaderData, useParams } from "@remix-run/react";
import { getPool } from "~/session.server";

export async function loader(args: DataFunctionArgs) {
  const { params } = args;

  const pool = await getPool(args);
  const target_table = params.tableName;
  const table_schema = params.schema;
  const pkeyColumn = params.pkeyColumn;
  const pkey = params.pkey;

  const contentsQuery = `SELECT * from "${table_schema}"."${target_table}" WHERE ${pkeyColumn} = '${pkey}';`;
  const columnsQuery = `SELECT 
    c.column_name, 
    c.data_type, 
    k.constraint_name, 
    c.is_nullable,
    tc.constraint_type
  FROM 
    information_schema.columns c  
  LEFT JOIN 
    information_schema.key_column_usage k 
  ON 
    k.column_name = c.column_name 
    AND c.table_name = k.table_name  
  LEFT JOIN 
    information_schema.table_constraints tc
  ON 
    tc.constraint_name = k.constraint_name
    AND tc.table_schema = k.table_schema
  WHERE 
    c.table_name = '${target_table}' 
  ORDER BY 
    c.ordinal_position`;

  const columns = await pool.query(columnsQuery);
  const contents = await pool.query(contentsQuery);

  return { contents, columns, target_table, table_schema };
}

export const action = async (args: ActionFunctionArgs) => {
  const pool = await getPool(args);
  const formData = await args.request.formData();

  // remove the action from the form data and assign it to a new variable
  const action = formData.get("action-KIMBAUSEONLY");
  formData.delete("action-KIMBAUSEONLY");
  const tableName = formData.get("tableName");
  formData.delete("tableName");
  const schema = formData.get("schema");
  formData.delete("schema");
  const pkeyColumn = formData.get("pkeyColumn");
  formData.delete("pkeyColumn");
  const pkey = formData.get("pkey");
  formData.delete("pkey");

  switch (action) {
    case "UPDATE":
      const query = `UPDATE ${schema}.${tableName} SET ${Array.from(
        formData.keys()
      )
        .map((key) => `${key}='${formData.get(key)}'`)
        .join(", ")} WHERE ${pkeyColumn}='${pkey}';`;
      const result = await pool.query(query);
      // const result = query;
      return redirect(`..`);
    default:
      // Handle other cases or do nothing

      return null;
  }
};

// Modal to edit row data based on primary key passed in by the url param
export default function Index() {
  let { tableName, pkey, pkeyColumn, schema } = useParams();
  console.log(pkey);
  console.log(tableName);
  console.log(schema);
  console.log(pkeyColumn);

  const actionData = useActionData<typeof action>();
  const data = useLoaderData<typeof loader>();

  return (
    <div className="absolute flex justify-center">
      <Form id="editRow" method="post"></Form>
      <div
        // full screen modal
        className="bg-white p-8 rounded-lg shadow-lg w-96 h-96 "
      >
        {/* ex button that navigates to ../.. */}
        <a href={`..`}>
          <button className="bg-red-500 text-white p-2 rounded-lg">X</button>
        </a>
        {/* Form to edit row data */}
        {/* for each row in columns.rows map an input with a default value using contents.column name */}
        {data.columns.rows.map((column: any) => (
          <div className="flex flex-col">
            <label htmlFor={column.column_name}>{column.column_name}</label>
            <input
              type="text"
              form="editRow"
              id={column.column_name}
              name={column.column_name}
              defaultValue={data.contents.rows[0][column.column_name]}
            />
          </div>
        ))}
        {/* hidden input for the primary key */}
        <input
          type="hidden"
          name="pkeyColumn"
          value={pkeyColumn}
          form="editRow"
        />
        {/* hidden input for the primary key value */}
        <input type="hidden" name="pkey" value={pkey} form="editRow" />

        {/* hidden input for the action */}
        <input
          type="hidden"
          name="action-KIMBAUSEONLY"
          value="UPDATE"
          form="editRow"
        />
        {/* hidden input for table */}
        <input
          type="hidden"
          name="tableName"
          value={tableName}
          form="editRow"
        />
        {/* hidden input for schema */}
        <input type="hidden" name="schema" value={schema} form="editRow" />
        {/* submit button */}
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-lg"
          form="editRow"
        >
          Submit
        </button>
      </div>
      {/* json of whats in form data */}
    </div>
  );
}
