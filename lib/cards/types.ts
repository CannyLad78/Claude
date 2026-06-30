export type CardFieldType = "text" | "number" | "url" | "select" | "secret";

export type CardConfigField = {
  key: string;
  label: string;
  type: CardFieldType;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  options?: { label: string; value: string }[];
};

export type CardTypeMeta = {
  type: string;
  label: string;
  description: string;
  fields: CardConfigField[];
};

export type CardMetric = {
  label: string;
  value: string | number;
  unit?: string;
};

export type CardData = {
  primary: CardMetric;
  items?: CardMetric[];
  updatedAt: string;
};

export type CardAdapter = CardTypeMeta & {
  fetchData: (config: Record<string, string>) => Promise<CardData>;
};
