type Props = {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
};

export default function StatCard({ label, value, sub, accent = "bg-indigo-50 text-indigo-700" }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <p className={`mt-1 inline-block rounded-lg px-2 py-0.5 text-2xl font-bold ${accent}`}>
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
    </div>
  );
}
