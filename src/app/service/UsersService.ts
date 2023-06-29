export const getUsers = async () => {
    const res = await fetch('http://localhost:8000/orders-app/users')
    const data = await res.json();
    return data;
}