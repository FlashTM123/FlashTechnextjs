"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "USER" | "ADMIN" | "MODERATOR" | "EMPLOYEE";
  status: "active" | "blocked";
  joinDate: string;
  avatar?: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0901234567",
    role: "ADMIN",
    status: "active",
    joinDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Trần Thị B",
    email: "tranthib@example.com",
    phone: "0901234568",
    role: "MODERATOR",
    status: "active",
    joinDate: "2024-02-20",
  },
  {
    id: "3",
    name: "Lê Văn C",
    email: "levanc@example.com",
    phone: "0901234569",
    role: "EMPLOYEE",
    status: "blocked",
    joinDate: "2024-03-10",
  },
  {
    id: "4",
    name: "Phạm Thị D",
    email: "phamthid@example.com",
    phone: "0901234570",
    role: "USER",
    status: "active",
    joinDate: "2024-04-05",
  },
  {
    id: "5",
    name: "Vũ Văn E",
    email: "vuvane@example.com",
    phone: "0901234571",
    role: "USER",
    status: "active",
    joinDate: "2024-05-12",
  },
  {
    id: "6",
    name: "Hoàng Thị F",
    email: "hoangthif@example.com",
    phone: "0901234572",
    role: "EMPLOYEE",
    status: "active",
    joinDate: "2024-06-08",
  },
];

const getRoleColor = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "bg-red-100 text-red-800";
    case "MODERATOR":
      return "bg-blue-100 text-blue-800";
    case "EMPLOYEE":
      return "bg-purple-100 text-purple-800";
    case "USER":
      return "bg-slate-100 text-slate-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
};

const getStatusColor = (status: string) => {
  return status === "active"
    ? "bg-green-100 text-green-800"
    : "bg-red-100 text-red-800";
};

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter users
  const filteredUsers = mockUsers.filter((user) => {
    const matchSearch =
      searchTerm === "" ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchRole = roleFilter === "all" || user.role === roleFilter;
    const matchStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchSearch && matchRole && matchStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleBlockToggle = (userId: string) => {
    console.log("Toggle block user:", userId);
  };

  const handleEdit = (userId: string) => {
    console.log("Edit user:", userId);
  };

  const handleDelete = (userId: string) => {
    console.log("Delete user:", userId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Quản lý người dùng</h1>
          <p className="mt-2 text-slate-600">
            Quản lý tài khoản, quyền hạn và trạng thái người dùng
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col gap-4 xxl:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <Input
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <option value="all">Tất cả quyền hạn</option>
            <option value="ADMIN">Admin</option>
            <option value="MODERATOR">Moderator</option>
            <option value="EMPLOYEE">Nhân viên</option>
            <option value="USER">Người dùng</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="blocked">Bị khóa</option>
          </select>

          {/* Add User Button */}
          <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold shadow-lg">
            <Plus size={18} />
            Thêm người dùng
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    Người dùng
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    Quyền hạn
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    Ngày tham gia
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-400 text-white font-semibold">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-slate-900">
                              {user.name}
                            </p>
                            <p className="text-sm text-slate-500">
                              {user.phone}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-700">{user.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          className={`${getRoleColor(user.role)} text-xs font-semibold`}
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          className={`${getStatusColor(user.status)} text-xs font-semibold`}
                        >
                          {user.status === "active"
                            ? "Hoạt động"
                            : "Bị khóa"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-700">{user.joinDate}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild={false}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-slate-600 hover:text-slate-900"
                            >
                              <MoreVertical size={18} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onSelect={() => handleEdit(user.id)}
                              className="cursor-pointer text-slate-700 flex items-center gap-2"
                            >
                              <Edit size={16} />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() =>
                                handleBlockToggle(user.id)
                              }
                              className="cursor-pointer text-slate-700 flex items-center gap-2"
                            >
                              {user.status === "active" ? (
                                <>
                                  <Lock size={16} />
                                  Khóa tài khoản
                                </>
                              ) : (
                                <>
                                  <Unlock size={16} />
                                  Mở khóa tài khoản
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => handleDelete(user.id)}
                              className="cursor-pointer text-red-600 flex items-center gap-2"
                            >
                              <Trash2 size={16} />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <p className="text-slate-500">Không tìm thấy người dùng</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
            <p className="text-sm text-slate-600">
              Hiển thị {startIndex + 1} đến{" "}
              {Math.min(startIndex + itemsPerPage, filteredUsers.length)} của{" "}
              {filteredUsers.length} người dùng
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="h-9 w-9"
              >
                <ChevronLeft size={16} />
              </Button>
              <span className="text-sm text-slate-700 font-medium">
                Trang {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="h-9 w-9"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow-lg border-l-4 border-blue-600">
            <p className="text-sm text-slate-600 font-medium">Tổng người dùng</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {mockUsers.length}
            </p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-lg border-l-4 border-green-600">
            <p className="text-sm text-slate-600 font-medium">Hoạt động</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {mockUsers.filter((u) => u.status === "active").length}
            </p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-lg border-l-4 border-red-600">
            <p className="text-sm text-slate-600 font-medium">Bị khóa</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {mockUsers.filter((u) => u.status === "blocked").length}
            </p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-lg border-l-4 border-purple-600">
            <p className="text-sm text-slate-600 font-medium">Admin</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {mockUsers.filter((u) => u.role === "ADMIN").length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
