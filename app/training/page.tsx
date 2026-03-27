import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Target, Map, BarChart2 } from "lucide-react";

async function getUserStats(userId: string) {
  const sessions = await prisma.drillSession.findMany({
    where: { userId, status: "COMPLETED", overallScore: { not: null } },
    select: { drillType: true, trainingMode: true, overallScore: true },
  });

  const objectionSessions = sessions.filter((s) => s.drillType === "OBJECTION");
  const walkthroughSessions = sessions.filter((s) => s.drillType === "WALKTHROUGH");

  const avg = (arr: typeof sessions) =>
    arr.length === 0
      ? null
      : Math.round(arr.reduce((s, d) => s + (d.overallScore ?? 0), 0) / arr.length);

  return {
    objectionCount: objectionSessions.length,
    objectionAvg: avg(objectionSessions),
    walkthroughCount: walkthroughSessions.length,
    walkthroughAvg: avg(walkthroughSessions),
    totalCount: sessions.length,
  };
}

export default async function TrainingHubPage() {
  const session = await auth();
  const stats = await getUserStats(session!.user.id);

  const cards = [
    {
      href: "/training/objection",
      icon: Target,
      title: "Objection Drill",
      description:
        "Practice handling specific objections — Price, Urgency, or Trust — with an AI homeowner at any resistance level.",
      count: stats.objectionCount,
      avg: stats.objectionAvg,
      color: "#A32D2D",
    },
    {
      href: "/training/walkthrough",
      icon: Map,
      title: "Full Walkthrough",
      description:
        "Simulate a complete sales presentation from entry to close with a randomly generated homeowner and roof scenario.",
      count: stats.walkthroughCount,
      avg: stats.walkthroughAvg,
      color: "#185FA5",
    },
    {
      href: "/training/history",
      icon: BarChart2,
      title: "History",
      description:
        "Review your past drill scores, track improvement over time, and see how you stack up on the leaderboard.",
      count: stats.totalCount,
      avg: null,
      color: "#854F0B",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Training Drills</h1>
        <p className="text-gray-400 text-sm mt-1">
          Welcome back, {session?.user.name ?? "Rep"}.
          {session?.user.branch ? ` ${session.user.branch} branch.` : ""}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-600 transition-all hover:bg-gray-800"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${card.color}20` }}
              >
                <Icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
              <h2 className="font-bold text-white text-lg mb-2">{card.title}</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                {card.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>{card.count} drills</span>
                {card.avg !== null && (
                  <>
                    <span>·</span>
                    <span>Avg: {card.avg}</span>
                  </>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
