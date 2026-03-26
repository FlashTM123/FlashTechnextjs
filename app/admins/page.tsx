import {
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  ChevronRight,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - FlashTech",
  description: "Overview of key metrics and recent activity for FlashTech admins",
};
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const stats = [
  {
    name: "Total Users",
    value: "12,345",
    change: "+12.5%",
    trend: "up" as const,
    icon: Users,
    color: "blue",
  },
  {
    name: "Total Orders",
    value: "1,234",
    change: "+8.2%",
    trend: "up" as const,
    icon: ShoppingCart,
    color: "green",
  },
  {
    name: "Revenue",
    value: "$45,678",
    change: "-3.1%",
    trend: "down" as const,
    icon: DollarSign,
    color: "purple",
  },
  {
    name: "Growth",
    value: "23.5%",
    change: "+4.3%",
    trend: "up" as const,
    icon: TrendingUp,
    color: "orange",
  },
];

const recentOrders = [
  {
    id: "#12345",
    customer: "John Doe",
    email: "john@example.com",
    amount: "$156.00",
    status: "Completed",
    date: "2 hours ago",
  },
  {
    id: "#12346",
    customer: "Jane Smith",
    email: "jane@example.com",
    amount: "$234.50",
    status: "Pending",
    date: "4 hours ago",
  },
  {
    id: "#12347",
    customer: "Bob Johnson",
    email: "bob@example.com",
    amount: "$89.99",
    status: "Processing",
    date: "6 hours ago",
  },
  {
    id: "#12348",
    customer: "Alice Brown",
    email: "alice@example.com",
    amount: "$312.00",
    status: "Completed",
    date: "1 day ago",
  },
  {
    id: "#12349",
    customer: "Charlie Wilson",
    email: "charlie@example.com",
    amount: "$67.25",
    status: "Cancelled",
    date: "2 days ago",
  },
];

const statusConfig = {
  Completed: "bg-green-100 text-green-800 border-green-200",
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Processing: "bg-blue-100 text-blue-800 border-blue-200",
  Cancelled: "bg-red-100 text-red-800 border-red-200",
};

const colorConfig = {
  blue: {
    bg: "bg-gradient-to-br from-blue-50 to-blue-100",
    icon: "text-blue-600",
  },
  green: {
    bg: "bg-gradient-to-br from-green-50 to-green-100",
    icon: "text-green-600",
  },
  purple: {
    bg: "bg-gradient-to-br from-purple-50 to-purple-100",
    icon: "text-purple-600",
  },
  orange: {
    bg: "bg-gradient-to-br from-orange-50 to-orange-100",
    icon: "text-orange-600",
  },
};

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-2 text-slate-600">
            Welcome back! Here's your business performance overview.
          </p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 shadow-lg">
          Export Report <ChevronRight size={18} />
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const config = colorConfig[stat.color as keyof typeof colorConfig];
          return (
            <Card key={stat.name} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0">
              <div className={`${config.bg} p-6 border-b border-slate-100`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-slate-600">
                    {stat.name}
                  </h3>
                  <div className={`p-2.5 rounded-lg ${config.bg}`}>
                    <Icon size={20} className={config.icon} />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-3xl font-bold text-slate-900">
                  {stat.value}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 font-semibold ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <ArrowUpRight size={16} />
                    ) : (
                      <ArrowDownRight size={16} />
                    )}
                    {stat.change}
                  </span>
                  <span className="text-sm text-slate-500">
                    compared to last month
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Orders */}
      <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
        <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Orders</h2>
              <p className="text-sm text-slate-600">Latest transactions</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1 border-slate-200"
            >
              View All <ChevronRight size={16} />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-900">
                      {order.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-900">
                        {order.customer}
                      </p>
                      <p className="text-xs text-slate-500">{order.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-900">
                      {order.amount}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      className={`${
                        statusConfig[
                          order.status as keyof typeof statusConfig
                        ]
                      } border font-medium`}
                    >
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{order.date}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-slate-100"
                          >
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Order</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Cancel Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
