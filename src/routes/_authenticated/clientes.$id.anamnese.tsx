import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/clientes/$id/anamnese")({
  component: AnamnesePage,
});

type TemplateKey = "adulto" | "adolescente" | "infantil";

type Section = { key: string; label: string; placeholder?: string };

const TEMPLATES: Record<TemplateKey, { label: string; sections: Section[] }> = {
  adulto: {
    label: "Adulto",
    sections: [
      { key: "queixa", label: "Queixa principal / demanda", placeholder: "O que traz o cliente à terapia?" },
      { key: "historia_atual", label: "História da queixa atual" },
      { key: "historia_pessoal", label: "História pessoal e desenvolvimento" },
      { key: "familiar", label: "Contexto familiar e relacional" },
      { key: "profissional", label: "Vida profissional / acadêmica" },
      { key: "saude", label: "Saúde física e mental (medicamentos, diagnósticos)" },
      { key: "habitos", label: "Hábitos (sono, alimentação, exercícios, substâncias)" },
      { key: "objetivos", label: "Expectativas e objetivos com a terapia" },
      { key: "observacoes", label: "Observações do psicólogo" },
    ],
  },
  adolescente: {
    label: "Adolescente",
    sections: [
      { key: "queixa", label: "Queixa / motivo da procura" },
      { key: "familiar", label: "Composição e dinâmica familiar" },
      { key: "escola", label: "Vida escolar (desempenho, relação com colegas)" },
      { key: "social", label: "Amigos, lazer e redes sociais" },
      { key: "desenvolvimento", label: "Desenvolvimento (gestação, marcos, saúde)" },
      { key: "saude_mental", label: "Saúde mental e emocional" },
      { key: "riscos", label: "Fatores de risco (autolesão, uso de substâncias)" },
      { key: "objetivos", label: "Expectativas do adolescente / responsáveis" },
      { key: "observacoes", label: "Observações do psicólogo" },
    ],
  },
  infantil: {
    label: "Infantil",
    sections: [
      { key: "queixa", label: "Queixa dos responsáveis" },
      { key: "gestacao", label: "Gestação e nascimento" },
      { key: "desenvolvimento", label: "Marcos de desenvolvimento (motor, fala, sono, controle esfíncter)" },
      { key: "familiar", label: "Contexto familiar" },
      { key: "escola", label: "Vida escolar e socialização" },
      { key: "comportamento", label: "Comportamento em casa e fora" },
      { key: "saude", label: "Saúde física, alergias, medicações" },
      { key: "observacoes", label: "Observações do psicólogo" },
    ],
  },
};

function AnamnesePage() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const [template, setTemplate] = useState<TemplateKey>("adulto");
  const [values, setValues] = useState<Record<string, string>>({});

  const { data: entry, isLoading } = useQuery({
    queryKey: ["anamnesis", id, template],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("anamnesis")
        .select("*")
        .eq("client_id", id)
        .eq("template_key", template)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    setValues((entry?.data as Record<string, string> | null) ?? {});
  }, [entry, template]);

  const save = useMutation({
    mutationFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Sessão expirada");
      const { error } = await supabase
        .from("anamnesis")
        .upsert(
          {
            user_id: userData.user.id,
            client_id: id,
            template_key: template,
            data: values,
            filled_at: new Date().toISOString(),
          },
          { onConflict: "client_id,template_key" },
        );
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Anamnese salva");
      qc.invalidateQueries({ queryKey: ["anamnesis", id] });
    },
    onError: (e: any) => toast.error(e.message ?? "Erro ao salvar"),
  });

  const sections = TEMPLATES[template].sections;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle className="font-display text-lg">Anamnese</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {entry?.filled_at
                ? `Última atualização em ${new Date(entry.updated_at).toLocaleString("pt-BR")}`
                : "Nenhuma anamnese preenchida ainda."}
            </p>
          </div>
          <div className="w-48">
            <Select value={template} onValueChange={(v) => setTemplate(v as TemplateKey)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(TEMPLATES) as TemplateKey[]).map((k) => (
                  <SelectItem key={k} value={k}>{TEMPLATES[k].label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
      >
        {sections.map((s) => (
          <Card key={s.key}>
            <CardContent className="pt-6 space-y-2">
              <Label className="font-medium">{s.label}</Label>
              <Textarea
                rows={4}
                placeholder={s.placeholder}
                value={values[s.key] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [s.key]: e.target.value }))}
              />
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-end gap-2 sticky bottom-4">
          <Button type="submit" disabled={save.isPending || isLoading}>
            {save.isPending ? "Salvando..." : "Salvar anamnese"}
          </Button>
        </div>
      </form>
    </div>
  );
}
