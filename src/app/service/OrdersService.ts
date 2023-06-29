export const getOrders = async () => {
    const res = await fetch('http://localhost:8000/orders-app/orders')
    const data = await res.json();
    
    return data;
}