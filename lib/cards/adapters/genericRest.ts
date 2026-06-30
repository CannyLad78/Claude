import { CardAdapter } from "../types";

function resolvePath(obj: unknown, path: string): unknown {
  const keys = path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean);

  return keys.reduce<unknown>((acc, key) => {
    if (acc == null || typeof acc !== "object") return undefined;
    return (acc as Record<string, unknown>)[key];
  }, obj);
}

export const genericRestAdapter: CardAdapter = {
  type: "generic-rest",
  label: "Custom API",
  description: "Pull a single value out of any JSON API response using a field path.",
  fields: [
    { key: "url", label: "Request URL", type: "url", required: true, placeholder: "https://api.example.com/status" },
    {
      key: "method",
      label: "Method",
      type: "select",
      options: [
        { label: "GET", value: "GET" },
        { label: "POST", value: "POST" },
      ],
    },
    { key: "valueLabel", label: "Value label", type: "text", placeholder: "Status" },
    {
      key: "jsonPath",
      label: "JSON field path",
      type: "text",
      required: true,
      placeholder: "data.items[0].value",
      helpText: "Dot notation, e.g. data.items[0].value",
    },
    { key: "headerName", label: "Header name (optional)", type: "text", placeholder: "Authorization" },
    { key: "headerValue", label: "Header value (optional)", type: "secret" },
  ],
  async fetchData(config) {
    const headers: Record<string, string> = { Accept: "application/json" };
    if (config.headerName) headers[config.headerName] = config.headerValue ?? "";

    const res = await fetch(config.url, {
      method: config.method || "GET",
      headers,
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    const data = await res.json();
    const value = resolvePath(data, config.jsonPath);

    return {
      primary: {
        label: config.valueLabel || "Value",
        value: value === undefined ? "—" : (value as string | number),
      },
      updatedAt: new Date().toISOString(),
    };
  },
};
