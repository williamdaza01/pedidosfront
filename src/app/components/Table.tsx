"use client";
import { TableColumn, TableRow } from "@/types/TableTypes";
import React, { useState } from "react";
import Modal from "./Modal";

interface TableProps {
  columns: TableColumn[];
  rows: TableRow[];
}

const Table = ({ columns, rows }: { columns: string[]; rows: any[][] }) => {
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleModalOpen = (content: string) => {
    console.log(content);
    
    setModalContent(content);
    setShowModal(true);
  };

  console.log(modalContent);
  

  const handleModalClose = () => {
    setModalContent(null);
  };

  return (
    <div>
      <table className="w-full rounded-md overflow-hidden">
        <thead className="bg-gray-200 text-black">
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="py-2 px-4">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white text-slate-700 text-center">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => {
                if (columns[cellIndex] === "is_paid") {
                  return (
                    <td key={cellIndex} className="py-2 px-4">
                      <input type="checkbox" checked={cell} readOnly />
                    </td>
                  );
                } else if (
                  columns[cellIndex] === "product" ||
                  columns[cellIndex] === "owner"
                ) {
                  return (
                    <td key={cellIndex} className="py-2 px-4">
                      <button onClick={() => handleModalOpen(cell.toString())}>
                        {cell}
                      </button>
                    </td>
                  );
                } else {
                  return (
                    <td key={cellIndex} className="py-2 px-4">
                      {cell}
                    </td>
                  );
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {modalContent && (
        <Modal
          isOpen={showModal}
          content={modalContent}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default Table;
