import { CardAdapter } from "../types";

export const homeAssistantAdapter: CardAdapter = {
  type: "home-assistant",
  label: "Home Assistant",
  description: "Show the state of a single Home Assistant entity via its REST API.",
  fields: [
    {
      key: "baseUrl",
      label: "Base URL",
      type: "url",
      required: true,
      placeholder: "http://homeassistant.local:8123",
    },
    { key: "token", label: "Long-Lived Access Token", type: "secret", required: true },
    {
      key: "entityId",
      label: "Entity ID",
      type: "text",
      required: true,
      placeholder: "sensor.living_room_temperature",
    },
  ],
  async fetchData(config) {
    const base = config.baseUrl.replace(/\/+$/, "");
    const res = await fetch(`${base}/api/states/${encodeURIComponent(config.entityId)}`, {
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Home Assistant request failed (${res.status})`);
    const data = await res.json();
    const attributes = data.attributes ?? {};

    const items = Object.entries(attributes)
      .filter(([key]) => key !== "friendly_name" && key !== "unit_of_measurement")
      .slice(0, 4)
      .map(([key, value]) => ({ label: key, value: String(value) }));

    return {
      primary: {
        label: attributes.friendly_name ?? config.entityId,
        value: data.state,
        unit: attributes.unit_of_measurement,
      },
      items,
      updatedAt: data.last_updated ?? new Date().toISOString(),
    };
  },
};
