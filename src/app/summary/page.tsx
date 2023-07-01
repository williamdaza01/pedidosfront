import React from "react";
import { getBestSellingProducts, getCityMostOrders, getClientsNumber, getIncomeLastMounth, getOrderNumber } from "../service/SummaryService";

const SummaryPage = async () => {
  const ordersNumber = await getOrderNumber()
  const clientsNumber = await getClientsNumber()
  const lastIncomes = await getIncomeLastMounth()
  const cityMostOrders = await getCityMostOrders()
  const bestselling = await getBestSellingProducts()
  
  return (
    <>
      <div className="bg-white rounded-lg px-6 py-8 ring-1 ring-slate-900/5 shadow-xl flex flex-col">
        <h2 className="text-slate-900 mt-5 text-base tracking-tight font-bold">
          Resumen
        </h2>
        <div className="text-slate-500 mt-2 text-sm flex flex-col">
          <span> <span className="text-slate-800 font-bold"> Numero de pedidos: </span> {ordersNumber}</span>
          <span> <span className="text-slate-800 font-bold"> Numero de clientes: </span> {clientsNumber}</span>
          <span> <span className="text-slate-800 font-bold"> Ganancias del ultimo mes: </span>{lastIncomes}</span>
          <span> <span className="text-slate-800 font-bold"> Ciudad con mas pedidos: </span>{cityMostOrders.city} - {cityMostOrders.num_pedidos}</span>
          <span> <span className="text-slate-800 font-bold"> Producto mejor vendidos: </span>{bestselling.product__name} - {bestselling.total_vendido}</span>
        </div>
      </div>
    </>
  );
};

export default SummaryPage;
