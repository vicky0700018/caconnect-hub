import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-server";
import { getCollection } from "@/lib/mongodb";

export async function GET(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [clientsCol, deadlinesCol, feesCol, docsCol, noticesCol, demandsCol] =
      await Promise.all([
        getCollection("clients"),
        getCollection("deadlines"),
        getCollection("fees"),
        getCollection("documents"),
        getCollection("notice_tracker"),
        getCollection("income_tax"),
      ]);

    const [clientsCount, allDeadlines, allFees, docsCount, noticesCount, allDemands] =
      await Promise.all([
        clientsCol.countDocuments({ userId: user.userId }),
        deadlinesCol.find({ userId: user.userId }).toArray(),
        feesCol.find({ userId: user.userId }).toArray(),
        docsCol.countDocuments({ userId: user.userId, status: "Open" }),
        noticesCol.countDocuments({ userId: user.userId, status: "Received" }),
        demandsCol.find({ userId: user.userId }).toArray(),
      ]);

    // Compute overdue filings
    const overdueFilings = allDeadlines.filter((d) => d.status === "Overdue").length;

    // Compute due in 7 days
    const now = new Date();
    const next7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const dueIn7Days = allDeadlines.filter((d) => {
      if (d.status === "Filed" || !d.dueDate) return false;
      const due = new Date(d.dueDate);
      return due >= now && due <= next7Days;
    }).length;

    // Compute fees
    const feesOverdue = allFees
      .filter((f) => f.status === "Overdue")
      .reduce((sum, f) => sum + (Number(f.amount) || 0), 0);

    const feesOutstanding = allFees
      .filter((f) => f.status === "Invoiced" || f.status === "Overdue")
      .reduce((sum, f) => sum + (Number(f.amount) || 0), 0);

    const feesCollected = allFees
      .filter((f) => f.status === "Paid")
      .reduce((sum, f) => sum + (Number(f.amount) || 0), 0);

    // Demands total
    const demandsOutstanding = allDemands.reduce(
      (sum, d) => sum + (Number(d.amount) || 0),
      0,
    );

    return NextResponse.json({
      stats: {
        clients: clientsCount,
        overdueFilings,
        dueIn7Days,
        feesOverdue,
        feesOutstanding,
        feesCollected,
        pendingDocuments: docsCount,
        openNotices: noticesCount,
        demandsCount: allDemands.length,
        demandsOutstanding,
      },
    });
  } catch (err) {
    console.warn("MongoDB GET dashboard fallback:", err);
    return NextResponse.json({
      stats: {
        clients: 0,
        overdueFilings: 0,
        dueIn7Days: 0,
        feesOverdue: 0,
        feesOutstanding: 0,
        feesCollected: 0,
        pendingDocuments: 0,
        openNotices: 0,
        demandsCount: 0,
        demandsOutstanding: 0,
      },
    });
  }
}
