import { getApiBaseUrl } from "@/config/api";

type FetchOptions = RequestInit & {
  query?: Record<string, string | number | boolean | undefined>;
};

const buildUrl = (path: string, query?: FetchOptions["query"]) => {
  const url = new URL(path.replace(/^\//, ""), getApiBaseUrl());
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (typeof value === "undefined") return;
      url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
};

export async function apiFetch<T = unknown>(path: string, options: FetchOptions = {}): Promise<T> {
  const { query, headers, ...rest } = options;
  const url = buildUrl(path, query);

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...rest,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(errorText || "API request failed");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}


