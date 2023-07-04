"use client";
import React, { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import classNames from "classnames";
import Table from "../components/Table";
import {
  createOrder,
  deleteOrder,
  getOrders,
  updateOrder,
} from "../service/OrdersService";
import { getUsers } from "../service/UsersService";
import { getProducts } from "../service/ProductService";
import { ProductType } from "@/types/ProductsType";
import { UserType } from "@/types/UserTypes";
import { OrderType } from "@/types/OrdersType";
import { TableColumn, TableRow } from "@/types/TableTypes";
import FormItem from "../components/FormItem";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [sortedRowsByDate, setSortedRowsByDate] = useState<TableRow[]>([]);
  const [sortedRowsByOrderState, setSortedRowsByOrderState] = useState<
    TableRow[]
  >([]);
  const [sortedRowsByIsPaid, setSortedRowsByIsPaid] = useState<TableRow[]>([]);
  const [sortedRowsByShippingRule, setSortedRowsByShippingRule] = useState<
    TableRow[]
  >([]);
  const [sortedRowsByQuantityProduct, setSortedRowsByQuantityProduct] =
    useState<TableRow[]>([]);
  const [sortedRowsByOwner, setSortedRowsByOwner] = useState<TableRow[]>([]);
  const [sortedRowsByProduct, setSortedRowsByProduct] = useState<TableRow[]>(
    []
  );

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
        console.error("Error fetching orders:", error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteOrder = async (orderId: number) => {
    try {
      await deleteOrder(orderId);
      const updatedUsers = orders.filter(
        (order: OrderType) => order.id !== orderId
      );
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handleCreateProduct = async (
    order?: UserType | ProductType | OrderType
  ) => {
    try {
      await createOrder(order as OrderType);
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const handleEditProduct = async (
    id: number,
    order?: UserType | ProductType | OrderType
  ) => {
    try {
      await updateOrder(id, order as OrderType);
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const usersMap = users.reduce(
    (map: Record<string, string>, user: UserType) => {
      map[user.id ? user.id : 0] = user.name;
      return map;
    },
    {}
  );

  const productsMap = products.reduce(
    (map: Record<string, string>, product: ProductType) => {
      map[product.id] = product.name;
      return map;
    },
    {}
  );

  const columns: TableColumn[] = Object.keys(orders[0] || {}).map((key) => ({
    key,
    label: key,
  }));

  const rows: TableRow[] = orders.map((order: OrderType) => {
    const { owner, product, ...rest } = order;
    const values = [
      ...Object.values(rest),
      usersMap[owner],
      productsMap[product],
    ];
    const row: TableRow = {
      id: order.id ? order.id : 0,
      cells: values.map((value) => value.toString()),
    };
    return row;
  });

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const sortByDate = () => {
    const sorted = [...rows].sort((a, b) => {
      const dateA = new Date(a.cells[0]).getTime();
      const dateB = new Date(b.cells[0]).getTime();
      return dateA - dateB;
    });
    setSortedRowsByDate(sorted);
  };

  const sortByOrderState = () => {
    const sorted = [...rows].sort((a, b) => {
      const orderStateA = a.cells[1].toLowerCase();
      const orderStateB = b.cells[1].toLowerCase();
      if (orderStateA < orderStateB) return -1;
      if (orderStateA > orderStateB) return 1;
      return 0;
    });
    setSortedRowsByOrderState(sorted);
  };

  const sortByIsPaid = () => {
    const sorted = [...rows].sort((a, b) => {
      const isPaidA = a.cells[2].toLowerCase();
      const isPaidB = b.cells[2].toLowerCase();
      if (isPaidA < isPaidB) return -1;
      if (isPaidA > isPaidB) return 1;
      return 0;
    });
    setSortedRowsByIsPaid(sorted);
  };

  const sortByShippingRule = () => {
    const sorted = [...rows].sort((a, b) => {
      const shippingRuleA = a.cells[3].toLowerCase();
      const shippingRuleB = b.cells[3].toLowerCase();
      if (shippingRuleA < shippingRuleB) return -1;
      if (shippingRuleA > shippingRuleB) return 1;
      return 0;
    });
    setSortedRowsByShippingRule(sorted);
  };

  const sortByQuantityProduct = () => {
    const sorted = [...rows].sort((a, b) => {
      const quantityProductA = parseInt(a.cells[4]);
      const quantityProductB = parseInt(b.cells[4]);
      return quantityProductA - quantityProductB;
    });
    setSortedRowsByQuantityProduct(sorted);
  };

  const sortByOwner = () => {
    const sorted = [...rows].sort((a, b) => {
      const ownerA = a.cells[5].toLowerCase();
      const ownerB = b.cells[5].toLowerCase();
      if (ownerA < ownerB) return -1;
      if (ownerA > ownerB) return 1;
      return 0;
    });
    setSortedRowsByOwner(sorted);
  };

  const sortByProduct = () => {
    const sorted = [...rows].sort((a, b) => {
      const productA = a.cells[6].toLowerCase();
      const productB = b.cells[6].toLowerCase();
      if (productA < productB) return -1;
      if (productA > productB) return 1;
      return 0;
    });
    setSortedRowsByProduct(sorted);
  };

  if (orders.length === 0) {
    return (
      <div className="flex flex-col gap-5">
        No se han creado objetos.
        <button
          className="inline-block mt-4 mb-4 rounded bg-emerald-600 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-emerald-800 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-emerald-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-emerald-800 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
          onClick={handleModalOpen}
        >
          Crear Orden
        </button>
      <FormItem
        isOpen={showModal}
        entity="orders"
        onClose={handleModalClose}
        onCreate={handleCreateProduct}
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
                          sortByDate();
                          setSortedRowsByOrderState([]);
                          setSortedRowsByIsPaid([]);
                          setSortedRowsByShippingRule([]);
                          setSortedRowsByQuantityProduct([]);
                          setSortedRowsByOwner([]);
                          setSortedRowsByProduct([]);
                        }}
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Fecha
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        onClick={() => {
                          sortByIsPaid();
                          setSortedRowsByDate([]);
                          setSortedRowsByOrderState([]);
                          setSortedRowsByShippingRule([]);
                          setSortedRowsByQuantityProduct([]);
                          setSortedRowsByOwner([]);
                          setSortedRowsByProduct([]);
                        }}
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Pago
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        onClick={() => {
                          sortByOrderState();
                          setSortedRowsByDate([]);
                          setSortedRowsByIsPaid([]);
                          setSortedRowsByShippingRule([]);
                          setSortedRowsByQuantityProduct([]);
                          setSortedRowsByOwner([]);
                          setSortedRowsByProduct([]);
                        }}
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Estado de Orden
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        onClick={() => {
                          sortByShippingRule();
                          setSortedRowsByDate([]);
                          setSortedRowsByIsPaid([]);
                          setSortedRowsByOrderState([]);
                          setSortedRowsByQuantityProduct([]);
                          setSortedRowsByOwner([]);
                          setSortedRowsByProduct([]);
                        }}
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Regla de Envío
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        onClick={() => {
                          sortByQuantityProduct();
                          setSortedRowsByDate([]);
                          setSortedRowsByIsPaid([]);
                          setSortedRowsByOrderState([]);
                          setSortedRowsByShippingRule([]);
                          setSortedRowsByOwner([]);
                          setSortedRowsByProduct([]);
                        }}
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Cantidad de Producto
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        onClick={() => {
                          sortByOwner();
                          setSortedRowsByDate([]);
                          setSortedRowsByIsPaid([]);
                          setSortedRowsByOrderState([]);
                          setSortedRowsByShippingRule([]);
                          setSortedRowsByQuantityProduct([]);
                          setSortedRowsByProduct([]);
                        }}
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Propietario
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        onClick={() => {
                          sortByProduct();
                          setSortedRowsByDate([]);
                          setSortedRowsByIsPaid([]);
                          setSortedRowsByOrderState([]);
                          setSortedRowsByShippingRule([]);
                          setSortedRowsByQuantityProduct([]);
                          setSortedRowsByOwner([]);
                        }}
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Producto
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
            sortedRowsByDate.length > 0
              ? sortedRowsByDate
              : sortedRowsByOrderState.length > 0
              ? sortedRowsByOrderState
              : sortedRowsByIsPaid.length > 0
              ? sortedRowsByIsPaid
              : sortedRowsByShippingRule.length > 0
              ? sortedRowsByShippingRule
              : sortedRowsByQuantityProduct.length > 0
              ? sortedRowsByQuantityProduct
              : sortedRowsByOwner.length > 0
              ? sortedRowsByOwner
              : sortedRowsByProduct.length > 0
              ? sortedRowsByProduct
              : rows
          }
          entityName="orders"
          onDelete={handleDeleteOrder}
          users={users}
          products={products}
          onEdit={handleEditProduct}
        />
        <button
          className="inline-block mt-4 mb-4 rounded bg-emerald-600 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-emerald-800 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-emerald-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-emerald-800 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
          onClick={handleModalOpen}
        >
          Crear Orden
        </button>
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
