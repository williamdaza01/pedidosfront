"use client";
import { OrderType } from "@/types/OrdersType";
import { ProductType } from "@/types/ProductsType";
import { UserType } from "@/types/UserTypes";
import React from "react";
import Table from "../components/Table";
import { getOrders } from "../service/OrdersService";
import { getProducts } from "../service/ProductService";
import { getUsers } from "../service/UsersService";

const OrdersPage = async () => {

  const ordersData = await getOrders();
  const usersData = await getUsers();
  const productsData = await getProducts();

  const usersMap = usersData.reduce((map: string[], user: UserType) => {
    map[user.id] = user.name;    
    return map;
  }, {});

  const productsMap = productsData.reduce(
    (map: string[], product: ProductType) => {
      map[product.id] = product.name;
      return map;
    },
    {}
  );

  const columns = Object.keys(ordersData[0] || {});

  const rows = ordersData.map((order: OrderType) => {
    const { owner, product, ...rest }: OrderType = order;
    return [...Object.values(rest), usersMap[owner], productsMap[product]];
  });
  
  return (
    <div>
      OrdersPage
      <Table columns={columns} rows={rows}/>
    </div>
  );
};

export default OrdersPage;
