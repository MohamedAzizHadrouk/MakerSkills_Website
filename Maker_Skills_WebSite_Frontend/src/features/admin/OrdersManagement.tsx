import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Edit,
  Trash2,
  Search,
  Filter,
  ShoppingCart,
  Package,
  Truck,
  Eye,
  DollarSign,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  MapPin,
  Phone,
  Mail,
  User,
  Download,
} from "lucide-react";
import { useStore } from "../../stores/useStore";
import AnimatedSection from "../../components/UI/AnimatedSection";
import axios from "axios";
import * as XLSX from "xlsx";

interface Order {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  deliveryMethod: string;
  address?: string;
  orderDate: string;
  status: string;
  items: any[];
  withFormation?: boolean;
}

const OrdersManagement: React.FC = () => {
  const { theme } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDeliveryMethod, setFilterDeliveryMethod] = useState("all");
  const [filterDeliveryStatus, setFilterDeliveryStatus] = useState("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  // Ajout état pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [dateFrom, setDateFrom] = useState<string | null>(null);
  const [dateTo, setDateTo] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        import.meta.env?.VITE_API_URL + "/orders",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );
      setOrders(response.data?.data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des commandes:", error);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      await axios.put(`${import.meta.env?.VITE_API_URL}/orders/${orderId}`, {
        status: newStatus,
      });

      // Mettre à jour l'état local
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      // Mettre à jour la commande sélectionnée si elle est ouverte
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const exportToExcel = () => {
    const headers = [
      "Customer Name",
      "Email",
      "Phone",
      "Product",
      "Category",
      "Quantity",
      "Unit Price",
      "Total Price",
      "Delivery Method",
      "Address",
      "Avec formation",
      "Status",
      "Order Date",
    ];

    const data: Record<string, string | number>[] = orders.map((order) => ({
      "Customer Name": order.fullName,
      Email: order.email,
      Phone: order.phoneNumber,
      Product: order.productName,
      Category: order.items[0]?.category?.name || "N/A",
      Quantity: order.quantity,
      "Unit Price": formatPrice(order.unitPrice),
      "Total Price": formatPrice(order.totalPrice),
      "Delivery Method": getDeliveryMethodLabel(order.deliveryMethod),
      Address: order.address || "N/A",
      "Avec formation": order.withFormation ? "Oui" : "Non",
      Status: getStatusLabel(order.status),
      "Order Date": formatDate(order.orderDate),
    }));

    // Create a new workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data, { header: headers });

    // Apply styling
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "4B0082" } },
      alignment: { horizontal: "center", vertical: "center" },
    };

    // Apply header styling
    headers.forEach((_, index) => {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: index });
      ws[cellRef].s = headerStyle;
    });

    // Set column widths
    const colWidths = headers.map((header, index) => ({
      wch:
        Math.max(
          header.length,
          ...data.map((row) => String(row[header as keyof typeof row] ?? '').length)
        ) + 5,
    }));
    ws["!cols"] = colWidths;

    // Add borders to all cells
    const range = XLSX.utils.decode_range(ws["!ref"] || "A1:L1");
    for (let r = range.s.r; r <= range.e.r; r++) {
      for (let c = range.s.c; c <= range.e.c; c++) {
        const cellRef = XLSX.utils.encode_cell({ r, c });
        if (!ws[cellRef]) continue;
        ws[cellRef].s = {
          ...ws[cellRef].s,
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          },
        };
      }
    }

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Orders");

    // Generate and download the Excel file
    XLSX.writeFile(
      wb,
      `orders_export_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const deliveryMethods = [
    { id: "all", label: "Toutes les méthodes" },
    { id: "on-site", label: "Sur place" },
    { id: "home", label: "Livraison à domicile" },
  ];

  const deliveryStatuses = [
    { id: "all", label: "Tous les statuts" },
    { id: "pending", label: "En attente" },
    { id: "processing", label: "En traitement" },
    { id: "delivered", label: "Livré" },
    { id: "cancelled", label: "Annulé" },
  ];

  const getDeliveryMethodColor = (method: string) => {
    switch (method) {
      case "on-site":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "home":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getDeliveryStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "pending":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "processing":
        return <Clock className="h-4 w-4" />;
      case "pending":
        return <AlertCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getDeliveryMethodLabel = (method: string) => {
    switch (method) {
      case "on-site":
        return "Sur place";
      case "home":
        return "Livraison à domicile";
      default:
        return method;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "processing":
        return "En traitement";
      case "delivered":
        return "Livré";
      case "cancelled":
        return "Annulé";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} TND`;
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
    setIsDetailModalOpen(false);
  };

  // Trier les commandes par date selon le sortOrder
  const sortedOrders = [...orders].sort((a, b) => {
    const diff = new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
    return sortOrder === 'desc' ? -diff : diff;
  });

  // Ajout du filtre date dans le filtrage
  const filteredOrders = sortedOrders.filter((order) => {
    const matchesSearch =
      order.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDeliveryMethod =
      filterDeliveryMethod === "all" ||
      order.deliveryMethod === filterDeliveryMethod;
    const matchesDeliveryStatus =
      filterDeliveryStatus === "all" || order.status === filterDeliveryStatus;
    const orderDate = new Date(order.orderDate);
    const matchesDateFrom = !dateFrom || orderDate >= new Date(dateFrom);
    const matchesDateTo = !dateTo || orderDate <= new Date(dateTo + 'T23:59:59');
    return matchesSearch && matchesDeliveryMethod && matchesDeliveryStatus && matchesDateFrom && matchesDateTo;
  });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      } transition-colors duration-300`}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <AnimatedSection>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1
                className={`text-3xl font-bold mb-2 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Gestion des Commandes
              </h1>
              <p
                className={`${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Gérez et suivez toutes les commandes clients
              </p>
            </div>
            <button
              onClick={exportToExcel}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Exporter en Excel</span>
            </button>
          </div>
        </AnimatedSection>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Commandes",
              value: orders.length,
              color: "bg-blue-500",
              icon: ShoppingCart,
            },
            {
              title: "Chiffre d'affaires",
              value: `${formatPrice(totalRevenue)}`,
              color: "bg-green-500",
              icon: DollarSign,
            },
            {
              title: "Livraisons",
              value: orders.filter((o) => o.deliveryMethod === "home").length,
              color: "bg-purple-500",
              icon: Truck,
            },
            {
              title: "Panier Moyen",
              value: `${formatPrice(avgOrderValue)}`,
              color: "bg-orange-500",
              icon: Package,
            },
          ].map((stat, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -5 }}
                className={`p-6 rounded-xl shadow-lg ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {stat.title}
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}
                  >
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        {/* Filters */}
        <AnimatedSection>
          <div
            className={`p-6 rounded-xl mb-8 ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } shadow-lg`}
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Rechercher une commande..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                  } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                />
              </div>
              <div className="flex items-center gap-2 mb-2 sm:mb-0">
                <label htmlFor="dateFrom" className="text-sm text-gray-600">Du</label>
                <input
                  id="dateFrom"
                  type="date"
                  value={dateFrom || ''}
                  onChange={e => setDateFrom(e.target.value || null)}
                  className="px-2 py-2 rounded border border-gray-300 text-gray-700"
                />
                <label htmlFor="dateTo" className="text-sm text-gray-600">au</label>
                <input
                  id="dateTo"
                  type="date"
                  value={dateTo || ''}
                  onChange={e => setDateTo(e.target.value || null)}
                  className="px-2 py-2 rounded border border-gray-300 text-gray-700"
                />
                <label htmlFor="sortOrder" className="text-sm text-gray-600 ml-2">Tri</label>
                <select
                  id="sortOrder"
                  value={sortOrder}
                  onChange={e => setSortOrder(e.target.value as 'desc' | 'asc')}
                  className="px-2 py-2 rounded border border-gray-300 text-gray-700"
                >
                  <option value="desc">Plus récentes d'abord</option>
                  <option value="asc">Plus anciennes d'abord</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Filter
                  className={`h-5 w-5 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                />
                <select
                  value={filterDeliveryMethod}
                  onChange={(e) => setFilterDeliveryMethod(e.target.value)}
                  className={`px-4 py-3 rounded-lg border transition-colors ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                >
                  {deliveryMethods.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.label}
                    </option>
                  ))}
                </select>

                <select
                  value={filterDeliveryStatus}
                  onChange={(e) => setFilterDeliveryStatus(e.target.value)}
                  className={`px-4 py-3 rounded-lg border transition-colors ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                >
                  {deliveryStatuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Orders Table */}
        <AnimatedSection>
          <div
            className={`rounded-xl shadow-lg overflow-hidden ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead
                  className={`${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <tr>
                    <th
                      className={`px-6 py-4 text-left text-sm font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Commande
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-sm font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Client
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-sm font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Produit
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-sm font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Livraison
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-sm font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Avec formation
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-sm font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Statut
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-sm font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Montant
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-sm font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Date
                    </th>
                    <th
                      className={`px-6 py-4 text-left text-sm font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedOrders.map((order, index) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className={`${
                        theme === "dark"
                          ? "hover:bg-gray-700"
                          : "hover:bg-gray-50"
                      } transition-colors`}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div
                            className={`font-medium ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            #{order._id.slice(-8)}
                          </div>
                          <div
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            Qté: {order.quantity}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div
                            className={`font-medium ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {order.fullName}
                          </div>
                          <div
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            {order.email}
                          </div>
                          <div
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            {order.phoneNumber}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <Package className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <div
                              className={`font-medium ${
                                theme === "dark"
                                  ? "text-white"
                                  : "text-gray-900"
                              }`}
                            >
                              {order.productName}
                            </div>
                            <div
                              className={`text-sm ${
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              }`}
                            >
                              {order.items[0]?.category?.name || "Catégorie"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getDeliveryMethodColor(
                              order.deliveryMethod
                            )}`}
                          >
                            {getDeliveryMethodLabel(order.deliveryMethod)}
                          </span>
                          {order.address && (
                            <div
                              className={`text-sm ${
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-600"
                              }`}
                            >
                              {order.address}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.withFormation ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {order.withFormation ? 'Oui' : 'Non'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getDeliveryStatusColor(
                                order.status
                              )}`}
                            >
                              {getStatusIcon(order.status)}
                              <span>{getStatusLabel(order.status)}</span>
                            </span>
                          </div>
                          <select
                            value={order.status}
                            onChange={(e) =>
                              updateOrderStatus(order._id, e.target.value)
                            }
                            disabled={updatingOrderId === order._id}
                            className={`text-sm px-2 py-1 rounded border ${
                              theme === "dark"
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                            } focus:outline-none focus:ring-1 focus:ring-orange-500/20`}
                          >
                            <option value="pending">En attente</option>
                            <option value="processing">En traitement</option>
                            <option value="delivered">Livré</option>
                            <option value="cancelled">Annulé</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div
                            className={`font-medium ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {formatPrice(order.totalPrice)}
                          </div>
                          <div
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            {formatPrice(order.unitPrice)} x {order.quantity}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-gray-300"
                                : "text-gray-700"
                            }`}
                          >
                            {formatDate(order.orderDate)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openOrderDetails(order)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </AnimatedSection>

        {/* Pagination UI */}
        <div className="flex flex-col sm:flex-row justify-end items-center mt-6 gap-2">
          <div className="flex items-center gap-2 mb-2 sm:mb-0">
            <label htmlFor="itemsPerPage" className="text-sm text-gray-600">Afficher&nbsp;:</label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="px-2 py-1 rounded border border-gray-300 text-gray-700"
            >
              {[2, 6, 10, 20, 30, 50].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <span className="text-sm text-gray-600">par page</span>
          </div>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg border bg-white text-gray-700 disabled:opacity-50"
          >
            Précédent
          </button>
          <span className="px-2">Page {currentPage} / {totalPages}</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg border bg-white text-gray-700 disabled:opacity-50"
          >
            Suivant
          </button>
        </div>

        {/* Order Details Modal */}
        {isDetailModalOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              {/* Modal Header */}
              <div
                className={`p-6 border-b ${
                  theme === "dark" ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2
                      className={`text-2xl font-bold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Détails de la commande #{selectedOrder._id.slice(-8)}
                    </h2>
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Passée le {formatDate(selectedOrder.orderDate)}
                    </p>
                  </div>
                  <button
                    onClick={closeOrderDetails}
                    className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Order Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span
                      className={`flex items-center space-x-2 px-4 py-2 rounded-full text-lg font-medium ${getDeliveryStatusColor(
                        selectedOrder.status
                      )}`}
                    >
                      {getStatusIcon(selectedOrder.status)}
                      <span>{getStatusLabel(selectedOrder.status)}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Changer le statut:
                    </span>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) =>
                        updateOrderStatus(selectedOrder._id, e.target.value)
                      }
                      disabled={updatingOrderId === selectedOrder._id}
                      className={`px-3 py-2 rounded-lg border ${
                        theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                    >
                      <option value="pending">En attente</option>
                      <option value="processing">En traitement</option>
                      <option value="delivered">Livré</option>
                      <option value="cancelled">Annulé</option>
                    </select>
                  </div>
                </div>

                {/* Customer Information */}
                <div
                  className={`p-4 rounded-lg ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <h3
                    className={`text-lg font-semibold mb-4 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Informations client
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <User
                        className={`h-5 w-5 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      />
                      <div>
                        <p
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Nom complet
                        </p>
                        <p
                          className={`font-medium ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {selectedOrder.fullName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail
                        className={`h-5 w-5 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      />
                      <div>
                        <p
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Email
                        </p>
                        <p
                          className={`font-medium ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {selectedOrder.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone
                        className={`h-5 w-5 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      />
                      <div>
                        <p
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Téléphone
                        </p>
                        <p
                          className={`font-medium ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {selectedOrder.phoneNumber}
                        </p>
                      </div>
                    </div>
                    {selectedOrder.address && (
                      <div className="flex items-start space-x-3 md:col-span-2">
                        <MapPin
                          className={`h-5 w-5 mt-1 ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        />
                        <div>
                          <p
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            Adresse de livraison
                          </p>
                          <p
                            className={`font-medium ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {selectedOrder.address}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Information */}
                <div
                  className={`p-4 rounded-lg ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <h3
                    className={`text-lg font-semibold mb-4 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Produit commandé
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                      <Package className="h-8 w-8 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <h4
                        className={`text-lg font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {selectedOrder.productName}
                      </h4>
                      <p
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {selectedOrder.items[0]?.category?.name || "Catégorie"}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Quantité: {selectedOrder.quantity}
                        </span>
                        <span
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Prix unitaire: {formatPrice(selectedOrder.unitPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Information */}
                <div
                  className={`p-4 rounded-lg ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <h3
                    className={`text-lg font-semibold mb-4 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Livraison
                  </h3>
                  <div className="flex items-center space-x-3">
                    <Truck
                      className={`h-5 w-5 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    />
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getDeliveryMethodColor(
                          selectedOrder.deliveryMethod
                        )}`}
                      >
                        {getDeliveryMethodLabel(selectedOrder.deliveryMethod)}
                      </span>
                      {selectedOrder.deliveryMethod === "home" &&
                        selectedOrder.address && (
                          <p
                            className={`text-sm mt-2 ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            Adresse: {selectedOrder.address}
                          </p>
                        )}
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div
                  className={`p-4 rounded-lg ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <h3
                    className={`text-lg font-semibold mb-4 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Résumé de la commande
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span
                        className={`${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Prix unitaire
                      </span>
                      <span
                        className={`${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {formatPrice(selectedOrder.unitPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span
                        className={`${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Quantité
                      </span>
                      <span
                        className={`${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {selectedOrder.quantity}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span
                        className={`${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Sous-total
                      </span>
                      <span
                        className={`${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {formatPrice(
                          selectedOrder.unitPrice * selectedOrder.quantity
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span
                        className={`${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Frais de livraison
                      </span>
                      <span
                        className={`${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {selectedOrder.deliveryMethod === "home"
                          ? "5.00 TND"
                          : "Gratuit"}
                      </span>
                    </div>
                    <div
                      className={`pt-3 border-t ${
                        theme === "dark" ? "border-gray-600" : "border-gray-300"
                      }`}
                    >
                      <div className="flex justify-between">
                        <span
                          className={`text-lg font-semibold ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Total
                        </span>
                        <span className={`text-lg font-bold text-orange-600`}>
                          {formatPrice(selectedOrder.totalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Timeline */}
                <div
                  className={`p-4 rounded-lg ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <h3
                    className={`text-lg font-semibold mb-4 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Chronologie
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <ShoppingCart className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p
                          className={`font-medium ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Commande passée
                        </p>
                        <p
                          className={`text-sm ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {formatDate(selectedOrder.orderDate)}
                        </p>
                      </div>
                    </div>

                    {selectedOrder.status === "processing" && (
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                          <Clock className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p
                            className={`font-medium ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            En cours de traitement
                          </p>
                          <p
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            La commande est en cours de préparation
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedOrder.status === "delivered" && (
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p
                            className={`font-medium ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            Commande livrée
                          </p>
                          <p
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            La commande a été livrée avec succès
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedOrder.status === "cancelled" && (
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                          <XCircle className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p
                            className={`font-medium ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            Commande annulée
                          </p>
                          <p
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            La commande a été annulée
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div
                className={`p-6 border-t ${
                  theme === "dark" ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={closeOrderDetails}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      theme === "dark"
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Fermer
                  </button>
                  <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2">
                    <Edit className="h-4 w-4" />
                    <span>Modifier</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {filteredOrders.length === 0 && (
          <AnimatedSection>
            <div className="text-center py-12">
              <div
                className={`text-6xl mb-4 ${
                  theme === "dark" ? "text-gray-600" : "text-gray-400"
                }`}
              >
                🛒
              </div>
              <h3
                className={`text-xl font-semibold mb-2 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Aucune commande trouvée
              </h3>
              <p
                className={`${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Essayez de modifier vos critères de recherche ou ajoutez une
                nouvelle commande.
              </p>
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
};

export default OrdersManagement;
