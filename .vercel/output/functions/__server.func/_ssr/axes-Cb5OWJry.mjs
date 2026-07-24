import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-DJK_yZo7.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-DCDRzI6q.mjs";
import { B as Button } from "./button-DA2gxxPy.mjs";
import { T as Textarea } from "./textarea-DSyJ1nlY.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { j as jsPDF } from "../_libs/jspdf.mjs";
import { h as html2canvas } from "../_libs/html2canvas.mjs";
import { Y as Save, a2 as Download, a4 as RotateCcw } from "../_libs/lucide-react.mjs";
const DEFAULT_COLORS = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#84cc16",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#14b8a6",
  "#a855f7"
];
function WheelOfLifeSVG({
  axes,
  values,
  onChange,
  size = 520,
  levels = 10,
  readOnly = false
}) {
  const [hover, setHover] = reactExports.useState(null);
  const cx = size / 2;
  const cy = size / 2;
  const rMax = size / 2 - 60;
  const n = axes.length;
  const anglePer = Math.PI * 2 / n;
  const segments = reactExports.useMemo(() => {
    return axes.map((axis, i) => {
      const startAngle = -Math.PI / 2 + i * anglePer;
      const endAngle = startAngle + anglePer;
      const color = axis.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length];
      const levelsArr = Array.from({ length: levels }, (_, l) => {
        const rInner = l / levels * rMax;
        const rOuter = (l + 1) / levels * rMax;
        const p1 = polar(cx, cy, rInner, startAngle);
        const p2 = polar(cx, cy, rOuter, startAngle);
        const p3 = polar(cx, cy, rOuter, endAngle);
        const p4 = polar(cx, cy, rInner, endAngle);
        const largeArc = anglePer > Math.PI ? 1 : 0;
        const d = [
          `M ${p1.x} ${p1.y}`,
          `L ${p2.x} ${p2.y}`,
          `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${p3.x} ${p3.y}`,
          `L ${p4.x} ${p4.y}`,
          `A ${rInner} ${rInner} 0 ${largeArc} 0 ${p1.x} ${p1.y}`,
          "Z"
        ].join(" ");
        return { d, level: l + 1 };
      });
      const midAngle = startAngle + anglePer / 2;
      const labelPos = polar(cx, cy, rMax + 30, midAngle);
      return { axis, color, levelsArr, midAngle, labelPos, startAngle, endAngle };
    });
  }, [axes, anglePer, cx, cy, rMax, levels, n]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: `0 0 ${size} ${size}`, width: "100%", style: { maxWidth: size }, className: "select-none", children: [
    Array.from({ length: levels }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "circle",
      {
        cx,
        cy,
        r: (i + 1) / levels * rMax,
        fill: "none",
        stroke: "var(--border)",
        strokeWidth: 0.5,
        opacity: 0.4
      },
      i
    )),
    segments.map(({ axis, color, levelsArr }) => {
      const currentVal = values[axis.key] ?? 0;
      return /* @__PURE__ */ jsxRuntimeExports.jsx("g", { children: levelsArr.map(({ d, level }) => {
        const filled = level <= currentVal;
        const isHover = hover?.axis === axis.key && level <= hover.level;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d,
            fill: filled || isHover ? color : "transparent",
            fillOpacity: filled ? 0.85 : isHover ? 0.35 : 0,
            stroke: color,
            strokeOpacity: 0.5,
            strokeWidth: 0.5,
            style: { cursor: readOnly ? "default" : "pointer", transition: "fill-opacity 120ms" },
            onMouseEnter: () => !readOnly && setHover({ axis: axis.key, level }),
            onMouseLeave: () => !readOnly && setHover(null),
            onClick: () => !readOnly && onChange?.(axis.key, level === currentVal ? level - 1 : level)
          },
          level
        );
      }) }, axis.key);
    }),
    segments.map(({ axis, startAngle }) => {
      const end = polar(cx, cy, rMax, startAngle);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "line",
        {
          x1: cx,
          y1: cy,
          x2: end.x,
          y2: end.y,
          stroke: "var(--border)",
          strokeWidth: 0.8,
          opacity: 0.6
        },
        `l-${axis.key}`
      );
    }),
    segments.map(({ axis, labelPos, midAngle, color }) => {
      const val = values[axis.key] ?? 0;
      const anchor = Math.abs(Math.cos(midAngle)) < 0.2 ? "middle" : Math.cos(midAngle) > 0 ? "start" : "end";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "text",
          {
            x: labelPos.x,
            y: labelPos.y,
            textAnchor: anchor,
            dominantBaseline: "middle",
            fontSize: 13,
            fontWeight: 600,
            fill: "var(--foreground)",
            children: axis.label
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "text",
          {
            x: labelPos.x,
            y: labelPos.y + 14,
            textAnchor: anchor,
            dominantBaseline: "middle",
            fontSize: 11,
            fill: color,
            fontWeight: 700,
            children: [
              val,
              "/10"
            ]
          }
        )
      ] }, `t-${axis.key}`);
    }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx, cy, r: 4, fill: "var(--foreground)" })
  ] }) });
}
function polar(cx, cy, r, angle) {
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}
async function convertSvgToPngDataUrl(containerOrSvg) {
  const svgElement = containerOrSvg instanceof SVGSVGElement ? containerOrSvg : containerOrSvg.querySelector("svg");
  if (!svgElement) {
    const canvas = await html2canvas(containerOrSvg, {
      backgroundColor: "#ffffff",
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true
    });
    return {
      dataUrl: canvas.toDataURL("image/png"),
      width: canvas.width,
      height: canvas.height
    };
  }
  const clone = svgElement.cloneNode(true);
  const width = svgElement.viewBox?.baseVal?.width || svgElement.width?.baseVal?.value || svgElement.clientWidth || 800;
  const height = svgElement.viewBox?.baseVal?.height || svgElement.height?.baseVal?.value || svgElement.clientHeight || 800;
  clone.setAttribute("width", width.toString());
  clone.setAttribute("height", height.toString());
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const svgString = new XMLSerializer().serializeToString(clone).replace(/var\(--border\)/g, "#e2e8f0").replace(/var\(--foreground\)/g, "#0f172a").replace(/var\(--background\)/g, "#ffffff").replace(/var\(--muted-foreground\)/g, "#64748b");
  const svgBlob = new Blob([svgString], {
    type: "image/svg+xml;charset=utf-8"
  });
  const url = URL.createObjectURL(svgBlob);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = 2;
      const canvas = document.createElement("canvas");
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Não foi possível obter contexto 2D"));
        return;
      }
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve({
        dataUrl: canvas.toDataURL("image/png"),
        width: canvas.width,
        height: canvas.height
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      html2canvas(containerOrSvg, {
        backgroundColor: "#ffffff",
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      }).then((canvas) => {
        resolve({
          dataUrl: canvas.toDataURL("image/png"),
          width: canvas.width,
          height: canvas.height
        });
      }).catch(reject);
    };
    img.src = url;
  });
}
function WheelEditor({ clientId, wheelType, axes, title }) {
  const qc = useQueryClient();
  const captureRef = reactExports.useRef(null);
  const initial = Object.fromEntries(axes.map((a) => [a.key, 0]));
  const [values, setValues] = reactExports.useState(initial);
  const [notes, setNotes] = reactExports.useState("");
  const { data: latest } = useQuery({
    queryKey: ["wheel-latest", clientId, wheelType],
    queryFn: async () => {
      const { data } = await supabase.from("wheel_entries").select("*").eq("client_id", clientId).eq("wheel_type", wheelType).order("taken_at", { ascending: false }).limit(1).maybeSingle();
      if (data) {
        setValues({ ...initial, ...data.scores });
        setNotes(data.notes ?? "");
      }
      return data;
    }
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
        notes: notes || null
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Roda salva!");
      qc.invalidateQueries({ queryKey: ["wheel-latest", clientId, wheelType] });
    },
    onError: (e) => toast.error(e.message)
  });
  const exportPDF = async () => {
    if (!captureRef.current) return;
    const toastId = toast.loading("Gerando PDF...");
    try {
      const { dataUrl, width, height } = await convertSvgToPngDataUrl(captureRef.current);
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 30;
      const availableWidth = pageWidth - margin * 2;
      const imgHeight = height * availableWidth / width;
      pdf.setFontSize(16);
      pdf.text(title, margin, 40);
      pdf.addImage(dataUrl, "PNG", margin, 60, availableWidth, imgHeight);
      pdf.save(`${title.replace(/\s+/g, "-").toLowerCase()}.pdf`);
      toast.dismiss(toastId);
      toast.success("PDF exportado com sucesso!");
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(`Erro ao gerar PDF: ${err.message || "Tente novamente"}`);
    }
  };
  const reset = () => setValues(initial);
  const avg = (Object.values(values).reduce((s, v) => s + v, 0) / axes.length).toFixed(1);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-[1fr_320px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex-row items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-xl", children: title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
          "Média: ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-foreground", children: [
            avg,
            "/10"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: captureRef, className: "bg-background p-4 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          WheelOfLifeSVG,
          {
            axes,
            values,
            onChange: (k, v) => setValues((prev) => ({ ...prev, [k]: v }))
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center mt-2", children: "Clique nas divisões da roda para definir cada valor (0 a 10)." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-display", children: "Áreas" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-2", children: axes.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-3 w-3 rounded-full shrink-0", style: { background: a.color } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: a.label })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              min: 0,
              max: 10,
              value: values[a.key],
              onChange: (e) => setValues({ ...values, [a.key]: Math.max(0, Math.min(10, Number(e.target.value))) }),
              className: "w-14 rounded border px-2 py-1 text-right"
            }
          )
        ] }, a.key)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-display", children: "Anotações" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 4, value: notes, onChange: (e) => setNotes(e.target.value), placeholder: "Observações desta aplicação..." }) })
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
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", onClick: reset, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-4 w-4 mr-2" }),
          "Zerar"
        ] })
      ] }),
      latest && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
        "Última aplicação: ",
        new Date(latest.taken_at).toLocaleString("pt-BR")
      ] })
    ] })
  ] });
}
const ADULT_AXES = [
  { key: "saude", label: "Saúde", color: "#10b981" },
  { key: "familia", label: "Família", color: "#f59e0b" },
  { key: "amor", label: "Amor/Relacionamento", color: "#ec4899" },
  { key: "carreira", label: "Carreira", color: "#3b82f6" },
  { key: "financeiro", label: "Financeiro", color: "#84cc16" },
  { key: "social", label: "Amigos/Social", color: "#f97316" },
  { key: "desenvolvimento", label: "Desenv. Pessoal", color: "#8b5cf6" },
  { key: "espiritualidade", label: "Espiritualidade", color: "#06b6d4" }
];
const TEEN_AXES = [
  { key: "estudos", label: "Estudos", color: "#3b82f6" },
  { key: "familia", label: "Família", color: "#f59e0b" },
  { key: "amigos", label: "Amigos", color: "#f97316" },
  { key: "lazer", label: "Lazer", color: "#ec4899" },
  { key: "saude", label: "Saúde", color: "#10b981" },
  { key: "espiritualidade", label: "Espiritualidade", color: "#06b6d4" },
  { key: "emocoes", label: "Emoções", color: "#8b5cf6" },
  { key: "autoconhecimento", label: "Autoconhecimento", color: "#84cc16" }
];
export {
  ADULT_AXES as A,
  TEEN_AXES as T,
  WheelEditor as W
};
