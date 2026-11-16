"use client";

import { useState, useSyncExternalStore } from "react";
import {
  CART_CHANGE_EVENT,
  CART_STORAGE_KEY,
  parseCartItems,
  writeCartItems,
  type CartItem,
} from "@/lib/cart-storage";

const emptyCart: CartItem[] = [];
const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

let cachedRawValue: string | null | undefined;
let cachedItems = emptyCart;

function getCartSnapshot() {
  let rawValue: string | null;

  try {
    rawValue = window.localStorage.getItem(CART_STORAGE_KEY);
  } catch {
    return emptyCart;
  }

  if (rawValue === cachedRawValue) {
    return cachedItems;
  }

  cachedRawValue = rawValue;
  cachedItems = parseCartItems(rawValue);
  return cachedItems;
}

function getServerSnapshot() {
  return emptyCart;
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

export default function CartPage() {
  const items = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    getServerSnapshot,
  );
  const [message, setMessage] = useState("");
  const total = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  function handleRemove(id: number) {
    const item = items.find((cartItem) => cartItem.id === id);
    const nextItems = items.filter((cartItem) => cartItem.id !== id);

    if (writeCartItems(window.localStorage, nextItems)) {
      window.dispatchEvent(new Event(CART_CHANGE_EVENT));
      setMessage(item ? `${item.title} sepetten silindi.` : "");
    } else {
      setMessage("Ürün sepetten silinemedi. Lütfen tekrar deneyin.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-950 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-col gap-5 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
              Mikro Mağaza
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Sepet
            </h1>
          </div>
          <a
            href="/"
            className="inline-flex w-fit rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900"
          >
            Alışverişe devam et
          </a>
        </header>

        <p role="status" aria-live="polite" className="mt-5 min-h-6 text-sm font-medium text-emerald-700">
          {message}
        </p>

        {items.length === 0 ? (
          <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <h2 className="text-2xl font-bold tracking-tight">Sepetiniz boş</h2>
            <p className="mt-3 leading-7 text-slate-600">
              Beğendiğiniz ürünleri sepete ekleyerek alışverişe başlayın.
            </p>
            <a
              href="/"
              className="mt-7 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900"
            >
              Ürünleri incele
            </a>
          </section>
        ) : (
          <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <h2 className="font-semibold leading-6 text-slate-900">
                        {item.title}
                      </h2>
                      <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
                        <div>
                          <dt className="inline">Birim fiyat: </dt>
                          <dd className="inline font-medium text-slate-900">
                            {usdFormatter.format(item.unitPrice)}
                          </dd>
                        </div>
                        <div>
                          <dt className="inline">Adet: </dt>
                          <dd className="inline font-medium text-slate-900">
                            {item.quantity}
                          </dd>
                        </div>
                      </dl>
                    </div>
                    <div className="flex items-center justify-between gap-5 sm:flex-col sm:items-end">
                      <p className="text-lg font-bold">
                        {usdFormatter.format(item.unitPrice * item.quantity)}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        aria-label={`${item.title} ürününü sepetten sil`}
                        className="text-sm font-semibold text-red-700 underline decoration-red-200 underline-offset-4 transition hover:text-red-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-700"
                      >
                        Ürünü sil
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="rounded-2xl bg-slate-950 p-6 text-white shadow-sm">
              <p className="text-sm font-medium text-slate-300">Sepet toplamı</p>
              <p className="mt-2 text-3xl font-bold">{usdFormatter.format(total)}</p>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Toplam {items.reduce((sum, item) => sum + item.quantity, 0)} ürün
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
