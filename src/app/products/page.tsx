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
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
} from "../service/ProductService";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [sortedRowsByName, setSortedRowsByName] = useState<TableRow[]>([]);
  const [sortedRowsByPriceHigh, setSortedRowsByPriceHigh] = useState<
    TableRow[]
  >([]);
  const [sortedRowsByPriceLow, setSortedRowsByPriceLow] = useState<TableRow[]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await getProducts();
        setProducts(productsData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteProduct = async (productId: number) => {
    try {
      await deleteProduct(productId);
      const updatedProducts = products.filter(
        (product: ProductType) => product.id !== productId
      );
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleCreateProduct = async (
    product?: UserType | ProductType | OrderType
  ) => {
    try {
      await createProduct(product as ProductType);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleEditProduct = async (
    id: number,
    product?: UserType | ProductType | OrderType
  ) => {
    try {
      await updateProduct(id, product as ProductType);
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const columns: TableColumn[] = Object.keys(products[0]).map((key) => ({
    key,
    label: key,
  }));

  const rows: TableRow[] = products.map((product: ProductType) => {
    const values = Object.values(product);
    const row: TableRow = {
      id: product.id,
      cells: values.map((value) => value.toString()),
    };
    return row;
  });

  const classNames = (...classes: string[]) => {
    return classes.filter(Boolean).join(" ");
  };

  const alphabeticallyOrder = () => {
    const sorted = [...rows];
    sorted.sort((a, b) => a.cells[1].localeCompare(b.cells[1]));
    setSortedRowsByName(sorted);
  };

  const sortByPriceHigh = () => {
    const sorted = [...rows];
    sorted.sort((a, b) => Number(b.cells[2]) - Number(a.cells[2]));
    setSortedRowsByPriceHigh(sorted);
  };

  const sortByPriceLow = () => {
    const sorted = [...rows];
    sorted.sort((a, b) => Number(a.cells[2]) - Number(b.cells[2]));
    setSortedRowsByPriceLow(sorted);
  };

  let tableRows = rows;
  if (sortedRowsByName.length > 0) {
    tableRows = sortedRowsByName;
  } else if (sortedRowsByPriceHigh.length > 0) {
    tableRows = sortedRowsByPriceHigh;
  } else if (sortedRowsByPriceLow.length > 0) {
    tableRows = sortedRowsByPriceLow;
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
                          alphabeticallyOrder();
                          setSortedRowsByPriceHigh([]);
                          setSortedRowsByPriceLow([]);
                        }}
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Alfabetico
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        onClick={() => {
                          sortByPriceHigh();
                          setSortedRowsByName([]);
                          setSortedRowsByPriceLow([]);
                        }}
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Mayor precio
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        onClick={() => {
                          sortByPriceLow();
                          setSortedRowsByName([]);
                          setSortedRowsByPriceHigh([]);
                        }}
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Menor precio
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
          rows={tableRows}
          onDelete={handleDeleteProduct}
          onEdit={handleEditProduct}
          entityName="products"
        />
        <button
          className="inline-block mt-4 mb-4 rounded bg-emerald-600 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-emerald-800 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-emerald-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-emerald-800 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
          onClick={handleModalOpen}
        >
          Crear Producto
        </button>
      </div>
      <FormItem
        isOpen={showModal}
        entity="products"
        onClose={handleModalClose}
        onCreate={handleCreateProduct}
      />
    </>
  );
};

export default ProductsPage;
