import { ProductType } from '@/types/ProductsType';
import React from 'react'
import Table from '../components/Table'
import { getProducts } from '../service/ProductService';

const ProductsPage = async () => {
    const products = await getProducts()
    const columns = Object.keys(products[0]);
    const rows = products.map((product: ProductType) => Object.values(product));
  return (
    <div>ProductsPage
        <Table columns={columns} rows={rows}/>
    </div>
  )
}

export default ProductsPage