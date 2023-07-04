"use client";
import { OrderType } from "@/types/OrdersType";
import { ProductType } from "@/types/ProductsType";
import { TableColumn, TableRow } from "@/types/TableTypes";
import { UserType } from "@/types/UserTypes";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import classNames from "classnames";
import React, { Fragment, useEffect, useState } from "react";
import FormItem from "../components/FormItem";
import Table from "../components/Table";
import {
  getUsers,
  deleteUser,
  createUsers,
  updateUsers,
} from "../service/UsersService";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [sortedRowsByName, setSortedRowsByName] = useState<TableRow[]>([]);
  const [sortedRowsByCity, setSortedRowsByCity] = useState<TableRow[]>([]);
  const [sortedRowsByEmail, setSortedRowsByEmail] = useState<TableRow[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId);
      const updatedUsers = users.filter((user: UserType) => user.id !== userId);
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleCreateUser = async (
    User?: UserType | ProductType | OrderType
  ) => {
    try {
      await createUsers(User as UserType);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleEditUser = async (
    id: number,
    product?: UserType | ProductType | OrderType
  ) => {
    try {
      await updateUsers(id, product as UserType);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const columns: TableColumn[] = users.length > 0 ? Object.keys(users[0]).map((key) => ({
    key,
    label: key,
  })) : [];
  const rows: TableRow[] = users.map((user: UserType) => {
    const values = Object.values(user);
    const row: TableRow = {
      id: user.id ? user.id : 0,
      cells: values.map((value) => value.toString()),
    };
    return row;
  });

  const alphabeticallyOrderName = () => {
    const sorted = [...rows].sort((a, b) => {
      const nameA = a.cells[1].toLowerCase();
      const nameB = b.cells[1].toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
    setSortedRowsByName(sorted);
  };

  const sortByCity = () => {
    const sorted = [...rows].sort((a, b) => {
      const cityA = a.cells[2].toLowerCase();
      const cityB = b.cells[2].toLowerCase();
      if (cityA < cityB) return -1;
      if (cityA > cityB) return 1;
      return 0;
    });
    setSortedRowsByCity(sorted);
  };

  const sortByEmail = () => {
    const sorted = [...rows].sort((a, b) => {
      const emailA = a.cells[3].toLowerCase();
      const emailB = b.cells[3].toLowerCase();
      if (emailA < emailB) return -1;
      if (emailA > emailB) return 1;
      return 0;
    });
    setSortedRowsByEmail(sorted);
  };

  if (users.length === 0) {
    return (
      <div className="flex flex-col gap-5">
        No se han creado Usuarios.
        <button
          className="inline-block mt-4 mb-4 rounded bg-emerald-600 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-emerald-800 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-emerald-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-emerald-800 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
          onClick={handleModalOpen}
        >
          Crear Usuario
        </button>
      <FormItem
        isOpen={showModal}
        entity="users"
        onClose={handleModalClose}
        onCreate={handleCreateUser}
      />
      </div>
    );
  }

  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>
        <div className="flex flex-row-reverse pb-3">
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                Filtrar
                <ChevronDownIcon
                  className="-mr-1 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        onClick={() => {
                          alphabeticallyOrderName();
                          setSortedRowsByEmail([]);
                          setSortedRowsByCity([]);
                        }}
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Nombre
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        onClick={() => {
                          sortByEmail();
                          setSortedRowsByName([]);
                          setSortedRowsByCity([]);
                        }}
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Email
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        onClick={() => {
                          sortByCity();
                          setSortedRowsByName([]);
                          setSortedRowsByEmail([]);
                        }}
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Ciudad
                      </a>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
        <Table
          columns={columns}
          rows={
            sortedRowsByName.length > 0
              ? sortedRowsByName
              : sortedRowsByCity.length > 0
              ? sortedRowsByCity
              : sortedRowsByEmail.length > 0
              ? sortedRowsByEmail
              : rows
          }
          onDelete={handleDeleteUser}
          entityName="users"
          onEdit={handleEditUser}
        />
        <button
          className="inline-block mt-4 mb-4 rounded bg-emerald-600 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-emerald-800 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-emerald-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-emerald-800 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
          onClick={handleModalOpen}
        >
          Crear Usuario
        </button>
      </div>
      <FormItem
        isOpen={showModal}
        entity="users"
        onClose={handleModalClose}
        onCreate={handleCreateUser}
      />
    </>
  );
};

export default UsersPage;
