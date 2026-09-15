import { useState } from "react";
import { useStore } from "../store";
import { InviteModal } from "../modals";
import { Button, Card, CardTitle, PageHeader, Td, TableWrap, Th, EmptyState } from "../ui";

export default function Team() {
  const { team, invitations, setInvitations, toast } = useStore();
  const [open, setOpen] = useState(false);

  return (
    <>
      <PageHeader
        title="Team"
        subtitle="Who can work in Sthambhalliance."
        actions={
          <Button variant="primary" onClick={() => setOpen(true)}>
            Invite someone
          </Button>
        }
      />

      <Card className="mb-4">
        <CardTitle>People ({team.length})</CardTitle>
        <TableWrap>
          <thead>
            <tr>
              <Th>Person</Th>
              <Th>Role</Th>
              <Th>Joined</Th>
            </tr>
          </thead>
          <tbody>
            {team.map((p) => (
              <tr key={p.id}>
                <Td className="font-medium text-foreground">{p.name}</Td>
                <Td className="text-muted-foreground">{p.role}</Td>
                <Td className="text-muted-foreground">{p.joined}</Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </Card>

      <Card>
        <CardTitle>Pending invitations ({invitations.length})</CardTitle>
        {invitations.length ? (
          <TableWrap>
            <thead>
              <tr>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Expires</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {invitations.map((i) => (
                <tr key={i.id}>
                  <Td className="text-foreground">{i.email}</Td>
                  <Td className="text-muted-foreground">{i.role}</Td>
                  <Td className="whitespace-nowrap text-muted-foreground">{i.expires}</Td>
                  <Td className="whitespace-nowrap text-right">
                    <Button size="sm" onClick={() => toast("Invitation link copied.")}>
                      Copy invitation
                    </Button>{" "}
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        setInvitations((is) => is.filter((x) => x.id !== i.id));
                        toast("Invitation cancelled.");
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
          <EmptyState title="No pending invitations" hint="Invite someone to join the firm." />
        )}
      </Card>

      <InviteModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
