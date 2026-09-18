"use client";

import { useState } from "react";
import { useStore } from "../store";
import { InviteModal } from "../modals";
import { Button, Card, CardTitle, PageHeader, Td, TableWrap, Th, EmptyState } from "../ui";
import { UserPlus, Copy, X } from "lucide-react";

export default function Team() {
  const { team, invitations, setInvitations, toast } = useStore();
  const [open, setOpen] = useState(false);

  const displayTeam =
    team.length > 0
      ? team
      : [
          {
            id: "tm1",
            name: "Santosh Kumar",
            email: "santosh@caconnect.in",
            role: "Owner",
            joined: "05 Sept 2026",
          },
        ];

  return (
    <>
      <PageHeader
        title="Team"
        subtitle="Who can work in Sthambhalliances."
        actions={
          <Button
            variant="primary"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1.5"
          >
            <UserPlus className="h-4 w-4" />
            Invite someone
          </Button>
        }
      />

      <Card className="mb-6">
        <CardTitle>People ({displayTeam.length})</CardTitle>
        <TableWrap>
          <thead>
            <tr>
              <Th>Person</Th>
              <Th>Role</Th>
              <Th>Joined</Th>
            </tr>
          </thead>
          <tbody>
            {displayTeam.map((p, idx) => (
              <tr key={p.id || idx}>
                <Td>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{p.name}</span>
                    {idx === 0 && (
                      <span className="text-xs text-muted-foreground font-normal">you</span>
                    )}
                  </div>
                  {p.email && (
                    <div className="text-xs text-muted-foreground mt-0.5">{p.email}</div>
                  )}
                </Td>
                <Td>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-foreground border border-border">
                    {p.role || "Owner"}
                  </span>
                </Td>
                <Td className="text-muted-foreground">{p.joined || "05 Sept 2026"}</Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </Card>

      <Card>
        <CardTitle>Pending invitations ({invitations.length})</CardTitle>
        {invitations.length > 0 ? (
          <TableWrap>
            <thead>
              <tr>
                <Th>Email</Th>
                <Th>Expires</Th>
                <Th className="w-20 text-right"></Th>
              </tr>
            </thead>
            <tbody>
              {invitations.map((i) => (
                <tr key={i.id}>
                  <Td className="text-foreground">{i.email}</Td>
                  <Td className="whitespace-nowrap text-muted-foreground">{i.expires}</Td>
                  <Td className="whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(i.email);
                          }
                          toast("Invitation link copied.");
                        }}
                        title="Copy invitation link"
                        className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors inline-flex items-center justify-center"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setInvitations((is) => is.filter((x) => x.id !== i.id));
                          toast("Invitation cancelled.");
                        }}
                        title="Cancel invitation"
                        className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-secondary rounded transition-colors inline-flex items-center justify-center"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        ) : (
          <EmptyState title="No pending invitations" hint="Invite someone to join the firm." />
        )}
      </Card>

      <InviteModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
