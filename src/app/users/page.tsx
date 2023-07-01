"use client";
import { OrderType } from "@/types/OrdersType";
import { ProductType } from "@/types/ProductsType";
import { TableColumn, TableRow } from "@/types/TableTypes";
import { UserType } from "@/types/UserTypes";
import React, { useEffect, useState } from "react";
import FormItem from "../components/FormItem";
import Table from "../components/Table";
import { getUsers, deleteUser, createUsers, updateUsers } from "../service/UsersService";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

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

  const handleCreateUser = async (User?: UserType | ProductType | OrderType) => {
    try{
      await createUsers(User as UserType);
    } catch(error) {
      console.error("Error creating user:", error);
    }
  }

  const handleEditUser = async (id:number, product?: UserType | ProductType | OrderType) => {
    try {
      await updateUsers(id, product as UserType);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }

  const handleModalOpen = () =>{
    setShowModal(true);
  }

  const handleModalClose = () =>{
    setShowModal(false);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const columns: TableColumn[] = Object.keys(users[0]).map((key) => ({
    key,
    label: key,
  }));
  const rows: TableRow[] = users.map((user: UserType) => {
    const values = Object.values(user);
    const row: TableRow = {
      id: user.id ? user.id : 0,
      cells: values.map((value) => value.toString()),
    };
    return row;
  });

  return (
    <>
      <div>
        <Table
          columns={columns}
          rows={rows}
          onDelete={handleDeleteUser}
          entityName="users"
          onEdit={handleEditUser}
        />
        <button className="inline-block mt-4 mb-4 rounded bg-emerald-600 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-emerald-800 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-emerald-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-emerald-800 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]" onClick={handleModalOpen}>Crear Usuario</button>
      </div>
      <FormItem isOpen={showModal}
            entity='users'
            onClose={handleModalClose}
            onCreate={handleCreateUser}/>
    </>
  );
};

export default UsersPage;
