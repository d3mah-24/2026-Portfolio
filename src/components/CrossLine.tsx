/* ── Vercel-style cross line with + markers ── */
export function CrossLine() {
  return (
    <div className="relative h-px bg-neutral-200 dark:bg-neutral-800">
      <div className="cross-marker left-0" />
      <div className="cross-marker left-full" />
    </div>
  );
}
