import test from "node:test";
import assert from "node:assert/strict";
import {
  createCartOrderMessage,
  createContactMessage,
  createProductOrderMessage,
  createWhatsAppUrl,
  getProductOrderDisabledReason,
  isCartOrderAvailable,
  isValidWhatsAppNumber,
} from "./whatsapp.js";

test("validates international WhatsApp numbers as digits only", () => {
  assert.equal(isValidWhatsAppNumber("919876543210"), true);
  assert.equal(isValidWhatsAppNumber("+919876543210"), false);
  assert.equal(isValidWhatsAppNumber("91 9876543210"), false);
  assert.equal(isValidWhatsAppNumber("0912345678"), false);
  assert.equal(isValidWhatsAppNumber("1234567"), false);
  assert.equal(isValidWhatsAppNumber("1234567890123456"), false);
});

test("prevents product ordering without stock, size, or a valid phone number", () => {
  assert.equal(
    getProductOrderDisabledReason({
      phone: "919876543210",
      inStock: true,
      size: "",
    }),
    "Select a size first.",
  );
  assert.equal(
    getProductOrderDisabledReason({
      phone: "919876543210",
      inStock: false,
      size: "M",
    }),
    "This product is sold out.",
  );
  assert.equal(
    getProductOrderDisabledReason({
      phone: "",
      inStock: true,
      size: "M",
    }),
    "WhatsApp is not configured.",
  );
  assert.equal(
    getProductOrderDisabledReason({
      phone: "919876543210",
      inStock: true,
      size: "M",
    }),
    "",
  );
});

test("does not allow ordering an empty cart or with a missing phone number", () => {
  assert.equal(isCartOrderAvailable("919876543210", []), false);
  assert.equal(isCartOrderAvailable("", [{ product: {}, qty: 1 }]), false);
  assert.equal(isCartOrderAvailable("919876543210", [{ product: {}, qty: 1 }]), true);
});

test("creates a Click-to-Chat URL with safely encoded text", () => {
  const message = "Hi Leore! Size M & color: rust / teal?";
  const url = createWhatsAppUrl("919876543210", message);

  assert.equal(
    url,
    `https://wa.me/919876543210?text=${encodeURIComponent(message)}`,
  );
  assert.equal(createWhatsAppUrl("", message), null);
  assert.equal(createWhatsAppUrl("91+9876543210", message), null);
});

test("creates a contact message with the requested greeting", () => {
  assert.equal(
    createContactMessage(),
    "Hi Leore, I have a question about your products. Could you please help me?",
  );
});

test("includes product pricing and selected options in order message", () => {
  const message = createProductOrderMessage({
    name: "The Signature Hoodie",
    price: "₹2,100",
    size: "M",
    quantity: 2,
  });

  assert.match(message, /Product: The Signature Hoodie/);
  assert.match(message, /Price: ₹2,100/);
  assert.match(message, /Size: M/);
  assert.match(message, /Quantity: 2/);
  assert.doesNotMatch(message, /Color:/);
  assert.match(message, /Please confirm availability and delivery details\./);
});

test("includes optional color only when the product offers one", () => {
  const message = createProductOrderMessage({
    name: "Rust Hoodie",
    price: "₹1,699",
    size: "L",
    color: "Rust",
    quantity: 1,
  });

  assert.match(message, /Color: Rust/);
});

test("creates a cart order summary with unit prices and totals", () => {
  const lines = [
    { product: { name: "The Signature Hoodie", price: 2100 }, size: "M", qty: 2 },
    { product: { name: "Teal Hoodie", price: 1699 }, size: "L", qty: 1 },
  ];
  const message = createCartOrderMessage(
    lines,
    (price) => `₹${price.toLocaleString("en-IN")}`,
  );

  assert.match(message, /The Signature Hoodie/);
  assert.match(message, /Size: M/);
  assert.match(message, /Quantity: 2/);
  assert.match(message, /Unit price: ₹2,100/);
  assert.match(message, /Teal Hoodie/);
  assert.match(message, /Subtotal: ₹5,899/);
  assert.match(message, /Total: ₹5,899/);
});
