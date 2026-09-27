export default function Footer() {
  return (
    <footer className="mt-24 border-t border-ink/10">
      <div className="lane" />
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between gap-4 text-sm text-ink/60">
        <p>&copy; {new Date().getFullYear()} RideGo. Built as a final-year project.</p>
        <div className="flex gap-6">
          <span>Made with React &amp; Express</span>
          <span>SQL Server &middot; JWT Auth</span>
        </div>
      </div>
    </footer>
  );
}
