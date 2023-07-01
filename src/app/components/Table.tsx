"use client";
import { ProductType } from "@/types/ProductsType";
import { TableColumn, TableRow } from "@/types/TableTypes";
import { UserType } from "@/types/UserTypes";
import React, { useState } from "react";
import Modal from "./Modal";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import Confirmation from "./Confirmation";
import ToastComponent from "./Toast";
import { OrderType } from "@/types/OrdersType";
import FormItem from "./FormItem";
import { OrderState } from "@/types/Enums";

interface TableProps {
  columns: TableColumn[];
  rows: TableRow[];
  entityName: string;
  onDelete: (id: number) => void;
  onEdit: (id: number, Item?: UserType | ProductType | OrderType) => void;
  products?: ProductType[];
  users?: UserType[];
}

let idItem = 0;
const Table = ({
  columns,
  rows,
  entityName,
  onDelete,
  onEdit,
  products,
  users,
}: TableProps) => {
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalForm, setShowModalForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isConfirmation, setConfirmation] = useState(false);
  const [confirmationContent, setConfirmationContent] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null
  );

  const handleModalOpen = (rowData: any, columnIndex: number) => {
    if (columns[columnIndex].key === "owner") {
      const userId = rowData[columnIndex];
      const user = users ? users.find((user) => user.name === userId) : null;
      setSelectedUser(user || null);
    } else if (columns[columnIndex].key === "product") {
      const productId = rowData[columnIndex];
      const product = products
        ? products.find((product) => product.name === productId)
        : null;
      setSelectedProduct(product || null);
    }
    setShowModal(true);
  };

  const handleModalClose = () => {
    setModalContent(null);
    setSelectedUser(null);
    setSelectedProduct(null);
    setShowModal(false);
    setShowModalForm(false);
  };

  const handleCondirmation = (id: number) => {
    const confirmationContent = "¿Estas seguro de eliminar esto?";
    setConfirmationContent(confirmationContent);
    setShowConfirmation(true);
    idItem = id;
  };

  const editItem = (
    id: number,
    confimation?: boolean,
    item?: UserType | ProductType | OrderType
  ) => {
    setShowModalForm(true);
    idItem = id;
    if (confimation) handleEditItem(idItem, item);
  };

  const handleEditItem = (
    id: number,
    item?: UserType | ProductType | OrderType
  ) => {
    onEdit(id, item);
  };

  const handleDelete = () => {
    onDelete(idItem);
    idItem = 0;
    setToast("Eliminado Correctamente");
    setConfirmation(true);
    setShowConfirmation(false);
  };

  return (
    <>
      <div>
        <table className="w-full rounded-md overflow-hidden">
          <thead className="bg-gray-200 text-black">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="py-2 px-4">
                  {column.label}
                </th>
              ))}
              <th className="py-2 px-4">Opciones</th>
            </tr>
          </thead>
          <tbody className="bg-white text-slate-700 text-center">
            {rows.map((row) => (
              <tr key={row.id}>
                {row.cells.map((cell, cellIndex) => (
                  <td key={cellIndex} className="py-2 px-4">
                    {columns[cellIndex].key === "owner" ||
                    columns[cellIndex].key === "product" ? (
                      <button
                        onClick={() => handleModalOpen(row.cells, cellIndex)}
                      >
                        {cell}
                      </button>
                    ) : columns[cellIndex].key === "is_paid" ? (
                      row.cells[2] === OrderState.OnTheWay ||
                      row.cells[2] === OrderState.Delivered ? (
                        <input type="checkbox" checked={true} readOnly />
                      ) : (
                        <input
                          type="checkbox"
                          checked={cell === "true"}
                          readOnly
                        />
                      )
                    ) : (
                      cell
                    )}
                  </td>
                ))}
                <td className="py-2 px-4">
                  <div className="flex justify-evenly">
                    <PencilSquareIcon
                      className="fill-blue-500 hover:fill-blue-700 h-6 w-6 cursor-pointer"
                      onClick={() => editItem(Number(row.id))}
                    />
                    <TrashIcon
                      className="fill-red-500 hover:fill-red-700 h-6 w-6 cursor-pointer"
                      onClick={() => handleCondirmation(Number(row.id))}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedUser && (
          <Modal
            isOpen={showModal}
            content={JSON.stringify(selectedUser)}
            onClose={handleModalClose}
          />
        )}

        {selectedProduct && (
          <Modal
            isOpen={showModal}
            content={JSON.stringify(selectedProduct)}
            onClose={handleModalClose}
          />
        )}
        {showConfirmation && (
          <Confirmation
            isOpen={showConfirmation}
            content={confirmationContent}
            onClose={() => setShowConfirmation(false)}
            onConfirmation={() => {
              handleDelete();
            }}
          />
        )}
        {isConfirmation && <ToastComponent content={toast ? toast : ""} />}
      </div>
      <FormItem
        isOpen={showModalForm}
        entity={entityName}
        onClose={handleModalClose}
        onEdit={editItem}
        idItem={idItem}
      />
    </>
  );
};

export default Table;
