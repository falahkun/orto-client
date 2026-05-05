export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-y-auto">
      <div className="mx-auto">
        {children}
      </div>
    </div>
  );
}
