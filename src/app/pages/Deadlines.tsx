"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
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
  const {
    deadlines,
    clientNames,
    updateDeadlineStatusAsync,
    removeDeadlineAsync,
    toast,
  } = useStore();
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

  const advance = async (id: string, to: "In Progress" | "Filed") => {
    await updateDeadlineStatusAsync(id, to);
    toast(to === "Filed" ? "Marked as filed." : "Started — moved to in progress.");
  };

  const rows = (list: typeof deadlines) =>
    list.map((d) => (
      <tr
        key={d.id}
        className="border-b border-border/70 hover:bg-surface-2/40 transition-colors"
      >
        <Td className="py-3 px-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground text-[13px]">{d.task}</span>
            {d.period ? (
              <span className="text-[12px] font-normal text-muted-foreground">{d.period}</span>
            ) : null}
          </div>
          <div className="text-[12px] text-muted-foreground mt-0.5">{d.client}</div>
        </Td>
        <Td className="whitespace-nowrap text-right py-3 px-4">
          <div className="inline-flex items-center justify-end gap-3 sm:gap-4">
            {/* Days overdue & Due date */}
            <div className="text-right">
              {d.status === "Overdue" && d.daysOverdue > 0 ? (
                <div className="text-[12px] font-normal text-danger">
                  {d.daysOverdue} days overdue
                </div>
              ) : null}
              <div className="text-[11px] text-muted-foreground">{d.dueDate}</div>
            </div>

            {/* Status badge */}
            <div className="min-w-[65px] text-center">
              <Badge>{d.status}</Badge>
            </div>

            {/* Start / Mark filed button */}
            {d.status !== "Filed" ? (
              <Button
                size="sm"
                onClick={() => advance(d.id, d.status === "In Progress" ? "Filed" : "In Progress")}
              >
                {d.status === "In Progress" ? "Mark filed" : "✓ Start"}
              </Button>
            ) : null}

            {/* Three-dots menu */}
            <MoreMenu
              items={[
                {
                  label: "Mark pending",
                  onClick: async () => {
                    await updateDeadlineStatusAsync(d.id, "Open");
                    toast("Marked as pending.");
                  },
                },
                {
                  label: "Mark in progress",
                  onClick: async () => {
                    await updateDeadlineStatusAsync(d.id, "In Progress");
                    toast("Marked in progress.");
                  },
                },
                {
                  label: "Mark filed",
                  onClick: async () => {
                    await updateDeadlineStatusAsync(d.id, "Filed");
                    toast("Marked as filed.");
                  },
                },
                {
                  label: "Mark done",
                  onClick: async () => {
                    await updateDeadlineStatusAsync(d.id, "Filed");
                    toast("Marked as done.");
                  },
                },
                {
                  label: "Remove",
                  danger: true,
                  divider: true,
                  icon: <Trash2 className="size-3.5 text-danger" />,
                  onClick: async () => {
                    await removeDeadlineAsync(d.id);
                    toast("Deadline removed.");
                  },
                },
              ]}
            />
          </div>
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
          <span className="font-semibold text-danger">Overdue</span>{" "}
          <span>{overdue.length} · Past the due date — deal with these first</span>
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
        <SectionBar>
          <span className="font-semibold text-foreground">Everything else</span>{" "}
          <span>· {others.length}</span>
        </SectionBar>
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
