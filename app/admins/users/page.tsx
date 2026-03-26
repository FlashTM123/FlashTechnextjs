import { Metadata } from "next";
import UsersClient from "./users-client";

export const metadata: Metadata = {
  title: "Quản lý người dùng",
  description: "Quản lý tài khoản, quyền hạn và trạng thái người dùng",
};

export default function UsersPage() {
  return <UsersClient />;
}
