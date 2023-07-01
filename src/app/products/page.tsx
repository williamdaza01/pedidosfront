"use client";
import { OrderType } from "@/types/OrdersType";
import { ProductType } from "@/types/ProductsType";
import { TableColumn, TableRow } from "@/types/TableTypes";
import { UserType } from "@/types/UserTypes";
import React, { useEffect, useState } from "react";
import FormItem from "../components/FormItem";
import Table from "../components/Table";
import {
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct
} from "../service/ProductService";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

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

  const handleCreateProduct = async (product?: UserType | ProductType | OrderType) => {
    try {
      await createProduct(product as ProductType);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleEditProduct = async (id:number, product?: UserType | ProductType | OrderType) => {
    try {
      await updateProduct(id, product as ProductType);
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

  return (
    <>
      <div>
        <Table
          columns={columns}
          rows={rows}
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
