import React from "react";

const ItemList = ({ title, items }: { title: string; items: string[] }) => {
  if (items[0] == "" || items.length == 0) return null;
  return (
    <div style={{ opacity: 1, transform: "none" }}>
      <div className="p-6 rounded-xl bg-gray-50">
        <h3 className="text-lg font-bold mb-4 text-gray-900">{title}</h3>
        <ul className="space-y-2">
          {items.map((text, index) => (
            <li key={index} className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-check-circle h-4 w-4 text-green-500"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <path d="m9 11 3 3L22 4"></path>
              </svg>
              <span className="text-sm text-gray-600">{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ItemList;
