"use client";

import { useSyncExternalStore } from "react";
import {
  CART_CHANGE_EVENT,
  CART_STORAGE_KEY,
  parseCartItems,
} from "@/lib/cart-storage";

type CartLinkProps = {
  className: string;
};

let cachedRawValue: string | null | undefined;
let cachedItemCount = 0;

function getCartItemCount() {
  let rawValue: string | null;

  try {
    rawValue = window.localStorage.getItem(CART_STORAGE_KEY);
  } catch {
    return 0;
  }

  if (rawValue === cachedRawValue) {
    return cachedItemCount;
  }

  cachedRawValue = rawValue;
  cachedItemCount = parseCartItems(rawValue).reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return cachedItemCount;
}

function getServerItemCount() {
  return 0;
}

function subscribeToCart(onStoreChange: () => void) {
  const handleCartChange = () => onStoreChange();
  const handleStorage = (event: StorageEvent) => {
    if (event.key === CART_STORAGE_KEY || event.key === null) {
      onStoreChange();
    }
  };

  window.addEventListener(CART_CHANGE_EVENT, handleCartChange);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(CART_CHANGE_EVENT, handleCartChange);
    window.removeEventListener("storage", handleStorage);
  };
}

export function CartLink({ className }: CartLinkProps) {
  const itemCount = useSyncExternalStore(
    subscribeToCart,
    getCartItemCount,
    getServerItemCount,
  );

  return (
    <a href="/cart" className={className}>
      {itemCount > 0 ? `Sepet (${itemCount})` : "Sepet"}
    </a>
  );
}
