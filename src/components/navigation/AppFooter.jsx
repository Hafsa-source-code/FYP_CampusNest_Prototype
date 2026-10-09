/** Thin footer at the bottom of student pages. */
export function AppFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="flex w-full flex-col items-center justify-between gap-2 px-4 py-3 text-caption text-muted sm:flex-row sm:px-6 lg:px-10 2xl:px-16">
        <span>© 2026 CampusNest · Lahore</span>
        {/* Help, Safety and Terms pages don't exist yet, so these are plain text for now */}
        <span className="flex gap-5">
          <span>Help centre</span>
          <span>Safety</span>
          <span>Terms</span>
        </span>
      </div>
    </footer>
  )
}
