"use client";
import React, { useEffect, useState } from "react";
import { Select, initTE, Input} from "tw-elements";
import { getCities, getUsers, getUsersById } from "../service/UsersService";
import { ModalProps } from "@/types/ModalTypes";
import { UserType } from "@/types/UserTypes";
import { ProductType } from "@/types/ProductsType";
import { getProducts, getProductsById } from "../service/ProductService";
import { OrderState, ShippingRules } from "@/types/Enums";
import { OrderType } from "@/types/OrdersType";
import { getOrdersById } from "../service/OrdersService";

const FormItem: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  entity,
  onCreate,
  onEdit,
  idItem
}) => {
  initTE({Select, Input})
  const [arrDepartments, setArrDepartments] = useState([]);
  const [arrUsers, setArrUsers] = useState<UserType[]>([]);
  const [formuser, setFormUser] = useState<UserType>();
  const [formProduct, setFormProduct] = useState<ProductType>();
  const [formOrder, setFormOrder] = useState<OrderType>();
  const [arrProducts, setArrProducts] = useState<ProductType[]>([]);
  const [selectedItem, setSelectedItem] = useState< UserType | ProductType | OrderType | null>(null);
  const [selectedItemId, setSelectedItemId] = useState(0);
  let [formData, setFormData] = useState<UserType | ProductType | OrderType>({
    id: 0,
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  const modalClasses = isOpen ? "relative z-10" : "hidden";

  const handleCreateUser = (formData: UserType | ProductType | OrderType) => {
    if (typeof onCreate === "function") {
      onCreate(formData);
    }
  };

  const handleEditUser = (
    id: number,
    formData: UserType | ProductType | OrderType
  ) => {    
    if (typeof onEdit === "function") {      
      onEdit(id, true, formData);
    }
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (onCreate) {
      if (entity === "users") {
        formData = {
          name: event.target.name.value + " " + event.target.lastname.value,
          email: event.target.email.value,
          phone: event.target.phone.value,
          address: event.target.address.value,
          city: event.target.city.value,
        };
      } else if (entity === "products") {
        formData = {
          name: event.target.name.value,
          price: event.target.price.value,
        } as ProductType;
      } else if (entity === "orders") {
        formData = {
          date: new Date(),
          order_state: OrderState.Pending,
          is_paid: false,
          shipping_rule: event.target.rule.value,
          quantity_product: event.target.quantity.value,
          owner: event.target.user.value,
          product: event.target.product.value,
        };
      }
      handleCreateUser(formData);
    } else if (onEdit) {      
      if (idItem) {        
        const id = idItem;
        if (entity === "users") {
          formData = {
            name: event.target.name.value + " " + event.target.lastname.value,
            email: event.target.email.value,
            phone: event.target.phone.value,
            address: event.target.address.value,
            city: event.target.city.value,
          } as UserType;
          setFormUser(formData);
        } else if (entity === "products") {
          formData = {
            name: event.target.name.value,
            price: event.target.price.value,
          } as ProductType;
          setFormProduct(formData)
        } else if (entity === "orders") {
          let paid = false;
          if(event.target.state.value === OrderState.Delivered || event.target.state.value === OrderState.OnTheWay){
            paid=true;
          }
          formData = {
            date: new Date(),
            order_state: event.target.state.value,
            is_paid: paid,
            shipping_rule: event.target.rule.value,
            quantity_product: event.target.quantity.value,
            owner: event.target.user.value,
            product: event.target.product.value,
          } as OrderType;
          setFormOrder(selectedItem as OrderType)
        }        
        handleEditUser(id, formData);
      }
    }
  };

  const handleChange = (event: any) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cities = await getCities();
        const users = await getUsers();
        const products = await getProducts();
        setArrDepartments(cities);
        setArrProducts(products);
        setArrUsers(users);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchData();
  }, []);

  const fetchItem = async (itemId: number) => {
    try {
      if (entity === "users") {
        const item = await getUsersById(itemId);
        setSelectedItem(item);
      } else if (entity === "products") {
        const item = await getProductsById(itemId);
        setSelectedItem(item);
      } else if (entity === "orders") {
        const item = await getOrdersById(itemId);
        setSelectedItem(item);
      }
    } catch (error) {
      console.error("Error fetching item:", error);
    }
  };

  useEffect(() => {
    if (selectedItemId) {
      fetchItem(selectedItemId);
    }
  }, [selectedItemId]);

  useEffect(() => {
    if (selectedItem) {
      setFormData(selectedItem);
    }
  }, [selectedItem]);

  return (
    <>
      <div
        className={modalClasses}
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 flex justify-center">
                <div className="sm:flex sm:items-start">
                  <div className={modalClasses}>
                    <form onSubmit={handleSubmit}>
                      {onCreate ? (
                        <>
                          {entity === "users" ? (
                            <>
                              {/* User form */}
                              <div className="grid grid-cols-2 gap-4">
                                <div
                                  className="relative mb-6"
                                  data-te-input-wrapper-init
                                >
                                  <input
                                    type="text"
                                    className="peer text-black block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                    id="name"
                                    onChange={handleChange}
                                  />
                                  <label
                                    htmlFor="emailHelp123"
                                    className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none"
                                  >
                                    Nombre
                                  </label>
                                </div>

                                <div
                                  className="relative mb-6"
                                  data-te-input-wrapper-init
                                >
                                  <input
                                    type="text"
                                    className="peer text-black block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                    id="lastname"
                                    aria-describedby="emailHelp124"
                                    placeholder="Last name"
                                    onChange={handleChange}
                                  />
                                  <label
                                    htmlFor="exampleInput124"
                                    className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none "
                                  >
                                    Apellido
                                  </label>
                                </div>
                              </div>

                              <div
                                className="relative mb-6"
                                data-te-input-wrapper-init
                              >
                                <input
                                  type="email"
                                  className="peer text-black block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                  id="email"
                                  placeholder="Email address"
                                  onChange={handleChange}
                                />
                                <label
                                  htmlFor="exampleInput125"
                                  className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none"
                                >
                                  Email
                                </label>
                              </div>

                              <div
                                className="relative mb-6"
                                data-te-input-wrapper-init
                              >
                                <input
                                  type="tel"
                                  className="peer text-black block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                  id="phone"
                                  placeholder="Email address"
                                  onChange={handleChange}
                                />
                                <label
                                  htmlFor="exampleInput125"
                                  className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none"
                                >
                                  Telefono
                                </label>
                              </div>

                              <div
                                className="relative mb-6"
                                data-te-input-wrapper-init
                              >
                                <input
                                  type="text"
                                  className="peer text-black block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                  id="address"
                                  placeholder="Password"
                                  onChange={handleChange}
                                />
                                <label
                                  htmlFor="exampleInput126"
                                  className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none"
                                >
                                  Direccion
                                </label>
                              </div>

                              <select
                                className="mb-4"
                                data-te-select-init
                                data-te-select-filter="true"
                                id="city"
                                onChange={handleChange}
                              >
                                {arrDepartments.map((city, index) => (
                                  <option key={index} value={city}>
                                    {city}
                                  </option>
                                ))}
                              </select>
                              <label data-te-select-label-ref>Ciudad</label>
                            </>
                          ) : entity === "products" ? (
                            <>
                              {/* Product form */}

                              <div
                                className="relative mb-6"
                                data-te-input-wrapper-init
                              >
                                <input
                                  type="text"
                                  className="peer text-black block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                  id="name"
                                  onChange={handleChange}
                                />
                                <label
                                  htmlFor="emailHelp123"
                                  className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none"
                                >
                                  Nombre
                                </label>
                              </div>

                              <div
                                className="relative mb-6"
                                data-te-input-wrapper-init
                              >
                                <input
                                  type="number"
                                  className="peer text-black block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                  id="price"
                                  placeholder="Email address"
                                  onChange={handleChange}
                                />
                                <label
                                  htmlFor="exampleInput125"
                                  className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none"
                                >
                                  Precio
                                </label>
                              </div>
                            </>
                          ) : entity === "orders" ? (
                            <>
                              {/* Order form */}
                              <div className="flex flex-col gap-4">
                                <select
                                  className="mb-3"
                                  data-te-select-init
                                  data-te-select-filter="true"
                                  id="state"
                                  onChange={handleChange}
                                >
                                  <option>{OrderState.Pending}</option>
                                  <option>{OrderState.OnTheWay}</option>
                                  <option>{OrderState.Delivered}</option>
                                  <option>{OrderState.Cancelled}</option>
                                </select>
                                <label data-te-select-label-ref>
                                  Estado de la Orden
                                </label>

                                <select
                                  className="mb-3"
                                  data-te-select-init
                                  data-te-select-filter="true"
                                  id="rule"
                                  onChange={handleChange}
                                >
                                  <option>{ShippingRules.Delivery}</option>
                                  <option>{ShippingRules.AtPoint}</option>
                                </select>
                                <label data-te-select-label-ref>
                                  Regla de envio
                                </label>

                                <select
                                  className="mb-3"
                                  data-te-select-init
                                  data-te-select-filter="true"
                                  id="user"
                                  onChange={handleChange}
                                >
                                  {arrUsers.map((user, index) => (
                                    <option key={index} value={user.id}>
                                      {user ? user.name : ""}
                                    </option>
                                  ))}
                                </select>
                                <label data-te-select-label-ref>Usuarios</label>

                                <select
                                  className="mb-3"
                                  data-te-select-init
                                  data-te-select-filter="true"
                                  id="product"
                                  onChange={handleChange}
                                >
                                  {arrProducts.map((product, index) => (
                                    <option key={index} value={product.id}>
                                      {product ? product.name : ""}
                                    </option>
                                  ))}
                                </select>
                                <label data-te-select-label-ref>
                                  Productos
                                </label>

                                <div
                                  className="relative mb-6"
                                  data-te-input-wrapper-init
                                >
                                  <input
                                    type="number"
                                    className="peer text-black block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                    id="quantity"
                                    onChange={handleChange}
                                  />
                                  <label
                                    htmlFor="emailHelp123"
                                    className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none"
                                  >
                                    Cantidad
                                  </label>
                                </div>
                              </div>
                            </>
                          ) : (
                            <></>
                          )}
                        </>
                      ) : onEdit ? (
                        <>                       
                          {entity === "users" ? (
                            <>
                              {/* User form */}
                              <div className="grid grid-cols-2 gap-4">
                                <div
                                  className="relative mb-6"
                                  data-te-input-wrapper-init
                                >
                                  <input
                                    type="text"
                                    className="peer text-black block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                    id="name"
                                    onChange={handleChange}
                                    value={formuser?.name}
                                  />
                                  <label
                                    htmlFor="emailHelp123"
                                    className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none"
                                  >
                                    Nombre
                                  </label>
                                </div>

                                <div
                                  className="relative mb-6"
                                  data-te-input-wrapper-init
                                >
                                  <input
                                    type="text"
                                    className="peer text-black block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                    id="lastname"
                                    aria-describedby="emailHelp124"
                                    placeholder="Last name"
                                    value={formuser?.name}
                                    onChange={handleChange}
                                  />
                                  <label
                                    htmlFor="exampleInput124"
                                    className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none "
                                  >
                                    Apellido
                                  </label>
                                </div>
                              </div>

                              <div
                                className="relative mb-6"
                                data-te-input-wrapper-init
                              >
                                <input
                                  type="email"
                                  className="peer text-black block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                  id="email"
                                  placeholder="Email address"
                                  onChange={handleChange}
                                  value={formuser?.email}
                                />
                                <label
                                  htmlFor="exampleInput125"
                                  className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none"
                                >
                                  Email
                                </label>
                              </div>

                              <div
                                className="relative mb-6"
                                data-te-input-wrapper-init
                              >
                                <input
                                  type="tel"
                                  className="peer text-black block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                  id="phone"
                                  placeholder="Email address"
                                  onChange={handleChange}
                                  value={formuser?.phone}
                                />
                                <label
                                  htmlFor="exampleInput125"
                                  className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none"
                                >
                                  Telefono
                                </label>
                              </div>

                              <div
                                className="relative mb-6"
                                data-te-input-wrapper-init
                              >
                                <input
                                  type="text"
                                  className="peer text-black block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                  id="address"
                                  placeholder="Password"
                                  onChange={handleChange}
                                  value={formuser?.address}
                                />
                                <label
                                  htmlFor="exampleInput126"
                                  className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none"
                                >
                                  Direccion
                                </label>
                              </div>

                              <select
                                className="mb-4"
                                data-te-select-init
                                data-te-select-filter="true"
                                id="city"
                                onChange={handleChange}                               
                              >
                                <option value={formuser?.city}></option>
                                {arrDepartments.map((city, index) => (
                                  <option key={index} value={city}>
                                    {city}
                                  </option>
                                ))}
                              </select>
                              <label data-te-select-label-ref>Ciudad</label>
                            </>
                          ) : entity === "products" ? (
                            <>
                              {/* Product form */}

                              <div
                                className="relative mb-6"
                                data-te-input-wrapper-init
                              >
                                <input
                                  type="text"
                                  className="peer text-black block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                  id="name"
                                  onChange={handleChange}
                                  value={formProduct?.name}
                                />
                                <label
                                  htmlFor="emailHelp123"
                                  className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none"
                                >
                                  Nombre
                                </label>
                              </div>

                              <div
                                className="relative mb-6"
                                data-te-input-wrapper-init
                              >
                                <input
                                  type="number"
                                  className="peer text-black block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                  id="price"
                                  placeholder="Email address"
                                  onChange={handleChange}
                                  value={formProduct?.price}
                                />
                                <label
                                  htmlFor="exampleInput125"
                                  className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none"
                                >
                                  Precio
                                </label>
                              </div>
                            </>
                          ) : entity === "orders" ? (
                            <>
                              {/* Order form */}
                              <div className="flex flex-col gap-4">
                                <select
                                  className="mb-3"
                                  data-te-select-init
                                  data-te-select-filter="true"
                                  id="state"
                                  onChange={handleChange}
                                >
                                  <option value={formOrder?.order_state}></option>
                                  <option>{OrderState.Pending}</option>
                                  <option>{OrderState.OnTheWay}</option>
                                  <option>{OrderState.Delivered}</option>
                                  <option>{OrderState.Cancelled}</option>
                                </select>
                                <label data-te-select-label-ref>
                                  Estado de la Orden
                                </label>

                                <select
                                  className="mb-3"
                                  data-te-select-init
                                  data-te-select-filter="true"
                                  id="rule"
                                  onChange={handleChange}
                                >
                                  <option value={formOrder?.shipping_rule}></option>
                                  <option>{ShippingRules.Delivery}</option>
                                  <option>{ShippingRules.AtPoint}</option>
                                </select>
                                <label data-te-select-label-ref>
                                  Regla de envio
                                </label>

                                <select
                                  className="mb-3"
                                  data-te-select-init
                                  data-te-select-filter="true"
                                  id="user"
                                  onChange={handleChange}
                                >
                                  <option value={formOrder?.owner}></option>
                                  {arrUsers.map((user, index) => (
                                    <option key={index} value={user.id}>
                                      {user ? user.name : ""}
                                    </option>
                                  ))}
                                </select>
                                <label data-te-select-label-ref>Usuarios</label>

                                <select
                                  className="mb-3"
                                  data-te-select-init
                                  data-te-select-filter="true"
                                  id="product"
                                  onChange={handleChange}
                                >
                                  <option value={formOrder?.product}></option>
                                  {arrProducts.map((product, index) => (
                                    <option key={index} value={product.id}>
                                      {product ? product.name : ""}
                                    </option>
                                  ))}
                                </select>
                                <label data-te-select-label-ref>
                                  Productos
                                </label>

                                <div
                                  className="relative mb-6"
                                  data-te-input-wrapper-init
                                >
                                  <input
                                    type="number"
                                    className="peer text-black block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                    id="quantity"
                                    onChange={handleChange}
                                    value={formOrder?.quantity_product}
                                  />
                                  <label
                                    htmlFor="emailHelp123"
                                    className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none"
                                  >
                                    Cantidad
                                  </label>
                                </div>
                              </div>
                            </>
                          ) : (
                            <></>
                          )}
                        </>
                      ) : (<></>)}

                      <button
                        type="submit"
                        className="inline-block w-full rounded mt-4 mb-4 bg-success-600 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-success-800 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-success-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-success-800 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                        data-te-ripple-init
                        data-te-ripple-color="light"
                      >
                        {onCreate ? (<>Crear</>) : (<>Editar</>)} {entity === 'users' ? (<>Usuario</>) : entity === 'products' ? (<>Producto</>) : entity === 'orders' ? (<>Pedido</>) : (<></>)}
                      </button>
                      <button
                        type="button"
                        className="inline-block w-full rounded bg-red-600 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-red-800 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-red-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-red-900 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                        data-te-ripple-init
                        data-te-ripple-color="light"
                        onClick={onClose}
                      >
                        Cancelar
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormItem;
