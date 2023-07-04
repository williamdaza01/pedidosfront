import { UserType } from "@/types/UserTypes";

export const getUsers = async () => {
  const res = await fetch(`https://pedidosapi.vercel.app/orders-app/users`);
  const data = await res.json();
  return data;
};

export const getUsersById = async (id: number) =>{
  const res = await fetch(`https://pedidosapi.vercel.app/orders-app/users/${id}`);
  const data = await res.json();
  return data;
}

export const createUsers = async (user?: UserType) => {
  const userStr = JSON.stringify(user);
  
  const res = await fetch(`https://pedidosapi.vercel.app/orders-app/users/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: userStr,
  });
  const data = res.ok;
  return data;
};

export const updateUsers = async (
  userId: number,
  updatedUsers: UserType
) => {
  const res = await fetch(
    `https://pedidosapi.vercel.app/orders-app/users/${userId}/`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUsers),
    }
  );
  const data = await res.json();
  return data;
};

export const deleteUser = async (userId: number) => {
  const res = await fetch(
    `https://pedidosapi.vercel.app/orders-app/users/${userId}`,
    {
      method: "DELETE",
    }
  );
  const data = await res.json();
  return data;
};


export const getCities = async () => {
  const res = await fetch("https://raw.githubusercontent.com/marcovega/colombia-json/master/colombia.min.json");
  const data = await res.json();
  const cities: any = [];
  data.forEach((department: any) => {
    return department.ciudades.forEach((city: string) => cities.push(city));
  });  
  return cities;
}