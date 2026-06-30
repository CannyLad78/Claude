import { CardAdapter, CardTypeMeta } from "./types";
import { weatherAdapter } from "./adapters/weather";
import { homeAssistantAdapter } from "./adapters/homeAssistant";
import { genericRestAdapter } from "./adapters/genericRest";

export const CARD_ADAPTERS: CardAdapter[] = [weatherAdapter, homeAssistantAdapter, genericRestAdapter];

export function getCardAdapter(type: string): CardAdapter {
  const adapter = CARD_ADAPTERS.find((a) => a.type === type);
  if (!adapter) throw new Error(`Unknown card type: "${type}"`);
  return adapter;
}

export function getCardTypeMetas(): CardTypeMeta[] {
  return CARD_ADAPTERS.map((adapter) => ({
    type: adapter.type,
    label: adapter.label,
    description: adapter.description,
    fields: adapter.fields,
  }));
}
