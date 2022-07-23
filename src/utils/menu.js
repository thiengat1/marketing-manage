/*
 * @Description: menu
 * @Author: code pro
 * @Date: 2022-06-10 23:33:43
 * @LastEditTime: 2022-06-18 22:40:23
 * @LastEditors: code pro
 */
export const menu = [
  {
    label: "Quản lý đại lý",
    items: [
      {
        label: "Quản lý khách hàng",
        icon: "pi pi-fw pi-home",
        to: "/",
      },
      {
        label: "Cài đặt hoa hồng",
        icon: "pi pi-fw pi-home",
        to: "/agent/commission",
      },
    ],
  },
  {
    label: "Tài khoản",
    icon: "pi pi-fw pi-sitemap",
    items: [{ label: "Quản lý tài khoản", icon: "pi pi-users", to: "/users" }],
  },
];
