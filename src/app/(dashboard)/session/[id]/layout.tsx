import Navigation from "@/components/Navigation";

export default function SessionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <Navigation />
      <main className="flex-1 overflow-y-auto p-4 md:p-10 pb-28 md:pb-10">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
