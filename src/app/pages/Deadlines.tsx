import { useState } from "react";
import { SERVICES } from "@/data/mockData";
import { useStore } from "../store";
import { AddDeadlineModal } from "../modals";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  MoreMenu,
  PageHeader,
  SectionBar,
  Select,
  Td,
  TableWrap,
  EmptyState,
} from "../ui";

export default function Deadlines() {
  const { deadlines, setDeadlines, clientNames, toast } = useStore();
  const [open, setOpen] = useState(false);
  const [client, setClient] = useState("");
  const [service, setService] = useState("");
  const [showFiled, setShowFiled] = useState(false);

  const visible = deadlines.filter(
    (d) =>
      (!client || d.client === client) &&
      (!service || d.service === service) &&
      (showFiled || d.status !== "Filed"),
  );
  const overdue = visible.filter((d) => d.status === "Overdue");
  const others = visible.filter((d) => d.status !== "Overdue");
  const allOverdue = deadlines.filter((d) => d.status === "Overdue").length;
  const allOpen = deadlines.filter((d) => d.status !== "Filed").length;

  const advance = (id: string, to: "In Progress" | "Filed") => {
    setDeadlines((ds) => ds.map((d) => (d.id === id ? { ...d, status: to } : d)));
    toast(to === "Filed" ? "Marked as filed." : "Started — moved to in progress.");
  };

  const rows = (list: typeof deadlines) =>
    list.map((d) => (
      <tr key={d.id}>
        <Td>
          <div className="font-medium text-foreground">
            {d.task} — {d.period}
          </div>
          <div className="text-[12px] text-muted-foreground">
            {d.service} · {d.client}
          </div>
        </Td>
        <Td className="whitespace-nowrap text-danger">
          {d.daysOverdue > 0 ? `${d.daysOverdue} days overdue` : "—"}
        </Td>
        <Td className="whitespace-nowrap text-muted-foreground">{d.dueDate}</Td>
        <Td>
          <Badge>{d.status}</Badge>
        </Td>
        <Td className="whitespace-nowrap text-right">
          {d.status !== "Filed" ? (
            <Button
              size="sm"
              onClick={() => advance(d.id, d.status === "In Progress" ? "Filed" : "In Progress")}
            >
              {d.status === "In Progress" ? "Mark filed" : "Start"}
            </Button>
          ) : null}
          <MoreMenu
            items={[
              { label: "Mark filed", onClick: () => advance(d.id, "Filed") },
              {
                label: "Delete",
                onClick: () => {
                  setDeadlines((ds) => ds.filter((x) => x.id !== d.id));
                  toast("Deadline deleted.");
                },
              },
            ]}
          />
        </Td>
      </tr>
    ));

  return (
    <>
      <PageHeader
        title="Deadlines"
        subtitle={`${allOverdue} overdue · ${allOpen} open`}
        actions={
          <Button variant="primary" onClick={() => setOpen(true)}>
            + Add deadline
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="sm:w-56">
          <Select
            value={client}
            onChange={setClient}
            options={clientNames}
            placeholder="All clients"
          />
        </div>
        <div className="sm:w-48">
          <Select
            value={service}
            onChange={setService}
            options={SERVICES}
            placeholder="All services"
          />
        </div>
        <Checkbox
          label="Show filed"
          checked={showFiled}
          onToggle={() => setShowFiled((s) => !s)}
        />
      </div>

      <Card className="mb-4">
        <SectionBar>
          Overdue · {overdue.length} · Past the due date — deal with these first
        </SectionBar>
        {overdue.length ? (
          <TableWrap>
            <tbody>{rows(overdue)}</tbody>
          </TableWrap>
        ) : (
          <EmptyState title="Nothing overdue" hint="Everything here is within its due date." />
        )}
      </Card>

      <Card>
        <SectionBar>Everything else · {others.length}</SectionBar>
        {others.length ? (
          <TableWrap>
            <tbody>{rows(others)}</tbody>
          </TableWrap>
        ) : (
          <EmptyState title="No other deadlines" hint="Adjust the filters to see more." />
        )}
      </Card>

      <AddDeadlineModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
