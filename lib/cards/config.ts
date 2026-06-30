import { CardAdapter } from "./types";

export function redactSecrets(adapter: CardAdapter, config: Record<string, string>) {
  const redacted: Record<string, string> = {};
  const secretFieldsSet: string[] = [];

  for (const field of adapter.fields) {
    if (field.type === "secret") {
      if (config[field.key]) secretFieldsSet.push(field.key);
      redacted[field.key] = "";
    } else {
      redacted[field.key] = config[field.key] ?? "";
    }
  }

  return { config: redacted, secretFieldsSet };
}

export function mergeConfig(
  adapter: CardAdapter,
  incoming: Record<string, string>,
  existing: Record<string, string>
) {
  const merged: Record<string, string> = { ...incoming };

  for (const field of adapter.fields) {
    if (field.type === "secret" && !incoming[field.key]) {
      merged[field.key] = existing[field.key] ?? "";
    }
  }

  return merged;
}
