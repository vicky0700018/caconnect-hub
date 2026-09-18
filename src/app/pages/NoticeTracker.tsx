"use client";

import { Trash2, PenSquare } from "lucide-react";
import { formatINR } from "@/data/mockData";
import { useStore } from "../store";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  PageHeader,
  Td,
  TableWrap,
  Th,
} from "../ui";

export default function NoticeTracker() {
  const { notices, removeNoticeAsync, setPage, toast } = useStore();
  const openAmount = notices.reduce((s, n) => s + (n.amount ?? 0), 0);

  return (
    <>
      <PageHeader
        title="Notice Tracker"
        subtitle={`${formatINR(openAmount)} in open matters.`}
        actions={
          <>
            <Button onClick={() => setPage("Draft a client email")}>
              <PenSquare className="size-3.5 mr-1.5 inline" />
              Draft a reply
            </Button>
            <Button variant="primary" onClick={() => setPage("Add notice matter")}>
              + Add matter
            </Button>
          </>
        }
      />

      <Card>
        {notices.length ? (
          <TableWrap>
            <thead>
              <tr className="border-b border-border bg-surface">
                <Th>Notice</Th>
                <Th>Client</Th>
                <Th>Drafted</Th>
                <Th>Status</Th>
                <Th className="text-right w-12"></Th>
              </tr>
            </thead>
            <tbody>
              {notices.map((n) => (
                <tr key={n.id} className="border-b border-border/70 hover:bg-surface-2/40 transition-colors">
                  <Td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground text-[13px]">{n.title}</span>
                      {n.noticeType ? (
                        <span className="rounded-full bg-[#1e2333] border border-[#2b3346] px-2 py-0.5 text-[11px] font-mono text-muted-foreground whitespace-nowrap">
                          {n.noticeType}
                        </span>
                      ) : null}
                    </div>
                  </Td>
                  <Td className="py-3 px-4 text-muted-foreground text-[13px]">{n.client || "—"}</Td>
                  <Td className="py-3 px-4 whitespace-nowrap text-muted-foreground text-[12px]">{n.drafted}</Td>
                  <Td className="py-3 px-4">
                    <Badge>{n.status}</Badge>
                  </Td>
                  <Td className="py-3 px-4 whitespace-nowrap text-right">
                    <button
                      type="button"
                      onClick={async () => {
                        await removeNoticeAsync(n.id);
                        toast("Matter deleted.");
                      }}
                      className="inline-flex items-center justify-center rounded p-1.5 text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors"
                      title="Delete matter"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        ) : (
          <EmptyState
            title="No matters tracked"
            hint="Add a notice to track its deadlines and hearings."
            action={
              <Button variant="primary" onClick={() => setPage("Add notice matter")}>
                + Add matter
              </Button>
            }
          />
        )}
      </Card>
    </>
  );
}
