import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { purchasesStore } from "@/lib/storage";
import type { Purchase } from "../../../shared/api";
import { ArrowLeft, Eye, RefreshCcw, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserTrips() {
  const nav = useNavigate();
  const [items, setItems] = useState<Purchase[]>([]);

  const refresh = () => setItems(purchasesStore.list());

  useEffect(() => { refresh(); }, []);

  const updateStatus = (id: string, status: Purchase['status']) => {
    const found = purchasesStore.list().find((p) => p.id === id);
    if (!found) return;
    purchasesStore.upsert({ ...found, status });
    refresh();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="border-b border-slate-800 sticky top-0 z-10 bg-slate-900/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => nav(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <h1 className="text-xl font-bold">My Trips</h1>
          <div className="ml-auto">
            <Button variant="outline" size="sm" onClick={refresh}>
              <RefreshCcw className="w-4 h-4 mr-2" /> Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 grid grid-cols-1 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Purchased Trips</CardTitle>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <div className="text-sm text-slate-400">No purchases yet. Complete a checkout to see your trips here.</div>
            ) : (
              <Table>
                <TableCaption>Your recent purchases</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trip</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Zone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium flex items-center gap-3">
                        <img src={p.image} alt={p.title} className="w-12 h-12 rounded object-cover" />
                        <div>
                          <div>{p.title}</div>
                          <div className="text-xs text-slate-400">{p.location}</div>
                        </div>
                      </TableCell>
                      <TableCell>{p.date}</TableCell>
                      <TableCell>{p.quantity}</TableCell>
                      <TableCell>{p.zone}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{p.status}</Badge>
                      </TableCell>
                      <TableCell>${p.total.toFixed(2)}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button size="sm" variant="outline"><Eye className="w-4 h-4 mr-1" /> Details</Button>
                        {p.status !== 'cancelled' && p.status !== 'refunded' && (
                          <Button size="sm" variant="destructive" onClick={() => updateStatus(p.id, 'cancelled')}>
                            <XCircle className="w-4 h-4 mr-1" /> Cancel
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
