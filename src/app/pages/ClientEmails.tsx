import { useStore } from "../store";
import { Button, Card, EmptyState, PageHeader } from "../ui";

export default function ClientEmails() {
  const { emails, setEmails, setPage, toast } = useStore();

  return (
    <>
      <PageHeader
        title="Client Emails"
        subtitle="AI-drafted updates and reminders for your clients."
        actions={
          <Button variant="primary" onClick={() => setPage("Draft a client email")}>
            Draft an email
          </Button>
        }
      />

      <Card>
        {emails.length === 0 ? (
          <EmptyState
            title="No client emails yet"
            hint="Pick a client and a topic, and let AI draft the note for you."
            action={
              <Button variant="primary" onClick={() => setPage("Draft a client email")}>
                Draft an email
              </Button>
            }
          />
        ) : (
          <div className="divide-y divide-border">
            {emails.map((e) => (
              <div key={e.id} className="p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">{e.subject}</p>
                  <p className="text-[12px] text-muted-foreground">{e.createdAt}</p>
                </div>
                <p className="text-[12px] text-muted-foreground">
                  {e.client} · {e.topic}
                </p>
                <p className="mt-2 whitespace-pre-line text-[13px] text-muted-foreground">
                  {e.body}
                </p>
                <div className="mt-3">
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      setEmails((es) => es.filter((x) => x.id !== e.id));
                      toast("Draft deleted.");
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}
