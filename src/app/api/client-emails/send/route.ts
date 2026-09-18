import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth-server";
import { getCollection } from "@/lib/mongodb";
import { sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { client, to, subject, body: emailBody, topic, notes } = body;

    let recipientEmail = to ? to.trim() : "";

    // If recipient email is not provided, look up client's email in database
    if (!recipientEmail && client) {
      const clientsCol = await getCollection("clients");
      const escaped = client.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const clientDoc = await clientsCol.findOne({
        userId: user.userId,
        name: { $regex: new RegExp(`^${escaped}$`, "i") },
      });
      if (clientDoc && clientDoc.email) {
        recipientEmail = clientDoc.email.trim();
      }
    }

    if (!recipientEmail) {
      return NextResponse.json(
        { error: "Recipient email is required. Please provide an email address." },
        { status: 400 },
      );
    }

    if (!subject || !emailBody) {
      return NextResponse.json(
        { error: "Subject and message body are required." },
        { status: 400 },
      );
    }

    // Send the real email via Nodemailer Gmail SMTP
    await sendEmail({
      to: recipientEmail,
      subject,
      text: emailBody,
      html: emailBody.replace(/\n/g, "<br/>"),
    });

    // Record sent email in MongoDB client_emails collection
    const col = await getCollection("client_emails");
    const doc = {
      userId: user.userId,
      client: client || "Client",
      to: recipientEmail,
      topic: topic || "General",
      subject,
      body: emailBody,
      notes: notes || "",
      status: "Sent",
      createdAt: new Date().toISOString(),
      sentAt: new Date().toISOString(),
    };

    const result = await col.insertOne(doc);

    return NextResponse.json({
      success: true,
      email: {
        id: result.insertedId.toString(),
        ...doc,
      },
    });
  } catch (error: any) {
    console.error("Send client email error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to send email via SMTP" },
      { status: 500 },
    );
  }
}
