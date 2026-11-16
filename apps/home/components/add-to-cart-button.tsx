"use client";

import { useEffect, useRef, useState } from "react";
import { addCartItem, CART_CHANGE_EVENT } from "@/lib/cart-storage";

type AddToCartButtonProps = {
  product: {
    id: number;
    title: string;
    unitPrice: number;
  };
};

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [message, setMessage] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function handleAddToCart() {
    const added = addCartItem(window.localStorage, product);

    if (added) {
      window.dispatchEvent(new Event(CART_CHANGE_EVENT));
      setMessage("Ürün sepete eklendi.");
    } else {
      setMessage("Ürün sepete eklenemedi. Lütfen tekrar deneyin.");
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => setMessage(""), 3_000);
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleAddToCart}
        className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900 sm:w-auto"
      >
        Sepete ekle
      </button>
      <p
        role="status"
        aria-live="polite"
        className="mt-3 min-h-6 text-sm font-medium text-emerald-700"
      >
        {message}
      </p>
    </div>
  );
}
