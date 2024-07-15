const SimpleTable = (result: { rows: any[]; fields: any[] }) => {
  return (
    // styled table to display query results
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:bg-gray-800">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {result.fields.map((field: any) => (
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {field.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-800 dark:bg-gray-800 dark:divide-gray-400">
          {result.rows.map((row: any) => (
            <tr>
              {Object.values(row).map((value: any) => (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SimpleTable;
