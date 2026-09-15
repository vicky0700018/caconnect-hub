import { useState } from "react";
import { useStore } from "../store";
import { RequestDocsModal } from "../modals";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  PageHeader,
  Tabs,
  Td,
  TableWrap,
  Th,
} from "../ui";

const files = [
  {
    id: "fl1",
    name: "PAN of directors.pdf",
    client: "Tushar Kumar",
    request: "Company Registration",
    uploaded: "12 Sept 2026",
  },
];

export default function Documents() {
  const { docRequests, setDocRequests, toast } = useStore();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("Requests");

  const awaiting = docRequests.filter((r) => r.status === "Open").length;

  return (
    <>
      <PageHeader
        title="Documents"
        subtitle={`${awaiting} links awaiting upload`}
        actions={
          <Button variant="primary" onClick={() => setOpen(true)}>
            + Request documents
          </Button>
        }
      />

      <Tabs
        tabs={[`Requests (${docRequests.length})`, `Files (${files.length})`]}
        active={tab.startsWith("Requests") ? `Requests (${docRequests.length})` : `Files (${files.length})`}
        onChange={(t) => setTab(t.startsWith("Requests") ? "Requests" : "Files")}
      />

      <Card className="mt-4">
        {tab === "Requests" ? (
          docRequests.length ? (
            <TableWrap>
              <thead>
                <tr>
                  <Th>Request</Th>
                  <Th>Client</Th>
                  <Th>Received</Th>
                  <Th>Expires</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {docRequests.map((r) => (
                  <tr key={r.id}>
                    <Td className="font-medium text-foreground">{r.title}</Td>
                    <Td className="text-muted-foreground">{r.client}</Td>
                    <Td className="text-muted-foreground">{r.received}</Td>
                    <Td className="whitespace-nowrap text-muted-foreground">{r.expires}</Td>
                    <Td>
                      <Badge>{r.status}</Badge>
                    </Td>
                    <Td className="whitespace-nowrap text-right">
                      <Button
                        size="sm"
                        onClick={() => toast(`Upload link for ${r.client} copied.`)}
                      >
                        Share
                      </Button>{" "}
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => {
                          setDocRequests((rs) => rs.filter((x) => x.id !== r.id));
                          toast("Request cancelled.");
                        }}
                      >
                        Cancel
                      </Button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          ) : (
            <EmptyState title="No requests yet" hint="Create a link your client can upload from." />
          )
        ) : (
          <TableWrap>
            <thead>
              <tr>
                <Th>File</Th>
                <Th>Client</Th>
                <Th>Request</Th>
                <Th>Uploaded</Th>
              </tr>
            </thead>
            <tbody>
              {files.map((f) => (
                <tr key={f.id}>
                  <Td className="font-medium text-foreground">{f.name}</Td>
                  <Td className="text-muted-foreground">{f.client}</Td>
                  <Td className="text-muted-foreground">{f.request}</Td>
                  <Td className="text-muted-foreground">{f.uploaded}</Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        )}
      </Card>

      <RequestDocsModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
