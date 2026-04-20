export function formatPrice(value) {
  return `$${Number(value).toFixed(2)}`;
}

export function titleCase(value) {
  if (!value) return "";
  return value
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
