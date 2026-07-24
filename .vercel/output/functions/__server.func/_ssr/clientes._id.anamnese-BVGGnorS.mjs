import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-DJK_yZo7.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-DCDRzI6q.mjs";
import { B as Button } from "./button-DA2gxxPy.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { T as Textarea } from "./textarea-DSyJ1nlY.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CZRUt5a6.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { f as Route } from "./router-C0lyWhsY.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/lucide-react.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/zod.mjs";
const TEMPLATES = {
  adulto: {
    label: "Adulto",
    sections: [{
      key: "queixa",
      label: "Queixa principal / demanda",
      placeholder: "O que traz o cliente à terapia?"
    }, {
      key: "historia_atual",
      label: "História da queixa atual"
    }, {
      key: "historia_pessoal",
      label: "História pessoal e desenvolvimento"
    }, {
      key: "familiar",
      label: "Contexto familiar e relacional"
    }, {
      key: "profissional",
      label: "Vida profissional / acadêmica"
    }, {
      key: "saude",
      label: "Saúde física e mental (medicamentos, diagnósticos)"
    }, {
      key: "habitos",
      label: "Hábitos (sono, alimentação, exercícios, substâncias)"
    }, {
      key: "objetivos",
      label: "Expectativas e objetivos com a terapia"
    }, {
      key: "observacoes",
      label: "Observações do psicólogo"
    }]
  },
  adolescente: {
    label: "Adolescente",
    sections: [{
      key: "queixa",
      label: "Queixa / motivo da procura"
    }, {
      key: "familiar",
      label: "Composição e dinâmica familiar"
    }, {
      key: "escola",
      label: "Vida escolar (desempenho, relação com colegas)"
    }, {
      key: "social",
      label: "Amigos, lazer e redes sociais"
    }, {
      key: "desenvolvimento",
      label: "Desenvolvimento (gestação, marcos, saúde)"
    }, {
      key: "saude_mental",
      label: "Saúde mental e emocional"
    }, {
      key: "riscos",
      label: "Fatores de risco (autolesão, uso de substâncias)"
    }, {
      key: "objetivos",
      label: "Expectativas do adolescente / responsáveis"
    }, {
      key: "observacoes",
      label: "Observações do psicólogo"
    }]
  },
  infantil: {
    label: "Infantil",
    sections: [{
      key: "queixa",
      label: "Queixa dos responsáveis"
    }, {
      key: "gestacao",
      label: "Gestação e nascimento"
    }, {
      key: "desenvolvimento",
      label: "Marcos de desenvolvimento (motor, fala, sono, controle esfíncter)"
    }, {
      key: "familiar",
      label: "Contexto familiar"
    }, {
      key: "escola",
      label: "Vida escolar e socialização"
    }, {
      key: "comportamento",
      label: "Comportamento em casa e fora"
    }, {
      key: "saude",
      label: "Saúde física, alergias, medicações"
    }, {
      key: "observacoes",
      label: "Observações do psicólogo"
    }]
  }
};
function AnamnesePage() {
  const {
    id
  } = Route.useParams();
  const qc = useQueryClient();
  const [template, setTemplate] = reactExports.useState("adulto");
  const [values, setValues] = reactExports.useState({});
  const {
    data: entry,
    isLoading
  } = useQuery({
    queryKey: ["anamnesis", id, template],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("anamnesis").select("*").eq("client_id", id).eq("template_key", template).maybeSingle();
      if (error) throw error;
      return data;
    }
  });
  reactExports.useEffect(() => {
    setValues(entry?.data ?? {});
  }, [entry, template]);
  const save = useMutation({
    mutationFn: async () => {
      const {
        data: userData
      } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Sessão expirada");
      const {
        error
      } = await supabase.from("anamnesis").upsert({
        user_id: userData.user.id,
        client_id: id,
        template_key: template,
        data: values,
        filled_at: (/* @__PURE__ */ new Date()).toISOString()
      }, {
        onConflict: "client_id,template_key"
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Anamnese salva");
      qc.invalidateQueries({
        queryKey: ["anamnesis", id]
      });
    },
    onError: (e) => toast.error(e.message ?? "Erro ao salvar")
  });
  const sections = TEMPLATES[template].sections;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-lg", children: "Anamnese" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: entry?.filled_at ? `Última atualização em ${new Date(entry.updated_at).toLocaleString("pt-BR")}` : "Nenhuma anamnese preenchida ainda." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-48", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: template, onValueChange: (v) => setTemplate(v), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: Object.keys(TEMPLATES).map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: k, children: TEMPLATES[k].label }, k)) })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "space-y-4", onSubmit: (e) => {
      e.preventDefault();
      save.mutate();
    }, children: [
      sections.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-6 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-medium", children: s.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 4, placeholder: s.placeholder, value: values[s.key] ?? "", onChange: (e) => setValues((v) => ({
          ...v,
          [s.key]: e.target.value
        })) })
      ] }) }, s.key)),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end gap-2 sticky bottom-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: save.isPending || isLoading, children: save.isPending ? "Salvando..." : "Salvar anamnese" }) })
    ] })
  ] });
}
export {
  AnamnesePage as component
};
