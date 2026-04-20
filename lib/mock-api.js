import { categories, products } from "./mockdata";

const baseProducts = products.map((product, index) => ({
  ...product,
  sku: `MONO-${String(index + 1).padStart(3, "0")}`,
  sellerId: index % 2 === 0 ? "seller-01" : "seller-02",
  featured: index < 3,
}));

const sellerProfiles = [
  {
    id: "seller-01",
    name: "Atelier North",
    storeName: "Atelier North",
    email: "north@monolith.test",
    phone: "+1 202 555 0178",
    address: "81 Mercer St, New York, NY",
    status: "approved",
    inventoryHealth: "steady",
  },
  {
    id: "seller-02",
    name: "Object Dept",
    storeName: "Object Dept",
    email: "objects@monolith.test",
    phone: "+1 415 555 0114",
    address: "14 Valencia St, San Francisco, CA",
    status: "pending",
    inventoryHealth: "low",
  },
];

const reviews = [
  {
    id: "r1",
    productId: "p1",
    author: "Leah",
    rating: 5,
    title: "Heavy in the best way",
    body: "Dense fabric, boxy fit, and no twisting after washing.",
    date: "2026-03-12",
  },
  {
    id: "r2",
    productId: "p2",
    author: "Marco",
    rating: 5,
    title: "Worth the spend",
    body: "Tailoring feels premium and the wool holds shape all day.",
    date: "2026-02-04",
  },
  {
    id: "r3",
    productId: "p5",
    author: "Amina",
    rating: 4,
    title: "Beautiful glaze",
    body: "Looks great on a shelf and feels handmade in a good way.",
    date: "2026-01-18",
  },
];

const orders = [
  {
    id: "ord-1001",
    customerId: "u-customer",
    customerName: "Maya Stone",
    customerEmail: "maya@monolith.test",
    status: "In transit",
    paymentStatus: "Paid",
    paymentMethod: "Credit card",
    shippingMethod: "Express",
    shippingAddress: "155 Prince St, New York, NY",
    createdAt: "2026-04-15",
    eta: "2026-04-22",
    subtotal: 228,
    shipping: 0,
    tax: 22.8,
    total: 250.8,
    items: [
      { productId: "p1", quantity: 1, price: 48 },
      { productId: "p3", quantity: 1, price: 180 },
    ],
    timeline: [
      { label: "Order placed", date: "2026-04-15", note: "Confirmation email sent." },
      { label: "Packed", date: "2026-04-16", note: "Warehouse picked and packed the order." },
      { label: "In transit", date: "2026-04-18", note: "Courier accepted the shipment." },
    ],
  },
  {
    id: "ord-1002",
    customerId: "u-customer",
    customerName: "Maya Stone",
    customerEmail: "maya@monolith.test",
    status: "Delivered",
    paymentStatus: "Paid",
    paymentMethod: "Wallet",
    shippingMethod: "Standard",
    shippingAddress: "155 Prince St, New York, NY",
    createdAt: "2026-03-27",
    eta: "2026-03-31",
    subtotal: 95,
    shipping: 12,
    tax: 10.7,
    total: 117.7,
    items: [{ productId: "p5", quantity: 1, price: 95 }],
    timeline: [
      { label: "Order placed", date: "2026-03-27", note: "Wallet payment approved." },
      { label: "Shipped", date: "2026-03-28", note: "Label created and parcel dispatched." },
      { label: "Delivered", date: "2026-03-31", note: "Signed for at front desk." },
    ],
  },
  {
    id: "ord-2001",
    customerId: "guest",
    customerName: "Guest Checkout",
    customerEmail: "guest@monolith.test",
    status: "Processing",
    paymentStatus: "Pending",
    paymentMethod: "Cash on Delivery",
    shippingMethod: "Standard",
    shippingAddress: "221B Mockingbird Lane",
    createdAt: "2026-04-19",
    eta: "2026-04-25",
    subtotal: 240,
    shipping: 12,
    tax: 25.2,
    total: 277.2,
    items: [{ productId: "p6", quantity: 1, price: 240 }],
    timeline: [
      { label: "Order placed", date: "2026-04-19", note: "Guest checkout confirmed." },
      { label: "Processing", date: "2026-04-20", note: "Awaiting seller handoff." },
    ],
  },
];

const mockUsers = [
  {
    id: "u-customer",
    name: "Maya Stone",
    email: "maya@monolith.test",
    phone: "+1 917 555 0101",
    role: "customer",
    status: "active",
    address: "155 Prince St, New York, NY",
    paymentDetails: {
      method: "Visa ending in 4242",
      walletBalance: 180,
      billingEmail: "maya@monolith.test",
    },
    emailConfirmed: true,
    favorites: ["p1", "p5"],
    orderIds: ["ord-1001", "ord-1002"],
  },
  {
    id: "seller-01",
    name: "Ari Bloom",
    email: "north@monolith.test",
    phone: "+1 202 555 0178",
    role: "seller",
    status: "approved",
    address: "81 Mercer St, New York, NY",
    paymentDetails: {
      method: "Bank transfer",
      walletBalance: 910,
      billingEmail: "north@monolith.test",
    },
    emailConfirmed: true,
    storeName: "Atelier North",
    favorites: ["p2"],
    orderIds: [],
  },
  {
    id: "admin-01",
    name: "June Mercer",
    email: "admin@monolith.test",
    phone: "+1 646 555 0182",
    role: "admin",
    status: "active",
    address: "Monolith HQ",
    paymentDetails: {
      method: "Internal account",
      walletBalance: 0,
      billingEmail: "admin@monolith.test",
    },
    emailConfirmed: true,
    favorites: [],
    orderIds: [],
  },
];

const contentBlocks = {
  banner: {
    title: "New Collection — 2026",
    subtitle: "Build your world.",
    cta: "Shop the drop",
    status: "published",
  },
  homepageSections: [
    { id: "hero", name: "Hero spotlight", status: "live" },
    { id: "departments", name: "Departments grid", status: "live" },
    { id: "priority", name: "Priority gear", status: "scheduled" },
  ],
};

const paymentMethods = [
  "Credit card",
  "PayPal",
  "Cash on Delivery",
  "Wallet",
];

const delay = (value, ms = 120) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export async function getCatalog() {
  return delay({ products: baseProducts, categories });
}

export async function getProductById(id) {
  const product = baseProducts.find((item) => item.id === id);
  return delay(
    product
      ? {
          ...product,
          seller: sellerProfiles.find((seller) => seller.id === product.sellerId),
          reviews: reviews.filter((review) => review.productId === id),
        }
      : null
  );
}

export async function searchProducts(filters = {}) {
  const { query = "", category = "", onlyInStock = false, maxPrice = Infinity } = filters;
  const normalizedQuery = query.trim().toLowerCase();
  const items = baseProducts.filter((product) => {
    const matchesQuery =
      !normalizedQuery ||
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.description.toLowerCase().includes(normalizedQuery);
    const matchesCategory = !category || product.category === category;
    const matchesStock = !onlyInStock || product.stock > 0;
    const matchesPrice = product.price <= maxPrice;
    return matchesQuery && matchesCategory && matchesStock && matchesPrice;
  });

  return delay(items);
}

export async function getMockUsers() {
  return delay(mockUsers);
}

export async function loginUser({ emailOrPhone, role }) {
  const lookup = emailOrPhone.trim().toLowerCase();
  const user = mockUsers.find((candidate) => {
    const emailMatch = candidate.email.toLowerCase() === lookup;
    const phoneMatch = candidate.phone.toLowerCase() === lookup;
    return candidate.role === role && (emailMatch || phoneMatch);
  });
  return delay(
    user || {
      ...mockUsers.find((candidate) => candidate.role === role),
      emailConfirmed: false,
      name: role === "seller" ? "Pending Seller" : "New User",
    }
  );
}

export async function registerUser(payload) {
  const createdUser = {
    id: `u-${payload.role}-${Date.now()}`,
    name: payload.fullName,
    email: payload.email,
    phone: payload.phone,
    role: payload.role,
    status: payload.role === "seller" ? "pending" : "active",
    address: payload.address || "Add your address",
    paymentDetails: {
      method: "No payment method yet",
      walletBalance: 0,
      billingEmail: payload.email,
    },
    emailConfirmed: false,
    favorites: [],
    orderIds: [],
    storeName: payload.storeName || "",
  };
  return delay(createdUser);
}

export async function getOrdersByUser(userId) {
  return delay(orders.filter((order) => order.customerId === userId));
}

export async function getAllOrders() {
  return delay(
    orders.map((order) => ({
      ...order,
      itemsDetailed: order.items.map((item) => ({
        ...item,
        product: baseProducts.find((product) => product.id === item.productId),
      })),
    }))
  );
}

export async function placeMockOrder(payload) {
  const subtotal = payload.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal >= 200 ? 0 : 12;
  const tax = Number((subtotal * 0.1).toFixed(2));
  const total = Number((subtotal + shipping + tax).toFixed(2));

  return delay({
    id: `ord-${Date.now()}`,
    status: "Processing",
    paymentStatus: payload.paymentMethod === "Cash on Delivery" ? "Pending" : "Paid",
    paymentMethod: payload.paymentMethod,
    shippingMethod: payload.shippingMethod,
    guest: payload.guest,
    emailNotification: `A confirmation email would be sent to ${payload.email}.`,
    subtotal,
    shipping,
    tax,
    total,
  });
}

export async function getAdminDashboardData() {
  return delay({
    users: mockUsers,
    sellers: sellerProfiles,
    products: baseProducts,
    categories,
    orders,
    contentBlocks,
  });
}

export async function getSellerDashboardData(sellerId = "seller-01") {
  const seller = sellerProfiles.find((item) => item.id === sellerId) || sellerProfiles[0];
  const sellerProducts = baseProducts.filter((product) => product.sellerId === seller.id);
  const sellerOrders = orders.filter((order) =>
    order.items.some((item) =>
      sellerProducts.some((product) => product.id === item.productId)
    )
  );

  return delay({
    seller,
    products: sellerProducts,
    orders: sellerOrders,
  });
}

export async function getPaymentMethods() {
  return delay(paymentMethods);
}
