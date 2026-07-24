import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-DJK_yZo7.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-DCDRzI6q.mjs";
import { B as Button } from "./button-DA2gxxPy.mjs";
import { T as Textarea } from "./textarea-DSyJ1nlY.mjs";
import { R as Root, V as Viewport, C as Corner, S as ScrollAreaScrollbar, a as ScrollAreaThumb } from "../_libs/radix-ui__react-scroll-area.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { j as jsPDF } from "../_libs/jspdf.mjs";
import { h as html2canvas } from "../_libs/html2canvas.mjs";
import { b as Route$4 } from "./router-C0lyWhsY.mjs";
import { Y as Save, a2 as Download, a3 as History, a4 as RotateCcw } from "../_libs/lucide-react.mjs";
import { f as format } from "../_libs/date-fns.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/tailwind-merge.mjs";
import "fs";
import "path";
import "../_libs/fflate.mjs";
import "../_libs/fast-png.mjs";
import "../_libs/iobuffer.mjs";
import "../_libs/pako.mjs";
import "../_libs/dompurify.mjs";
import "../_libs/canvg.mjs";
import "../_libs/core-js.mjs";
import "../_libs/babel__runtime.mjs";
import "../_libs/raf.mjs";
import "../_libs/performance-now.mjs";
import "../_libs/rgbcolor.mjs";
import "../_libs/svg-pathdata.mjs";
import "../_libs/stackblur-canvas.mjs";
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
const VIRTUDES = [
  {
    nome: "A) SABEDORIA E\nCONHECIMENTO",
    cor: "#A8D5E2",
    // Azul claro/Ciano pastel
    forcas: [
      "CRIATIVIDADE",
      "CURIOSIDADE",
      "PENSAMENTO\nCRÍTICO E CRITÉRIO",
      "AMOR AO\nAPRENDIZADO",
      "PERSPECTIVA"
    ]
  },
  {
    nome: "B) CORAGEM",
    cor: "#FFF4B3",
    // Amarelo/Dourado pastel
    forcas: [
      "HEROÍSMO E\nBRAVURA",
      "PERSEVERANÇA",
      "AUTENTICIDADE E\nHONESTIDADE",
      "VITALIDADE"
    ]
  },
  {
    nome: "C) HUMANIDADE",
    cor: "#FFB3D9",
    // Rosa/Vermelho claro pastel
    forcas: ["AMOR", "GENEROSIDADE", "INTELIGÊNCIA\nSOCIAL"]
  },
  {
    nome: "D) JUSTIÇA",
    cor: "#FFDAB3",
    // Laranja/Pêssego pastel
    forcas: ["TRABALHO EM\nEQUIPE", "LIDERANÇA", "JUSTIÇA/\nEQUIDADE"]
  },
  {
    nome: "E) TEMPERANÇA",
    cor: "#C8E6C9",
    // Verde pastel
    forcas: ["PERDÃO", "HUMILDADE", "PRUDÊNCIA", "AUTOCONTROLE"]
  },
  {
    nome: "F) TRANSCENDÊNCIA",
    cor: "#DCC6E0",
    // Roxo/Lilás pastel
    forcas: [
      "APRECIAÇÃO\nDA BELEZA",
      "GRATIDÃO",
      "ESPERANÇA",
      "HUMOR",
      "ESPIRITUALIDADE"
    ]
  }
];
const FORCAS_ORDENADAS = VIRTUDES.flatMap((v) => v.forcas);
function RodaViaMe({
  valores = Array(24).fill(5),
  tamanho = 1e3,
  mostrarNumeros = true,
  className = ""
}) {
  const svgRef = reactExports.useRef(null);
  const centerX = tamanho / 2;
  const centerY = tamanho / 2;
  const raioMaximo = tamanho * 0.32;
  const raioMinimo = tamanho * 0.06;
  const raioLabels = raioMaximo + 55;
  const raioVirtudes = raioLabels + 65;
  const grausPerSetor = 360 / 24;
  const anguloInicial = -90;
  const grausParaRad = (graus) => graus * Math.PI / 180;
  const calcularRaio = (nivel) => {
    return raioMinimo + (raioMaximo - raioMinimo) * (nivel - 1) / 9;
  };
  const renderGrades = () => {
    return Array.from({ length: 10 }, (_, i) => {
      const nivel = i + 1;
      const raio = calcularRaio(nivel);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "circle",
        {
          cx: centerX,
          cy: centerY,
          r: raio,
          fill: "none",
          stroke: "#e0e0e0",
          strokeWidth: "1",
          opacity: "0.5"
        },
        `grade-${nivel}`
      );
    });
  };
  const renderLinhasRadiais = () => {
    return Array.from({ length: 24 }, (_, i) => {
      const angulo = anguloInicial + i * grausPerSetor;
      const rad = grausParaRad(angulo);
      const x1 = centerX + raioMinimo * Math.cos(rad);
      const y1 = centerY + raioMinimo * Math.sin(rad);
      const x2 = centerX + raioMaximo * Math.cos(rad);
      const y2 = centerY + raioMaximo * Math.sin(rad);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "line",
        {
          x1,
          y1,
          x2,
          y2,
          stroke: "#e0e0e0",
          strokeWidth: "1",
          opacity: "0.5"
        },
        `linha-${i}`
      );
    });
  };
  const renderNumeros = () => {
    if (!mostrarNumeros) return null;
    const numerosElements = [];
    FORCAS_ORDENADAS.forEach((_, setorIdx) => {
      const angulo = anguloInicial + setorIdx * grausPerSetor + grausPerSetor / 2;
      const rad = grausParaRad(angulo);
      for (let nivel = 1; nivel <= 10; nivel++) {
        const raio = calcularRaio(nivel);
        const x = centerX + raio * Math.cos(rad);
        const y = centerY + raio * Math.sin(rad);
        numerosElements.push(
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "text",
            {
              x,
              y,
              textAnchor: "middle",
              dominantBaseline: "central",
              fontSize: "7",
              fill: "#666",
              opacity: "0.7",
              fontWeight: "500",
              children: nivel
            },
            `num-${setorIdx}-${nivel}`
          )
        );
      }
    });
    return numerosElements;
  };
  const renderPoligonoValores = () => {
    const pontos = valores.map((valor, i) => {
      const angulo = anguloInicial + i * grausPerSetor + grausPerSetor / 2;
      const rad = grausParaRad(angulo);
      const raio = calcularRaio(Math.max(1, Math.min(10, valor)));
      const x = centerX + raio * Math.cos(rad);
      const y = centerY + raio * Math.sin(rad);
      return `${x},${y}`;
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "polygon",
        {
          points: pontos.join(" "),
          fill: "rgba(99, 102, 241, 0.2)",
          stroke: "rgb(99, 102, 241)",
          strokeWidth: "2"
        }
      ),
      valores.map((valor, i) => {
        const angulo = anguloInicial + i * grausPerSetor + grausPerSetor / 2;
        const rad = grausParaRad(angulo);
        const raio = calcularRaio(Math.max(1, Math.min(10, valor)));
        const x = centerX + raio * Math.cos(rad);
        const y = centerY + raio * Math.sin(rad);
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: x,
            cy: y,
            r: "4",
            fill: "rgb(99, 102, 241)",
            stroke: "white",
            strokeWidth: "1.5"
          },
          `ponto-${i}`
        );
      })
    ] });
  };
  const renderNomesForcas = () => {
    return FORCAS_ORDENADAS.map((forca, i) => {
      const angulo = anguloInicial + i * grausPerSetor + grausPerSetor / 2;
      const rad = grausParaRad(angulo);
      const x = centerX + raioLabels * Math.cos(rad);
      const y = centerY + raioLabels * Math.sin(rad);
      let rotacao = angulo + 90;
      if (angulo > 0 && angulo < 180) {
        rotacao += 180;
      }
      const linhas = forca.split("\n");
      return /* @__PURE__ */ jsxRuntimeExports.jsx("g", { transform: `rotate(${rotacao}, ${x}, ${y})`, children: linhas.map((linha, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "text",
        {
          x,
          y: y + (idx - (linhas.length - 1) / 2) * 10,
          textAnchor: "middle",
          dominantBaseline: "central",
          fontSize: "8.5",
          fontWeight: "600",
          fill: "#222",
          children: linha
        },
        idx
      )) }, `forca-${i}`);
    });
  };
  const renderArcosVirtudes = () => {
    let forcasAcumuladas = 0;
    return VIRTUDES.map((virtude, vIdx) => {
      const numForcas = virtude.forcas.length;
      const anguloInicio = anguloInicial + forcasAcumuladas * grausPerSetor;
      const anguloFim = anguloInicio + numForcas * grausPerSetor;
      forcasAcumuladas += numForcas;
      const radInicio = grausParaRad(anguloInicio);
      const radFim = grausParaRad(anguloFim);
      const raioArco = raioVirtudes;
      const espessuraArco = 35;
      const x1Externo = centerX + raioArco * Math.cos(radInicio);
      const y1Externo = centerY + raioArco * Math.sin(radInicio);
      const x2Externo = centerX + raioArco * Math.cos(radFim);
      const y2Externo = centerY + raioArco * Math.sin(radFim);
      const raioInterno = raioArco - espessuraArco;
      const x1Interno = centerX + raioInterno * Math.cos(radInicio);
      const y1Interno = centerY + raioInterno * Math.sin(radInicio);
      const x2Interno = centerX + raioInterno * Math.cos(radFim);
      const y2Interno = centerY + raioInterno * Math.sin(radFim);
      const largeArc = numForcas * grausPerSetor > 180 ? 1 : 0;
      const pathData = `
        M ${x1Externo} ${y1Externo}
        A ${raioArco} ${raioArco} 0 ${largeArc} 1 ${x2Externo} ${y2Externo}
        L ${x2Interno} ${y2Interno}
        A ${raioInterno} ${raioInterno} 0 ${largeArc} 0 ${x1Interno} ${y1Interno}
        Z
      `;
      const anguloMeio = (anguloInicio + anguloFim) / 2;
      const radMeio = grausParaRad(anguloMeio);
      const raioTexto = raioArco - espessuraArco / 2;
      const xTexto = centerX + raioTexto * Math.cos(radMeio);
      const yTexto = centerY + raioTexto * Math.sin(radMeio);
      let rotacaoTexto = anguloMeio + 90;
      if (anguloMeio > 0 && anguloMeio < 180) {
        rotacaoTexto += 180;
      }
      const linhasNome = virtude.nome.split("\n");
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: pathData, fill: virtude.cor, stroke: "white", strokeWidth: "2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("g", { transform: `rotate(${rotacaoTexto}, ${xTexto}, ${yTexto})`, children: linhasNome.map((linha, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "text",
          {
            x: xTexto,
            y: yTexto + (idx - (linhasNome.length - 1) / 2) * 11,
            textAnchor: "middle",
            dominantBaseline: "central",
            fontSize: "10",
            fontWeight: "700",
            fill: "#222",
            children: linha
          },
          idx
        )) })
      ] }, `virtude-${vIdx}`);
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      ref: svgRef,
      width: tamanho,
      height: tamanho,
      viewBox: `0 0 ${tamanho} ${tamanho}`,
      className: `roda-via-me w-full h-auto ${className}`,
      style: { maxWidth: "100%", height: "auto" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: tamanho, height: tamanho, fill: "white" }),
        renderGrades(),
        renderLinhasRadiais(),
        renderArcosVirtudes(),
        renderNomesForcas(),
        renderNumeros(),
        renderPoligonoValores(),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: centerX,
            cy: centerY,
            r: raioMinimo,
            fill: "white",
            stroke: "#ccc",
            strokeWidth: "1"
          }
        )
      ]
    }
  );
}
const ScrollArea = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Root,
  {
    ref,
    className: cn("relative overflow-hidden", className),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Viewport, { className: "h-full w-full rounded-[inherit]", children }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollBar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Corner, {})
    ]
  }
));
ScrollArea.displayName = Root.displayName;
const ScrollBar = reactExports.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  ScrollAreaScrollbar,
  {
    ref,
    orientation,
    className: cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
  }
));
ScrollBar.displayName = ScrollAreaScrollbar.displayName;
function RodaViaEditor({ clientId }) {
  const qc = useQueryClient();
  const captureRef = reactExports.useRef(null);
  const [valores, setValores] = reactExports.useState(Array(24).fill(5));
  const [notes, setNotes] = reactExports.useState("");
  const [showHistory, setShowHistory] = reactExports.useState(false);
  const { data: latest } = useQuery({
    queryKey: ["wheel-latest", clientId, "via-me"],
    queryFn: async () => {
      const { data } = await supabase.from("wheel_entries").select("*").eq("client_id", clientId).eq("wheel_type", "via-me").order("taken_at", { ascending: false }).limit(1).maybeSingle();
      if (data?.scores) {
        const scoresObj = data.scores;
        const valoresArray = FORCAS_ORDENADAS.map(
          (forca, i) => scoresObj[`forca_${i}`] ?? 5
        );
        setValores(valoresArray);
        setNotes(data.notes ?? "");
      }
      return data;
    }
  });
  const { data: history = [] } = useQuery({
    queryKey: ["wheel-history", clientId, "via-me"],
    queryFn: async () => {
      const { data, error } = await supabase.from("wheel_entries").select("id, taken_at, scores, notes").eq("client_id", clientId).eq("wheel_type", "via-me").order("taken_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: showHistory
  });
  const save = useMutation({
    mutationFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Sessão expirada");
      const scores = Object.fromEntries(
        valores.map((valor, i) => [`forca_${i}`, valor])
      );
      const { error } = await supabase.from("wheel_entries").insert({
        user_id: u.user.id,
        client_id: clientId,
        wheel_type: "via-me",
        scores,
        notes: notes || null
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Roda VIA ME salva!");
      qc.invalidateQueries({ queryKey: ["wheel-latest", clientId, "via-me"] });
      qc.invalidateQueries({ queryKey: ["wheel-history", clientId, "via-me"] });
    },
    onError: (e) => toast.error(e.message)
  });
  const exportPDF = async () => {
    if (!captureRef.current) {
      toast.error("Erro: Elemento não encontrado");
      return;
    }
    const toastId = toast.loading("Gerando PDF...");
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: false,
        imageTimeout: 0,
        removeContainer: false
      });
      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error("Canvas vazio - falha ao capturar imagem");
      }
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
        compress: true
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const availableWidth = pageWidth - margin * 2;
      const imgWidth = availableWidth;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      pdf.setFontSize(14);
      pdf.setFont(void 0, "bold");
      pdf.text("Roda da Vida VIA ME", margin, 30);
      pdf.setFontSize(10);
      pdf.setFont(void 0, "normal");
      pdf.text("24 Forças de Caráter", margin, 45);
      pdf.setFontSize(8);
      pdf.text(`Data: ${format(/* @__PURE__ */ new Date(), "dd/MM/yyyy")}`, pageWidth - margin - 80, 30);
      const yPosition = 55;
      if (imgHeight > pageHeight - yPosition - margin) {
        const ratio = (pageHeight - yPosition - margin) / imgHeight;
        pdf.addImage(img, "PNG", margin, yPosition, imgWidth * ratio, imgHeight * ratio, void 0, "FAST");
      } else {
        pdf.addImage(img, "PNG", margin, yPosition, imgWidth, imgHeight, void 0, "FAST");
      }
      pdf.save(`roda-via-me-${format(/* @__PURE__ */ new Date(), "yyyy-MM-dd-HHmm")}.pdf`);
      toast.dismiss(toastId);
      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.dismiss(toastId);
      toast.error(`Erro ao gerar PDF: ${error.message || "Tente novamente"}`);
    }
  };
  const reset = () => setValores(Array(24).fill(5));
  const loadFromHistory = (entry) => {
    const scoresObj = entry.scores;
    const valoresArray = FORCAS_ORDENADAS.map(
      (_, i) => scoresObj[`forca_${i}`] ?? 5
    );
    setValores(valoresArray);
    setNotes(entry.notes ?? "");
    setShowHistory(false);
    toast.success("Registro carregado");
  };
  const avg = (valores.reduce((s, v) => s + v, 0) / 24).toFixed(1);
  const mediasPorVirtude = VIRTUDES.map((virtude, vIdx) => {
    const indiceForcaInicial = VIRTUDES.slice(0, vIdx).reduce(
      (acc, v) => acc + v.forcas.length,
      0
    );
    const valoresDaVirtude = valores.slice(
      indiceForcaInicial,
      indiceForcaInicial + virtude.forcas.length
    );
    const media = (valoresDaVirtude.reduce((s, v) => s + v, 0) / virtude.forcas.length).toFixed(1);
    return { nome: virtude.nome, media, cor: virtude.cor };
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-[1fr_380px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex-row items-center justify-between flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-xl", children: "Roda da Vida VIA ME — 24 Forças de Caráter" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
            "Média: ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-foreground", children: [
              avg,
              "/10"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: captureRef, className: "bg-background p-4 md:p-6 rounded-lg flex justify-center items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-[800px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RodaViaMe, { valores, tamanho: 1e3, className: "w-full h-auto" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center mt-3", children: "Use os controles à direita para ajustar cada força de caráter (1 a 10)." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-display", children: "Médias por Virtude" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-2", children: mediasPorVirtude.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "h-3 w-3 rounded-full shrink-0",
                  style: { backgroundColor: v.cor }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-xs", children: v.nome })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: v.media })
          ] }, v.nome)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-display", children: "24 Forças de Caráter" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-[320px] pr-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: FORCAS_ORDENADAS.map((forca, i) => {
            let virtude = VIRTUDES[0];
            let acumulado = 0;
            for (const v of VIRTUDES) {
              if (i < acumulado + v.forcas.length) {
                virtude = v;
                break;
              }
              acumulado += v.forcas.length;
            }
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center justify-between gap-2 text-sm pb-2 border-b last:border-0",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "h-2.5 w-2.5 rounded-full shrink-0",
                        style: { backgroundColor: virtude.cor }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-xs", children: forca })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      min: 1,
                      max: 10,
                      value: valores[i],
                      onChange: (e) => {
                        const novoValor = Math.max(
                          1,
                          Math.min(10, Number(e.target.value))
                        );
                        setValores((prev) => {
                          const novos = [...prev];
                          novos[i] = novoValor;
                          return novos;
                        });
                      },
                      className: "w-14 rounded border px-2 py-1 text-right text-xs"
                    }
                  )
                ]
              },
              i
            );
          }) }) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-display", children: "Anotações" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              rows: 4,
              value: notes,
              onChange: (e) => setNotes(e.target.value),
              placeholder: "Observações sobre esta avaliação..."
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => save.mutate(), disabled: save.isPending, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4 mr-2" }),
            "Salvar registro"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: exportPDF, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-2" }),
            "Exportar PDF"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => setShowHistory(!showHistory), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "h-4 w-4 mr-2" }),
            showHistory ? "Ocultar histórico" : "Ver histórico"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", onClick: reset, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-4 w-4 mr-2" }),
            "Zerar valores"
          ] })
        ] }),
        latest && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-center", children: [
          "Última aplicação: ",
          format(new Date(latest.taken_at), "dd/MM/yyyy 'às' HH:mm")
        ] })
      ] })
    ] }),
    showHistory && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-lg", children: "Histórico de Avaliações" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: history.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-4", children: "Nenhuma avaliação registrada ainda." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: history.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: format(new Date(entry.taken_at), "dd/MM/yyyy 'às' HH:mm") }),
              entry.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate mt-1", children: entry.notes })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "outline",
                onClick: () => loadFromHistory(entry),
                children: "Carregar"
              }
            )
          ]
        },
        entry.id
      )) }) })
    ] })
  ] });
}
const SplitComponent = () => {
  const {
    id
  } = Route$4.useParams();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RodaViaEditor, { clientId: id }) });
};
export {
  SplitComponent as component
};
