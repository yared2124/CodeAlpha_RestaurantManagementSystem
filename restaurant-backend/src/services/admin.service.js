import orderService from "./order.service.js";
import inventoryService from "./inventory.service.js";
import tableService from "./table.service.js";

class AdminService {
  /**
   * Get aggregated data for the admin dashboard.
   * @returns {Promise<Object>} dashboard metrics
   */
  async getDashboardData() {
    // 1. Today's orders (excluding cancelled)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const allOrders = await orderService.getAllOrders();
    const todayOrders = allOrders.filter((o) => {
      const orderDate = new Date(o.createdAt);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate >= today && o.status !== "cancelled";
    });

    const totalRevenue = todayOrders.reduce(
      (sum, o) => sum + Number(o.totalAmount),
      0,
    );
    const totalOrdersToday = todayOrders.length;

    // 2. Low stock ingredients
    const allIngredients = await inventoryService.getAllIngredients();
    const lowStockItems = allIngredients.filter(
      (i) => Number(i.stockQuantity) < Number(i.minThreshold),
    );

    // 3. Available tables
    const allTables = await tableService.getAllTables();
    const availableTables = allTables.filter((t) => t.status === "available");

    return {
      totalOrdersToday,
      revenueToday: totalRevenue,
      lowStockCount: lowStockItems.length,
      availableTables: availableTables.length,
      lowStockItems: lowStockItems.map((i) => ({
        name: i.name,
        stock: i.stockQuantity,
        threshold: i.minThreshold,
        unit: i.unit,
      })),
    };
  }
}

export default new AdminService();
