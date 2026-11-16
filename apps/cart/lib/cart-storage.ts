export const CART_STORAGE_KEY = "micro-frontend-store:cart:v1";
export const CART_CHANGE_EVENT = "micro-frontend-store:cart-change";

export type CartItem = {
  id: number;
  title: string;
  unitPrice: number;
  quantity: number;
};

type CartState = {
  version: 1;
  items: CartItem[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isCartItem(value: unknown): value is CartItem {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "number" &&
    Number.isInteger(value.id) &&
    value.id > 0 &&
    typeof value.title === "string" &&
    value.title.trim().length > 0 &&
    typeof value.unitPrice === "number" &&
    Number.isFinite(value.unitPrice) &&
    value.unitPrice >= 0 &&
    typeof value.quantity === "number" &&
    Number.isInteger(value.quantity) &&
    value.quantity > 0
  );
}

export function parseCartItems(rawValue: string | null): CartItem[] {
  if (!rawValue) {
    return [];
  }

  try {
    const value: unknown = JSON.parse(rawValue);

    if (
      !isRecord(value) ||
      value.version !== 1 ||
      !Array.isArray(value.items) ||
      !value.items.every(isCartItem)
    ) {
      return [];
    }

    return value.items;
  } catch {
    return [];
  }
}

export function readCartItems(storage: Storage): CartItem[] {
  try {
    return parseCartItems(storage.getItem(CART_STORAGE_KEY));
  } catch {
    return [];
  }
}

export function writeCartItems(storage: Storage, items: CartItem[]): boolean {
  const state: CartState = { version: 1, items };

  try {
    storage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function addCartItem(
  storage: Storage,
  product: Omit<CartItem, "quantity">,
): boolean {
  const items = readCartItems(storage);
  const existingItem = items.find((item) => item.id === product.id);
  const nextItems = existingItem
    ? items.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      )
    : [...items, { ...product, quantity: 1 }];

  return writeCartItems(storage, nextItems);
}
