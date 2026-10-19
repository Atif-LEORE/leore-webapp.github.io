export const isValidWhatsAppNumber = (phone) =>
  typeof phone === "string" && /^[1-9]\d{7,14}$/.test(phone);

export function getProductOrderDisabledReason({ phone, inStock, size }) {
  if (!inStock) return "This product is sold out.";
  if (!size) return "Select a size first.";
  if (!isValidWhatsAppNumber(phone)) return "WhatsApp is not configured.";
  return "";
}

export function isCartOrderAvailable(phone, items) {
  return isValidWhatsAppNumber(phone) && items.length > 0;
}

export function createWhatsAppUrl(phone, message) {
  if (!isValidWhatsAppNumber(phone)) return null;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function createContactMessage() {
  return "Hi Leore, I have a question about your products. Could you please help me?";
}

export function createProductOrderMessage({
  name,
  price,
  size,
  color,
  quantity,
}) {
  const details = [
    `Product: ${name}`,
    `Price: ${price}`,
    `Size: ${size}`,
    ...(color ? [`Color: ${color}`] : []),
    `Quantity: ${quantity}`,
  ];

  return `Hi Leore! I'd like to place an order.\n\n${details.join(
    "\n",
  )}\n\nPlease confirm availability and delivery details.`;
}

export function createCartOrderMessage(lines, formatPrice) {
  const subtotal = lines.reduce(
    (total, line) => total + line.product.price * line.qty,
    0,
  );
  const items = lines.flatMap(({ product, size, color, qty }) => [
    `${product.name}`,
    ...(size ? [`  Size: ${size}`] : []),
    ...(color ? [`  Color: ${color}`] : []),
    `  Quantity: ${qty}`,
    `  Unit price: ${formatPrice(product.price)}`,
  ]);

  return `Hi Leore! I'd like to place an order.\n\n${items.join(
    "\n",
  )}\n\nSubtotal: ${formatPrice(subtotal)}\nTotal: ${formatPrice(
    subtotal,
  )}\n\nPlease confirm availability and delivery details.`;
}
