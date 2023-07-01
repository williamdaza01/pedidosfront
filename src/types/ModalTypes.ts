import { OrderType } from "./OrdersType";
import { ProductType } from "./ProductsType";
import { UserType } from "./UserTypes";

export interface ModalProps {
    isOpen: boolean;
    content?: string;
    onClose: () => void;
    entity?: string;
    onCreate?: (Item?: UserType |ProductType | OrderType) => void;
    onEdit?: (id:number, confimation?: boolean, Item?: UserType |ProductType | OrderType) => void;
    idItem?: number;
  }