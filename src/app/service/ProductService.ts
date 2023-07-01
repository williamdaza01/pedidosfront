import { ProductType } from "@/types/ProductsType";

export const getProducts = async () => {
  const res = await fetch("http://localhost:8000/orders-app/products");
  const data = await res.json();
  return data;
};

export const getProductsById = async (id: number) =>{
  const res = await fetch(`http://localhost:8000/orders-app/products/${id}`);
  const data = await res.json();
  return data;
}

export const createProduct = async (product: ProductType) => {
  const res = await fetch("http://localhost:8000/orders-app/products/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });
  const data = await res.json();
  return data;
};

export const updateProduct = async (
  productId: number,
  updatedProduct: ProductType
) => {
  const res = await fetch(
    `http://localhost:8000/orders-app/products/${productId}/`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    }
  );
  const data = await res.json();
  return data;
};

export const deleteProduct = async (productId: number) => {
  const res = await fetch(
    `http://localhost:8000/orders-app/products/${productId}`,
    {
      method: "DELETE",
    }
  );
  
  const data = res.ok;
  return data;
};
