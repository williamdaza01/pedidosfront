'use client'
import React, { useEffect, useState } from 'react';
import Table from '../components/Table';
import { createOrder, deleteOrder, getOrders, updateOrder } from '../service/OrdersService';
import { getUsers } from '../service/UsersService';
import { getProducts } from '../service/ProductService';
import { ProductType } from '@/types/ProductsType';
import { UserType } from '@/types/UserTypes';
import { OrderType } from '@/types/OrdersType';
import { TableColumn, TableRow } from '@/types/TableTypes';
import FormItem from '../components/FormItem';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersData = await getOrders();
        const usersData = await getUsers();
        const productsData = await getProducts();
        setOrders(ordersData);
        setUsers(usersData);
        setProducts(productsData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteOrder = async (orderId:number) => {
    try {
      await deleteOrder(orderId);
      const updatedUsers = orders.filter((order: OrderType) => order.id !== orderId);
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleCreateProduct = async (order?: UserType | ProductType | OrderType) => {
    try {
      await createOrder(order as OrderType);
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const handleEditProduct = async(id: number, order?: UserType | ProductType | OrderType) => {
    try {
      await updateOrder(id, order as OrderType);
    } catch (error) {
      console.error("Error creating order:", error);
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const usersMap = users.reduce((map: Record<string, string>, user: UserType) => {
    map[user.id ? user.id : 0] = user.name;
    return map;
  }, {});

  const productsMap = products.reduce((map: Record<string, string>, product:ProductType) => {
    map[product.id] = product.name;
    return map;
  }, {});

  const columns: TableColumn[] = Object.keys(orders[0] || {}).map((key) => ({
    key,
    label: key,
  }));


  const rows: TableRow[] = orders.map((order: OrderType) => {
    const { owner, product, ...rest } = order;
    const values = [...Object.values(rest), usersMap[owner], productsMap[product]];;
    const row: TableRow = {
      id: order.id,
      cells: values.map((value) => value.toString()),
    };
    return row;
  });

  const handleModalOpen = () =>{
    setShowModal(true);
  }

  const handleModalClose = () =>{
    setShowModal(false);
  }

  return (
    <>
      <div>
        <Table columns={columns} rows={rows} entityName='orders' onDelete={handleDeleteOrder} users={users} products={products} onEdit={handleEditProduct}/>
        <button className="inline-block mt-4 mb-4 rounded bg-emerald-600 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-emerald-800 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-emerald-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-emerald-800 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]" onClick={handleModalOpen}>Crear Usuario</button>
      </div>
      <FormItem
        isOpen={showModal}
        entity="orders"
        onClose={handleModalClose}
        onCreate={handleCreateProduct}
      />
    </>
  );
};

export default OrdersPage;
