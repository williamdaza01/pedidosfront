export interface OrderType {   
    id: number;
    date: Date;
    order_state: string;
    is_paid: boolean;
    shipping_rule: string;
    quantity_product: number;
    owner: number;
    product: number;
}