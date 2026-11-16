import Link from "next/link";

export default function ProductNotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-5 py-12 text-slate-950">
      <section className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
          404
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          Ürün bulunamadı
        </h1>
        <p className="mt-4 leading-7 text-slate-600">
          Aradığınız ürün mevcut değil veya kaldırılmış olabilir.
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900"
        >
          Ürünlere dön
        </Link>
      </section>
    </main>
  );
}
