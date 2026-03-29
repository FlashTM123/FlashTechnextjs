import { Metadata } from "next";
import CustomersClient from "./customers-client";

export const metadata: Metadata = {
  title: "Quản lý Khách Hàng - FlashTech Admin",
  description: "Bảng điều khiển thông tin khách hàng",
};

export default function CustomersPage() {
  return <CustomersClient />;
}
