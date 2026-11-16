import { connection } from "next/server";

const apiBaseUrl =
  process.env.FAKE_STORE_API_URL ?? "https://fakestoreapi.com";

export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

export class ProductDataError extends Error {
  constructor() {
    super("Product data is unavailable");
    this.name = "ProductDataError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseProduct(value: unknown): Product | null {
  if (!isRecord(value)) {
    return null;
  }

  const { id, title, price, description, category, image } = value;

  if (
    typeof id !== "number" ||
    !Number.isInteger(id) ||
    typeof title !== "string" ||
    typeof price !== "number" ||
    !Number.isFinite(price) ||
    typeof description !== "string" ||
    typeof category !== "string" ||
    typeof image !== "string"
  ) {
    return null;
  }

  return {
    id,
    title,
    price,
    description,
    category,
    image,
  };
}

async function request(path: string) {
  try {
    return await fetch(`${apiBaseUrl}${path}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
  } catch {
    throw new ProductDataError();
  }
}

export async function getProducts(): Promise<Product[]> {
  await connection();

  const response = await request("/products");

  if (!response.ok) {
    throw new ProductDataError();
  }

  try {
    const data: unknown = await response.json();

    if (!Array.isArray(data)) {
      throw new ProductDataError();
    }

    const products = data.map(parseProduct);

    if (products.some((product) => product === null)) {
      throw new ProductDataError();
    }

    return products as Product[];
  } catch (error) {
    if (error instanceof ProductDataError) {
      throw error;
    }

    throw new ProductDataError();
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  if (!/^[1-9]\d*$/.test(id)) {
    return null;
  }

  const response = await request(`/products/${id}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new ProductDataError();
  }

  try {
    const data: unknown = await response.json();
    return parseProduct(data);
  } catch {
    throw new ProductDataError();
  }
}

export function isProductDataError(
  error: unknown,
): error is ProductDataError {
  return error instanceof ProductDataError;
}
