"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CardConfigForm from "./CardConfigForm";
import type { CardTypeMeta } from "@/lib/cards/types";

type DashboardCardDTO = {
  id: string;
  title: string;
  type: string;
  order: number;
  refreshSec: number;
  enabled: boolean;
  config: Record<string, string>;
  secretFieldsSet: string[];
};

export default function CardManager({
  initialCards,
  types,
}: {
  initialCards: DashboardCardDTO[];
  types: CardTypeMeta[];
}) {
  const router = useRouter();
  const [cards, setCards] = useState(initialCards);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function removeCard(id: string) {
    if (!confirm("Remove this card?")) return;
    await fetch(`/api/cards/${id}`, { method: "DELETE" });
    setCards((c) => c.filter((card) => card.id !== id));
    router.refresh();
  }

  async function toggleEnabled(card: DashboardCardDTO) {
    await fetch(`/api/cards/${card.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: !card.enabled }),
    });
    setCards((c) => c.map((x) => (x.id === card.id ? { ...x, enabled: !x.enabled } : x)));
    router.refresh();
  }

  async function move(card: DashboardCardDTO, direction: -1 | 1) {
    const sorted = [...cards].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((c) => c.id === card.id);
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const other = sorted[swapIdx];

    await Promise.all([
      fetch(`/api/cards/${card.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: other.order }),
      }),
      fetch(`/api/cards/${other.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: card.order }),
      }),
    ]);
    setCards((c) =>
      c.map((x) => {
        if (x.id === card.id) return { ...x, order: other.order };
        if (x.id === other.id) return { ...x, order: card.order };
        return x;
      })
    );
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-800">Add a card</h2>
        <AddCardForm
          types={types}
          onCreated={(card) => {
            setCards((c) => [...c, card]);
            router.refresh();
          }}
        />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-800">Your cards</h2>
        {cards.length === 0 ? (
          <p className="text-sm text-gray-400">No cards yet. Add one above.</p>
        ) : (
          <div className="space-y-3">
            {[...cards]
              .sort((a, b) => a.order - b.order)
              .map((card) => {
                const meta = types.find((t) => t.type === card.type);
                return (
                  <div key={card.id} className="rounded-2xl border border-gray-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-800">{card.title}</p>
                        <p className="text-xs text-gray-400">
                          {meta?.label ?? card.type} · refreshes every {card.refreshSec}s
                          {!card.enabled && " · disabled"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => move(card, -1)} className={iconBtnCls} aria-label="Move up">
                          ↑
                        </button>
                        <button onClick={() => move(card, 1)} className={iconBtnCls} aria-label="Move down">
                          ↓
                        </button>
                        <button onClick={() => toggleEnabled(card)} className={iconBtnCls}>
                          {card.enabled ? "Disable" : "Enable"}
                        </button>
                        <button
                          onClick={() => setEditingId(editingId === card.id ? null : card.id)}
                          className={iconBtnCls}
                        >
                          {editingId === card.id ? "Close" : "Edit"}
                        </button>
                        <button
                          onClick={() => removeCard(card.id)}
                          className="text-xs font-medium text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    {editingId === card.id && meta && (
                      <div className="mt-4 border-t border-gray-100 pt-4">
                        <EditCardForm
                          card={card}
                          fields={meta.fields}
                          onSaved={(updated) => {
                            setCards((c) => c.map((x) => (x.id === updated.id ? updated : x)));
                            setEditingId(null);
                            router.refresh();
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </section>
    </div>
  );
}

function AddCardForm({
  types,
  onCreated,
}: {
  types: CardTypeMeta[];
  onCreated: (card: DashboardCardDTO) => void;
}) {
  const [type, setType] = useState(types[0]?.type ?? "");
  const [title, setTitle] = useState("");
  const [refreshSec, setRefreshSec] = useState("60");
  const [config, setConfig] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const meta = types.find((t) => t.type === type);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await fetch("/api/cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, title: title || meta?.label, refreshSec, config }),
    });
    setSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Failed to create card");
      return;
    }
    const card = await res.json();
    onCreated({
      id: card.id,
      title: card.title,
      type: card.type,
      order: card.order,
      refreshSec: card.refreshSec,
      enabled: card.enabled,
      config,
      secretFieldsSet: [],
    });
    setTitle("");
    setConfig({});
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Card type</label>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setConfig({});
            }}
            className={inputCls}
          >
            {types.map((t) => (
              <option key={t.type} value={t.type}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={meta?.label}
            className={inputCls}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Refresh (seconds)</label>
          <input
            type="number"
            min={5}
            value={refreshSec}
            onChange={(e) => setRefreshSec(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      {meta && <p className="text-xs text-gray-400">{meta.description}</p>}
      {meta && (
        <CardConfigForm
          fields={meta.fields}
          values={config}
          onChange={(key, value) => setConfig((c) => ({ ...c, [key]: value }))}
        />
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button type="submit" disabled={saving} className={btnCls}>
        {saving ? "Adding…" : "Add card"}
      </button>
    </form>
  );
}

function EditCardForm({
  card,
  fields,
  onSaved,
}: {
  card: DashboardCardDTO;
  fields: CardTypeMeta["fields"];
  onSaved: (card: DashboardCardDTO) => void;
}) {
  const [title, setTitle] = useState(card.title);
  const [refreshSec, setRefreshSec] = useState(String(card.refreshSec));
  const [config, setConfig] = useState<Record<string, string>>(card.config);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/cards/${card.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, refreshSec, config }),
    });
    setSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Failed to save card");
      return;
    }
    const secretFieldsSet = fields
      .filter((f) => f.type === "secret" && (config[f.key] || card.secretFieldsSet.includes(f.key)))
      .map((f) => f.key);
    onSaved({
      ...card,
      title,
      refreshSec: Number(refreshSec),
      config,
      secretFieldsSet,
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Refresh (seconds)</label>
          <input
            type="number"
            min={5}
            value={refreshSec}
            onChange={(e) => setRefreshSec(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>
      <CardConfigForm
        fields={fields}
        values={config}
        onChange={(key, value) => setConfig((c) => ({ ...c, [key]: value }))}
        secretFieldsSet={card.secretFieldsSet}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button type="submit" disabled={saving} className={btnCls}>
        {saving ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}

const iconBtnCls = "rounded-lg border border-gray-200 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50";
const inputCls =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400";
const btnCls =
  "w-full rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 sm:w-auto sm:px-6";
