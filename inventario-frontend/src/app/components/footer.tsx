export default function Footer() {
  return (
    <footer
      className="mt-auto"
      style={{ borderTop: "1px solid var(--border-subtle)" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3" style={{ color: "var(--text-tertiary)" }}>
          <span className="font-mono">© 2026</span>
          <span>·</span>
          <span>Axel Yamil Severiano Ruiz</span>
          <span>·</span>
          <span className="font-mono">0239970</span>
        </div>
        <div className="flex items-center gap-2 font-mono" style={{ color: "var(--text-tertiary)" }}>
          <span>Desarrollo Web 2026</span>
          <span
            className="w-1 h-1 rounded-full"
            style={{ background: "var(--accent)" }}
          />
        </div>
      </div>
    </footer>
  );
}
