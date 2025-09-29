import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { tripsStore } from "@/lib/storage";
import type { Trip } from "../../types";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";

const emptyTrip = (): Trip => ({
  id: crypto.randomUUID(),
  title: "",
  category: "",
  date: "",
  location: "",
  price: "From $0",
  image: "",
  rating: 4.5,
  soldOut: false,
  trending: false,
  includesTransportation: false,
  isPresale: false,
  requiresTicketAcquisition: false,
  refundableIfNoTicket: false,
  paymentOptions: {
    installmentsAvailable: true,
    presaleDepositAvailable: false,
    secondPaymentInstallmentsAvailable: false,
  },
  gifts: [],
  acceptsUnderAge: true,
  jerseyAddonAvailable: false,
  jerseyPrice: 120,
});

export default function AdminTrips() {
  const nav = useNavigate();
  const [items, setItems] = useState<Trip[]>([]);
  const [form, setForm] = useState<Trip>(emptyTrip());
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setItems(tripsStore.list());
  }, []);

  const onSave = () => {
    tripsStore.upsert(form);
    setItems(tripsStore.list());
    setForm(emptyTrip());
    setEditingId(null);
  };

  const onEdit = (t: Trip) => {
    setForm({ ...t });
    setEditingId(t.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = (id: string) => {
    tripsStore.remove(id);
    setItems(tripsStore.list());
    if (editingId === id) {
      setForm(emptyTrip());
      setEditingId(null);
    }
  };

  const set = <K extends keyof Trip>(key: K, val: Trip[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="border-b border-slate-800 sticky top-0 z-10 bg-slate-900/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => nav(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <h1 className="text-xl font-bold">Admin • Trips</h1>
          <div className="ml-auto flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setForm(emptyTrip())}
            >
              <Plus className="w-4 h-4 mr-2" /> New Trip
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Trip" : "Add Trip"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Category</Label>
              <Input
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Date</Label>
                <Input
                  value={form.date}
                  onChange={(e) => set("date", e.target.value)}
                  placeholder="Jan 1, 2025"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Display Price</Label>
                <Input
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  placeholder="From $199"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Image URL</Label>
                <Input
                  value={form.image}
                  onChange={(e) => set("image", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between py-1">
                <Label>Sold Out</Label>
                <Switch
                  checked={form.soldOut}
                  onCheckedChange={(v) => set("soldOut", Boolean(v))}
                />
              </div>
              <div className="flex items-center justify-between py-1">
                <Label>Trending</Label>
                <Switch
                  checked={form.trending}
                  onCheckedChange={(v) => set("trending", Boolean(v))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between py-1">
                <Label>Transportation</Label>
                <Switch
                  checked={form.includesTransportation}
                  onCheckedChange={(v) =>
                    set("includesTransportation", Boolean(v))
                  }
                />
              </div>
              <div className="flex items-center justify-between py-1">
                <Label>Pre-sale</Label>
                <Switch
                  checked={form.isPresale}
                  onCheckedChange={(v) => set("isPresale", Boolean(v))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between py-1">
                <Label>Ticket Allocation</Label>
                <Switch
                  checked={form.requiresTicketAcquisition}
                  onCheckedChange={(v) =>
                    set("requiresTicketAcquisition", Boolean(v))
                  }
                />
              </div>
              <div className="flex items-center justify-between py-1">
                <Label>Refundable if not allocated</Label>
                <Switch
                  checked={form.refundableIfNoTicket}
                  onCheckedChange={(v) =>
                    set("refundableIfNoTicket", Boolean(v))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between py-1">
                <Label>Installments</Label>
                <Switch
                  checked={form.paymentOptions.installmentsAvailable}
                  onCheckedChange={(v) =>
                    set("paymentOptions", {
                      ...form.paymentOptions,
                      installmentsAvailable: Boolean(v),
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between py-1">
                <Label>Reserve with deposit</Label>
                <Switch
                  checked={form.paymentOptions.presaleDepositAvailable}
                  onCheckedChange={(v) =>
                    set("paymentOptions", {
                      ...form.paymentOptions,
                      presaleDepositAvailable: Boolean(v),
                    })
                  }
                />
              </div>
            </div>
            <div className="flex items-center justify-between py-1">
              <Label>Second payment in installments</Label>
              <Switch
                checked={form.paymentOptions.secondPaymentInstallmentsAvailable}
                onCheckedChange={(v) =>
                  set("paymentOptions", {
                    ...form.paymentOptions,
                    secondPaymentInstallmentsAvailable: Boolean(v),
                  })
                }
              />
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between py-1">
                <Label>Under-age Allowed</Label>
                <Switch
                  checked={form.acceptsUnderAge}
                  onCheckedChange={(v) => set("acceptsUnderAge", Boolean(v))}
                />
              </div>
              <div className="flex items-center justify-between py-1">
                <Label>Jersey Add-on</Label>
                <Switch
                  checked={!!form.jerseyAddonAvailable}
                  onCheckedChange={(v) =>
                    set("jerseyAddonAvailable", Boolean(v))
                  }
                />
              </div>
            </div>
            <div>
              <Label>Jersey Price</Label>
              <Input
                type="number"
                value={Number(form.jerseyPrice ?? 120)}
                onChange={(e) => set("jerseyPrice", Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div className="pt-2 flex gap-2">
              <Button
                onClick={onSave}
                className="bg-brand-blue hover:bg-brand-cyan"
              >
                <Save className="w-4 h-4 mr-2" />{" "}
                {editingId ? "Update" : "Add Trip"}
              </Button>
              {editingId && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setForm(emptyTrip());
                    setEditingId(null);
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Trips</CardTitle>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <div className="text-sm text-slate-400">
                No trips yet. Use the form to add your first trip.
              </div>
            ) : (
              <Table>
                <TableCaption>Manage your trips</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Flags</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.title}</TableCell>
                      <TableCell>{t.category}</TableCell>
                      <TableCell>{t.date}</TableCell>
                      <TableCell>{t.location}</TableCell>
                      <TableCell>{t.price}</TableCell>
                      <TableCell className="space-x-1">
                        {t.trending && (
                          <Badge variant="outline">Trending</Badge>
                        )}
                        {t.includesTransportation && (
                          <Badge variant="outline">Transport</Badge>
                        )}
                        {t.isPresale && (
                          <Badge variant="outline">Pre-sale</Badge>
                        )}
                        {t.jerseyAddonAvailable && (
                          <Badge variant="outline">Jersey</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEdit(t)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onDelete(t.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </Button>
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
