"use client";

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
  const { notices, setNotices, setPage, toast } = useStore();
  const openAmount = notices.reduce((s, n) => s + (n.amount ?? 0), 0);

  return (
    <>
      <PageHeader
        title="Notice Tracker"
        subtitle={`${formatINR(openAmount)} in open matters.`}
        actions={
          <>
            <Button onClick={() => setPage("Draft a client email")}>Draft a reply</Button>
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
              <tr>
                <Th>Notice</Th>
                <Th>Client</Th>
                <Th>Drafted</Th>
                <Th>Status</Th>
                <Th className="text-right">Delete</Th>
              </tr>
            </thead>
            <tbody>
              {notices.map((n) => (
                <tr key={n.id}>
                  <Td>
                    <div className="font-medium text-foreground">{n.title}</div>
                    <div className="text-[12px] text-muted-foreground">{n.noticeType}</div>
                  </Td>
                  <Td className="text-muted-foreground">{n.client}</Td>
                  <Td className="whitespace-nowrap text-muted-foreground">{n.drafted}</Td>
                  <Td>
                    <Badge>{n.status}</Badge>
                  </Td>
                  <Td className="text-right">
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        setNotices((ns) => ns.filter((x) => x.id !== n.id));
                        toast("Matter deleted.");
                      }}
                    >
                      Delete
                    </Button>
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
