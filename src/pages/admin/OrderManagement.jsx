import { useEffect, useState } from "react";
import api from "../../api/axios";
import { ShieldAlert, PackageSearch } from "lucide-react";
import { toast } from "react-toastify";

function OrderManagement() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/users");
      const allOrders = [];

      res.data.forEach((user) => {
        if (user.orders?.length) {
          user.orders.forEach((order) => {
            allOrders.push({
              ...order,
              userId: user.id,
              userName: user.name,
              userEmail: user.email,
            });
          });
        }
      });

      setOrders(allOrders);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  const handleStatusChange = async (orderId, userId, newStatus) => {
    try {
      const userRes = await api.get(`/users/${userId}`);
      const user = userRes.data;

      const updatedOrders = user.orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );

      await api.patch(`/users/${userId}`, { orders: updatedOrders });

      toast.success(`Order ${orderId} status updated to "${newStatus}"`);
      fetchOrders();
    } catch (err) {
      toast.error("Failed to update order status");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Heading */}
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-primary flex items-center gap-2">
        <PackageSearch className="w-6 h-6" />
        Order Management
      </h1>

      {/* Table Container */}
      <div className="w-full overflow-x-auto rounded-md shadow-md">
        <table className="table table-zebra w-full min-w-[1000px]">
          <thead className="bg-base-200 sticky top-0 z-10">
            <tr>
              <th>#</th>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Items</th>
              <th>Payment</th>
              <th>Address</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, idx) => (
              <tr key={order.id}>
                <td>{idx + 1}</td>

                <td className="text-xs text-gray-500">{order.id}</td>

                <td>
                  <div className="text-sm font-medium">
                    {order.userName}
                    <span className="block text-xs text-gray-400">
                      ({order.userId})
                    </span>
                  </div>
                </td>

                <td>₹{order.totalAmount.toFixed(2)}</td>

                <td className="text-sm">
                  {order.items
                    .map((item) => `${item.name} x${item.quantity}`)
                    .join(", ")}
                </td>

                <td className="uppercase">{order.paymentMethod}</td>

                <td className="text-xs">
                  <div>
                    {order.address.line1}, {order.address.city},{" "}
                    {order.address.state} - {order.address.pin}
                  </div>
                  <div className="italic text-gray-500 text-[10px]">
                    ({order.address.type})
                  </div>
                </td>

                <td>
                  <span
                    className={`badge ${
                      order.status === "pending"
                        ? "badge-warning"
                        : order.status === "shipped"
                        ? "badge-info"
                        : "badge-success"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>

                <td>
                  <select
                    className="select select-sm select-bordered"
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, order.userId, e.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center text-gray-400 italic py-4">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderManagement;
