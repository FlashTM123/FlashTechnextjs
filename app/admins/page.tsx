import {
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const stats = [
  {
    name: "Total Users",
    value: "12,345",
    change: "+12.5%",
    trend: "up" as const,
    icon: Users,
  },
  {
    name: "Total Orders",
    value: "1,234",
    change: "+8.2%",
    trend: "up" as const,
    icon: ShoppingCart,
  },
  {
    name: "Revenue",
    value: "$45,678",
    change: "-3.1%",
    trend: "down" as const,
    icon: DollarSign,
  },
  {
    name: "Growth",
    value: "23.5%",
    change: "+4.3%",
    trend: "up" as const,
    icon: TrendingUp,
  },
];

const recentOrders = [
  { id: "#12345", customer: "John Doe", email: "john@example.com", amount: "$156.00", status: "Completed" },
  { id: "#12346", customer: "Jane Smith", email: "jane@example.com", amount: "$234.50", status: "Pending" },
  { id: "#12347", customer: "Bob Johnson", email: "bob@example.com", amount: "$89.99", status: "Processing" },
  { id: "#12348", customer: "Alice Brown", email: "alice@example.com", amount: "$312.00", status: "Completed" },
  { id: "#12349", customer: "Charlie Wilson", email: "charlie@example.com", amount: "$67.25", status: "Cancelled" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.name}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <div className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-3 text-white">
                  <Icon size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm">
                <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="inline h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="inline h-4 w-4" />
                  )}
                  {stat.change}
                </span>
                <span className="text-slate-600">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="font-semibold text-slate-900">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Order ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{order.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-900">{order.customer}</p>
                      <p className="text-sm text-slate-600">{order.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">{order.amount}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "Processing"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
