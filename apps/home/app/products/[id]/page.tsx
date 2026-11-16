import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DataSourceError } from "@/components/data-source-error";
import { formatUsd } from "@/lib/currency";
import {
  getProduct,
  isProductDataError,
  type Product,
} from "@/lib/products";

export const metadata: Metadata = {
  title: "Ürün Detayı",
};

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage(props: ProductPageProps) {
  const { id } = await props.params;
  let product: Product | null;

  try {
    product = await getProduct(id);
  } catch (error) {
    if (isProductDataError(error)) {
      return <DataSourceError />;
    }

    throw error;
  }

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-950 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="inline-flex text-sm font-semibold text-slate-600 transition hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900"
        >
          ← Ürünlere dön
        </Link>

        <article className="mt-8 grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:grid-cols-2">
          <div className="relative min-h-80 bg-white p-10 sm:min-h-112">
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              priority
              className="object-contain p-10"
            />
          </div>

          <div className="flex flex-col border-t border-slate-200 p-7 sm:p-10 md:border-l md:border-t-0">
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
              {product.category}
            </p>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              {product.title}
            </h1>
            <p className="mt-6 text-base leading-8 text-slate-600">
              {product.description}
            </p>
            <p className="mt-10 text-3xl font-bold text-slate-950">
              {formatUsd(product.price)}
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}
