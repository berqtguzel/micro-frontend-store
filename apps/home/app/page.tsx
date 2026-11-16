import Image from "next/image";
import Link from "next/link";
import { DataSourceError } from "@/components/data-source-error";
import { formatUsd } from "@/lib/currency";
import {
  getProducts,
  isProductDataError,
  type Product,
} from "@/lib/products";

function ProductCard({ product }: { product: Product }) {
  return (
    <li>
      <Link
        href={`/products/${product.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900"
      >
        <div className="relative aspect-square bg-white p-8">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-8 transition duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col border-t border-slate-100 p-5">
          <h2 className="line-clamp-2 text-base font-semibold leading-6 text-slate-900">
            {product.title}
          </h2>
          <p className="mt-auto pt-5 text-lg font-bold text-slate-950">
            {formatUsd(product.price)}
          </p>
        </div>
      </Link>
    </li>
  );
}

export default async function HomePage() {
  let products: Product[];

  try {
    products = await getProducts();
  } catch (error) {
    if (isProductDataError(error)) {
      return <DataSourceError />;
    }

    throw error;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-12 text-slate-950 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 border-b border-slate-200 pb-8">
          <div className="flex items-center justify-between gap-5">
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
              Mikro Mağaza
            </p>
            <a
              href="/cart"
              className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900"
            >
              Sepete git
            </a>
          </div>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Ürünler
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Güncel ürünleri inceleyin ve ayrıntılar için bir ürünü seçin.
          </p>
        </header>

        {products.length > 0 ? (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-600">
            Henüz gösterilecek ürün bulunmuyor.
          </p>
        )}
      </div>
    </main>
  );
}
