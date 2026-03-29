import Navigation from "@/components/study/Navigation";
import { auth } from "@/auth";

export default async function StudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user ?? null;

  let userProp;
  if (!user) {
    userProp = null;
  }

  userProp = {
    username: user!.name,
    role: user?.role,
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navigation user={userProp} />
      {children}
    </div>
  );
}
