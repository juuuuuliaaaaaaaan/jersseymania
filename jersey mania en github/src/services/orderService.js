import { userService } from './userService';

const ORDERS_KEY = 'jm_orders';

function readOrders() {
  const raw = localStorage.getItem(ORDERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function writeOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export const orderService = {
  createOrder(orderData) {
    const orders = readOrders();
    const id = orders.length ? Math.max(...orders.map(o => o.id)) + 1 : 1;

    // Asegurar que el encargo incluye el nombre de usuario si existe sesión
    let username = orderData.username || null;
    if (!username) {
      const current = userService.getCurrentUser();
      if (current && current.username) username = current.username;
    }

    const order = {
      id,
      ...orderData,
      username, // puede ser null si no hay usuario
      createdAt: new Date().toISOString(),
      status: 'pendiente'
    };
    orders.push(order);
    writeOrders(orders);
    return order;
  },

  getAllOrders() {
    return readOrders();
  },

  updateOrderStatus(id, status) {
    const orders = readOrders();
    const order = orders.find(o => o.id === id);
    if (order) {
      order.status = status;
      writeOrders(orders);
    }
    return order;
  },

  deleteOrder(id) {
    const orders = readOrders();
    const filtered = orders.filter(o => o.id !== id);
    writeOrders(filtered);
    return true;
  }
};
