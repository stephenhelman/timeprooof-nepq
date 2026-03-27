import Navigation from "@/components/study/Navigation";

export default function StudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navigation />
      {children}
    </div>
  );
}
