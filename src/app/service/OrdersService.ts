import { OrderType } from "@/types/OrdersType";

export const getOrders = async () => {
  try {
    const response = await fetch('http://localhost:8000/orders-app/orders', {
        method: 'GET',
      });
    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const getOrdersById = async (id: number) =>{
  const res = await fetch(`http://localhost:8000/orders-app/orders/${id}`);
  const data = await res.json();
  return data;
}

export const createOrder = async (order: OrderType) => {
  const res = await fetch("http://localhost:8000/orders-app/orders/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });
  const data = await res.json();
  return data;
};

export const updateOrder = async (
  orderId: number,
  updatedOrder: OrderType
) => {
  const res = await fetch(
    `http://localhost:8000/orders-app/orders/${orderId}/`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedOrder),
    }
  );
  const data = await res.json();
  return data;
};

export const deleteOrder = async (orderId: number) => {
  const res = await fetch(
    `http://localhost:8000/orders-app/orders/${orderId}`,
    {
      method: "DELETE",
    }
  );
  const data = await res.json();
  return data;
};
