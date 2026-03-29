import Navigation from "@/components/study/Navigation";
import { auth } from "@/auth";

export default async function StudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const userName = session?.user?.name ?? null;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navigation userName={userName} />
      {children}
    </div>
  );
}
