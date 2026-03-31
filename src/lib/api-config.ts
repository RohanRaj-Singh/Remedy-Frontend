const LOCAL_API_BASE_URL = "http://127.0.0.1:5001";

function normalizeBaseUrl(value: string): string {
  return value.replace(/\/+$/, "");
}

function resolveApiBaseUrl(...values: Array<string | undefined>): string {
  const configuredValue = values.find((value) => value?.trim())?.trim();

  if (configuredValue) {
    return normalizeBaseUrl(configuredValue);
  }

  if (process.env.NODE_ENV !== "production") {
    return LOCAL_API_BASE_URL;
  }

  throw new Error(
    "Missing API base URL. Set NEXT_PUBLIC_API_BASE_URL for client calls and API_BASE_URL for server-side requests."
  );
}

export function getPublicApiBaseUrl(): string {
  return resolveApiBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL);
}

export function getServerApiBaseUrl(): string {
  return resolveApiBaseUrl(
    process.env.API_BASE_URL,
    process.env.NEXT_PUBLIC_API_BASE_URL
  );
}
