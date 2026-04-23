"use client";

function getId(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value._id || value.id || "";
}

function toTitleCase(value = "") {
  return value
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function requestJSON(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
  });

  const contentType = response.headers.get("content-type") || "";
  const isJSON = contentType.includes("application/json");
  const data = isJSON ? await response.json() : null;

  if (!response.ok) {
    const fallbackMessage = isJSON
      ? "Request failed"
      : "Server returned an unexpected response";
    throw new Error(data?.message || fallbackMessage);
  }

  if (!isJSON) {
    throw new Error("Server returned an unexpected response");
  }

  return data;
}

export function normalizeProduct(product) {
  return {
    ...product,
    id: getId(product),
    image: product.image || product.images?.[0] || "/placeholder-product.png",
    images: product.images || (product.image ? [product.image] : []),
    category:
      typeof product.category === "string"
        ? product.category
        : product.category?.name || "",
    seller:
      typeof product.seller === "string"
        ? { id: product.seller }
        : product.seller
          ? {
              id: getId(product.seller),
              name: product.seller.name,
              storeName: product.seller.storeName,
            }
          : null,
    rating: product.rating ?? product.averageRating ?? 0,
    reviews: product.reviews ?? product.reviewCount ?? 0,
  };
}

export function normalizeCategory(category, products = []) {
  const categoryId = getId(category);
  const count = products.filter((product) => {
    if (typeof product.category === "string") {
      return product.category === categoryId || product.category === category.name;
    }

    return getId(product.category) === categoryId;
  }).length;

  return {
    ...category,
    id: categoryId,
    count,
  };
}

export function normalizeOrder(order) {
  return {
    ...order,
    id: getId(order),
    total: order.total ?? order.totalAmount ?? 0,
    createdAt: order.createdAt
      ? new Date(order.createdAt).toLocaleDateString()
      : order.createdAt,
    paymentMethod: toTitleCase(order.paymentMethod),
    status: toTitleCase(order.status),
    items: (order.items || []).map((item) => ({
      ...item,
      product: item.product ? normalizeProduct(item.product) : null,
    })),
  };
}

export function normalizeReview(review) {
  return {
    ...review,
    id: getId(review),
    author:
      typeof review.user === "string"
        ? review.user
        : review.user?.name || "Anonymous",
    title: `Rated ${review.rating}/5`,
    body: review.comment || "No written review provided.",
    date: review.createdAt
      ? new Date(review.createdAt).toLocaleDateString()
      : review.date,
  };
}

export function normalizeUser(user) {
  return {
    ...user,
    id: getId(user),
    emailConfirmed: user.emailConfirmed ?? user.emailVerified ?? false,
    paymentDetails: user.paymentDetails || {
      method: user.paymentMethods?.[0]?.type
        ? toTitleCase(user.paymentMethods[0].type)
        : "No payment method saved",
      walletBalance:
        user.paymentMethods?.find((method) => method.type === "wallet")?.details
          ?.walletBalance || 0,
    },
  };
}
