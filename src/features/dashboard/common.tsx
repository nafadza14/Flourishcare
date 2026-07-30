import { Loader2, Inbox } from "lucide-react";

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
}: {
  title: string;
  description?: string;
  icon?: typeof Inbox;
}) {
  return (
    <div className="bg-white rounded-2xl border border-primary/10 p-10 text-center">
      <Icon className="mx-auto mb-3 text-text-secondary/40" size={40} />
      <h3 className="font-heading font-bold text-lg mb-1">{title}</h3>
      {description && <p className="text-sm text-text-secondary max-w-md mx-auto">{description}</p>}
    </div>
  );
}

export function LoadingBlock({ label = "Memuat data…" }: { label?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-primary/10 p-10 flex items-center justify-center text-text-secondary text-sm">
      <Loader2 className="animate-spin mr-2" size={18} /> {label}
    </div>
  );
}
