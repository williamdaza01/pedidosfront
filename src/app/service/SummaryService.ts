export const getOrderNumber = async () => {
    const res = await fetch(`https://pedidosapi.vercel.app/orders-app/orders/orders-number`)
    const data = await res.json();
    
    return data.orders_number;
}

export const getClientsNumber = async () => {
    const res = await fetch(`https://pedidosapi.vercel.app/orders-app/orders/clients-number`)
    const data = await res.json();
    
    return data.clients_number;
}

export const getIncomeLastMounth = async () => {
    const res = await fetch(`https://pedidosapi.vercel.app/orders-app/orders/income-last-month`)
    const data = await res.json();
    
    return data.income_last_month.total;
}

export const getCityMostOrders = async () => {
    const res = await fetch(`https://pedidosapi.vercel.app/orders-app/orders/city-most-orders`)
    const data = await res.json();
    
    return data.city_most_orders;
}

export const getBestSellingProducts = async () => {
    const res = await fetch(`https://pedidosapi.vercel.app/orders-app/orders/best-selling-product`)
    const data = await res.json();
    
    return data.best_selling_product;
}
