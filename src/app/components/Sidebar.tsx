"use client";
import CollapsIcon from "@/Icons/CollapseIcon";
import HomeIcon from "@/Icons/HomeIcon";
import Logo from "@/Icons/Logo";
import ProductsIcon from "@/Icons/ProductsIcon";
import SummaryIcon from "@/Icons/SummaryIcon";
import UsersIcon from "@/Icons/UsersIcon";
import { MenuItem } from "@/types/MenuType";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useMemo, useState } from "react";

const menuItems: MenuItem[] = [
  { id: 1, label: "Home", icon: HomeIcon, link: "/" },
  { id: 2, label: "Usuarios", icon: UsersIcon, link: "/users" },
  { id: 3, label: "Productos", icon: ProductsIcon, link: "/products" },
  { id: 4, label: "Resumen", icon: SummaryIcon, link: "/summary" },
  { id: 5, label: "Pedidos", icon: SummaryIcon, link: "/orders" },
];

const Sidebar = () => {
  const [toggleCollapese, settoggleCollapese] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const activeMenu = useMemo(
    () => menuItems.find((menu) => menu.link === pathname),
    [pathname]
  );

  const wrapperClasses = classNames(
    "h-screen px-4 pt-8 pb-4 bg-light flex justify-between flex-col border border-dashed",
    {
      ["w-80"]: !toggleCollapese,
      ["w-20"]: toggleCollapese,
    }
  );

  const collapseIconClasses = classNames(
    "p-4 rounded bg-slate-400 absolute right-0 ",
    {
      "rotate-180": toggleCollapese,
    }
  );

  const getNavItemClasses = (menu: MenuItem) => {
    return classNames(
      "flex items-center cursor-pointer hover:bg-slate-300 rounded w-full overflow-hidden whitespace-nowrap",
      {
        ["bg-slate-300"]: activeMenu && activeMenu.id === menu.id,
      }
    );
  };

  const onMouseOver = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleSidebarToggle = () => {
    settoggleCollapese(!toggleCollapese);
  };

  return (
    <>
      <div
        className={wrapperClasses}
        onMouseEnter={onMouseOver}
        onMouseLeave={onMouseOver}
        style={{ transition: "width 300ms cubic-bezier(0.2, 0, 0, 1) 0s" }}
      >
        <div className="flex flex-col">
          <div className="flex items-center justify-between relative">
            <div className="flex items-center pl-1 gap-4">
              <Logo />
              <span
                className={classNames("mt-2 text-lg font-medium text-text", {
                  hidden: toggleCollapese,
                })}
              >
                {" "}
                Astro{" "}
              </span>
            </div>
            {isCollapsed && (
              <button
                className={collapseIconClasses}
                onClick={handleSidebarToggle}
              >
                <CollapsIcon />
              </button>
            )}
          </div>
          <div className="flex flex-col items-start mt-24">
            {menuItems.map(({ icon: Icon, ...menu }) => {
              const classes = getNavItemClasses({ icon: Icon, ...menu });
              return (
                <div key={menu.id} className={classes}>
                  <Link
                    href={menu.link}
                    className="flex py-4 px-3 items-center w-full h-full"
                  >
                    <div style={{ width: "2.5rem" }}>
                      <Icon />
                    </div>
                    {!toggleCollapese && (
                      <span
                        className={classNames("text-md font-medium text-black")}
                      >
                        {menu.label}
                      </span>
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
