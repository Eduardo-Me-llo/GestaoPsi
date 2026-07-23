import { useState, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RodaViaMe, FORCAS_ORDENADAS, VIRTUDES } from "@/components/RodaViaMe";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, Download, RotateCcw, History } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { format } from "date-fns";

interface Props {
  clientId: string;
}

type HistoryEntry = {
  id: string;
  taken_at: string;
  scores: Record<string, number>;
  notes: string | null;
};

export function RodaViaEditor({ clientId }: Props) {
  const qc = useQueryClient();
  const captureRef = useRef<HTMLDivElement>(null);
  const [valores, setValores] = useState<number[]>(Array(24).fill(5));
  const [notes, setNotes] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  // Carregar último registro
  const { data: latest } = useQuery({
    queryKey: ["wheel-latest", clientId, "via-me"],
    queryFn: async () => {
      const { data } = await supabase
        .from("wheel_entries")
        .select("*")
        .eq("client_id", clientId)
        .eq("wheel_type", "via-me")
        .order("taken_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (data?.scores) {
        // Converter objeto scores para array de 24 valores
        const scoresObj = data.scores as Record<string, number>;
        const valoresArray = FORCAS_ORDENADAS.map((forca, i) => 
          scoresObj[`forca_${i}`] ?? 5
        );
        setValores(valoresArray);
        setNotes(data.notes ?? "");
      }
      return data;
    },
  });

  // Carregar histórico
  const { data: history = [] } = useQuery<HistoryEntry[]>({
    queryKey: ["wheel-history", clientId, "via-me"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wheel_entries")
        .select("id, taken_at, scores, notes")
        .eq("client_id", clientId)
        .eq("wheel_type", "via-me")
        .order("taken_at", { ascending: false });
      
      if (error) throw error;
      return data as HistoryEntry[];
    },
    enabled: showHistory,
  });

  // Salvar registro
  const save = useMutation({
    mutationFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Sessão expirada");

      // Converter array de valores para objeto indexado
      const scores = Object.fromEntries(
        valores.map((valor, i) => [`forca_${i}`, valor])
      );

      const { error } = await supabase.from("wheel_entries").insert({
        user_id: u.user.id,
        client_id: clientId,
        wheel_type: "via-me",
        scores,
        notes: notes || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Roda VIA ME salva!");
      qc.invalidateQueries({ queryKey: ["wheel-latest", clientId, "via-me"] });
      qc.invalidateQueries({ queryKey: ["wheel-history", clientId, "via-me"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  // Exportar PDF
  const exportPDF = async () => {
    if (!captureRef.current) return;
    
    toast.loading("Gerando PDF...");
    
    try {
      const canvas = await html2canvas(captureRef.current, { 
        backgroundColor: "#ffffff", 
        scale: 2 
      });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const w = pdf.internal.pageSize.getWidth();
      const h = (canvas.height * w) / canvas.width;
      
      pdf.setFontSize(16);
      pdf.text("Roda da Vida VIA ME — 24 Forças de Caráter", 40, 40);
      pdf.addImage(img, "PNG", 20, 60, w - 40, h - 40);
      pdf.save(`roda-via-me-${format(new Date(), "yyyy-MM-dd")}.pdf`);
      
      toast.dismiss();
      toast.success("PDF gerado com sucesso!");
    } catch (e) {
      toast.dismiss();
      toast.error("Erro ao gerar PDF");
    }
  };

  // Resetar valores
  const reset = () => setValores(Array(24).fill(5));

  // Carregar registro do histórico
  const loadFromHistory = (entry: HistoryEntry) => {
    const scoresObj = entry.scores as Record<string, number>;
    const valoresArray = FORCAS_ORDENADAS.map((_, i) => 
      scoresObj[`forca_${i}`] ?? 5
    );
    setValores(valoresArray);
    setNotes(entry.notes ?? "");
    setShowHistory(false);
    toast.success("Registro carregado");
  };

  // Calcular média geral
  const avg = (valores.reduce((s, v) => s + v, 0) / 24).toFixed(1);

  // Calcular média por virtude
  const mediasPorVirtude = VIRTUDES.map((virtude, vIdx) => {
    const indiceForcaInicial = VIRTUDES.slice(0, vIdx).reduce(
      (acc, v) => acc + v.forcas.length,
      0
    );
    const valoresDaVirtude = valores.slice(
      indiceForcaInicial,
      indiceForcaInicial + virtude.forcas.length
    );
    const media = (
      valoresDaVirtude.reduce((s, v) => s + v, 0) / virtude.forcas.length
    ).toFixed(1);
    return { nome: virtude.nome, media, cor: virtude.cor };
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Visualização da Roda */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="font-display text-xl">
              Roda da Vida VIA ME — 24 Forças de Caráter
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              Média: <span className="font-bold text-foreground">{avg}/10</span>
            </div>
          </CardHeader>
          <CardContent>
            <div ref={captureRef} className="bg-background p-6 rounded-lg flex justify-center">
              <RodaViaMe valores={valores} tamanho={700} />
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">
              Use os controles à direita para ajustar cada força de caráter (1 a 10).
            </p>
          </CardContent>
        </Card>

        {/* Controles e Inputs */}
        <div className="space-y-4">
          {/* Médias por Virtude */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-display">Médias por Virtude</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {mediasPorVirtude.map((v) => (
                <div key={v.nome} className="flex items-center justify-between gap-2 text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: v.cor }}
                    />
                    <span className="truncate text-xs">{v.nome}</span>
                  </div>
                  <span className="font-semibold">{v.media}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Edição de Forças */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-display">24 Forças de Caráter</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[320px] pr-3">
                <div className="space-y-3">
                  {FORCAS_ORDENADAS.map((forca, i) => {
                    // Encontrar virtude correspondente
                    let virtude = VIRTUDES[0];
                    let acumulado = 0;
                    for (const v of VIRTUDES) {
                      if (i < acumulado + v.forcas.length) {
                        virtude = v;
                        break;
                      }
                      acumulado += v.forcas.length;
                    }

                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between gap-2 text-sm pb-2 border-b last:border-0"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span
                            className="h-2.5 w-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: virtude.cor }}
                          />
                          <span className="truncate text-xs">{forca}</span>
                        </div>
                        <input
                          type="number"
                          min={1}
                          max={10}
                          value={valores[i]}
                          onChange={(e) => {
                            const novoValor = Math.max(
                              1,
                              Math.min(10, Number(e.target.value))
                            );
                            setValores((prev) => {
                              const novos = [...prev];
                              novos[i] = novoValor;
                              return novos;
                            });
                          }}
                          className="w-14 rounded border px-2 py-1 text-right text-xs"
                        />
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Anotações */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-display">Anotações</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observações sobre esta avaliação..."
              />
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex flex-col gap-2">
            <Button onClick={() => save.mutate()} disabled={save.isPending}>
              <Save className="h-4 w-4 mr-2" />
              Salvar registro
            </Button>
            <Button variant="outline" onClick={exportPDF}>
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
            <Button variant="outline" onClick={() => setShowHistory(!showHistory)}>
              <History className="h-4 w-4 mr-2" />
              {showHistory ? "Ocultar histórico" : "Ver histórico"}
            </Button>
            <Button variant="ghost" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Zerar valores
            </Button>
          </div>

          {latest && (
            <p className="text-xs text-muted-foreground text-center">
              Última aplicação: {format(new Date(latest.taken_at), "dd/MM/yyyy 'às' HH:mm")}
            </p>
          )}
        </div>
      </div>

      {/* Histórico */}
      {showHistory && (
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Histórico de Avaliações</CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma avaliação registrada ainda.
              </p>
            ) : (
              <div className="space-y-2">
                {history.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">
                        {format(new Date(entry.taken_at), "dd/MM/yyyy 'às' HH:mm")}
                      </p>
                      {entry.notes && (
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {entry.notes}
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => loadFromHistory(entry)}
                    >
                      Carregar
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
