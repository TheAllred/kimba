import {
  ChevronDoubleDownIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/16/solid";
import React, { useState } from "react";

const ResultMessage: React.FC = (result) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`p-4 bg-gray-100 border border-gray-600 rounded-md  overflow-y-auto relative overflow-hidden dark:bg-gray-800 dark:text-white ${
        isCollapsed ? "max-h-24 " : ""
      }`}
      onClick={toggleCollapse}
    >
      <button className="absolute top-4 left-4">
        {isCollapsed ? (
          <ChevronDoubleRightIcon className="h-6 w-6 fill-blue-600" />
        ) : (
          <ChevronDoubleDownIcon className="h-6 w-6 fill-blue-600" />
        )}
      </button>
      <pre className="m-6">{JSON.stringify(result.message, null, 2)}</pre>
    </div>
  );
};

export default ResultMessage;
