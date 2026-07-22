import { useState, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { WheelOfLifeSVG, type WheelAxis } from "@/components/wheel/WheelOfLifeSVG";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save, Download, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Props {
  clientId: string;
  wheelType: "adulto" | "adolescente";
  axes: WheelAxis[];
  title: string;
}

export function WheelEditor({ clientId, wheelType, axes, title }: Props) {
  const qc = useQueryClient();
  const captureRef = useRef<HTMLDivElement>(null);
  const initial = Object.fromEntries(axes.map((a) => [a.key, 0]));
  const [values, setValues] = useState<Record<string, number>>(initial);
  const [notes, setNotes] = useState("");

  const { data: latest } = useQuery({
    queryKey: ["wheel-latest", clientId, wheelType],
    queryFn: async () => {
      const { data } = await supabase
        .from("wheel_entries")
        .select("*")
        .eq("client_id", clientId)
        .eq("wheel_type", wheelType)
        .order("taken_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (data) {
        setValues({ ...initial, ...(data.scores as Record<string, number>) });
        setNotes(data.notes ?? "");
      }
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Sessão expirada");
      const { error } = await supabase.from("wheel_entries").insert({
        user_id: u.user.id,
        client_id: clientId,
        wheel_type: wheelType,
        scores: values,
        notes: notes || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Roda salva!");
      qc.invalidateQueries({ queryKey: ["wheel-latest", clientId, wheelType] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const exportPDF = async () => {
    if (!captureRef.current) return;
    const canvas = await html2canvas(captureRef.current, { backgroundColor: "#ffffff", scale: 2 });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const w = pdf.internal.pageSize.getWidth();
    const h = (canvas.height * w) / canvas.width;
    pdf.setFontSize(16);
    pdf.text(title, 40, 40);
    pdf.addImage(img, "PNG", 20, 60, w - 40, h - 40);
    pdf.save(`${title.replace(/\s+/g, "-").toLowerCase()}.pdf`);
  };

  const reset = () => setValues(initial);

  const avg = (Object.values(values).reduce((s, v) => s + v, 0) / axes.length).toFixed(1);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="font-display text-xl">{title}</CardTitle>
          <div className="text-sm text-muted-foreground">
            Média: <span className="font-bold text-foreground">{avg}/10</span>
          </div>
        </CardHeader>
        <CardContent>
          <div ref={captureRef} className="bg-background p-4 rounded-lg">
            <WheelOfLifeSVG
              axes={axes}
              values={values}
              onChange={(k, v) => setValues((prev) => ({ ...prev, [k]: v }))}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Clique nas divisões da roda para definir cada valor (0 a 10).
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader><CardTitle className="text-base font-display">Áreas</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {axes.map((a) => (
              <div key={a.key} className="flex items-center justify-between gap-2 text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="h-3 w-3 rounded-full shrink-0" style={{ background: a.color }} />
                  <span className="truncate">{a.label}</span>
                </div>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={values[a.key]}
                  onChange={(e) => setValues({ ...values, [a.key]: Math.max(0, Math.min(10, Number(e.target.value))) })}
                  className="w-14 rounded border px-2 py-1 text-right"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base font-display">Anotações</CardTitle></CardHeader>
          <CardContent>
            <Textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Observações desta aplicação..." />
          </CardContent>
        </Card>

        <div className="flex flex-col gap-2">
          <Button onClick={() => save.mutate()} disabled={save.isPending}>
            <Save className="h-4 w-4 mr-2" />Salvar registro
          </Button>
          <Button variant="outline" onClick={exportPDF}>
            <Download className="h-4 w-4 mr-2" />Exportar PDF
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="h-4 w-4 mr-2" />Zerar
          </Button>
        </div>

        {latest && (
          <p className="text-xs text-muted-foreground">
            Última aplicação: {new Date(latest.taken_at).toLocaleString("pt-BR")}
          </p>
        )}
      </div>
    </div>
  );
}
