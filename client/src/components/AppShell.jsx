import Sidebar from './Sidebar.jsx';

export default function AppShell({ sidebarVariant = 'collapsed', children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eef2f7] p-6">
      <div className="flex h-[720px] w-full max-w-[1080px] overflow-hidden rounded-2xl border border-gesty-border bg-white shadow-sm">
        <Sidebar variant={sidebarVariant} />
        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>
    </div>
  );
}
