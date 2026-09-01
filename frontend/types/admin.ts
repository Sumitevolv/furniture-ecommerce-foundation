export interface AdminDashboardStats {
  totalProducts: number;
  lowStockProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalCustomers: number;
}

export interface AdminCustomer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: string;
}
