export const getProducts = async () => {
    const res = await fetch('http://localhost:8000/orders-app/products')
    const data = await res.json();
    return data;
}