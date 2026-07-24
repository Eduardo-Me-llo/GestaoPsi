import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-DJK_yZo7.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-DCDRzI6q.mjs";
import { B as Button } from "./button-DA2gxxPy.mjs";
import { I as Input } from "./input-C0QjszdI.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { T as Textarea } from "./textarea-DSyJ1nlY.mjs";
import { S as Switch } from "./switch-CQ4rbtn8.mjs";
import { A as Avatar, a as AvatarImage, b as AvatarFallback } from "./avatar-b9fucEBX.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { g as getAvatarPath, a as getSignedAvatarUrl, D as DEFAULT_AGENDA, b as DEFAULT_NOTIFICATIONS } from "./user-settings-CQlX_81E.mjs";
import { m as Camera, T as Trash2 } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-switch.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
function SettingsPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 max-w-3xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold tracking-tight", children: "Configurações" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: "Perfil, agenda, notificações e segurança." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AgendaSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationsSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PasswordSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AccountSection, {})
  ] });
}
function ProfileSection() {
  const qc = useQueryClient();
  const {
    data: profile
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const {
        data: u
      } = await supabase.auth.getUser();
      if (!u.user) return null;
      const {
        data
      } = await supabase.from("profiles").select("*").eq("id", u.user.id).maybeSingle();
      return {
        ...data ?? {},
        email: u.user.email,
        userId: u.user.id
      };
    }
  });
  const [form, setForm] = reactExports.useState({
    full_name: "",
    cpf: "",
    phone: "",
    birth_date: "",
    bio: ""
  });
  const [avatarUrl, setAvatarUrl] = reactExports.useState(null);
  const fileRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (profile) {
      const address = profile.address ?? {};
      setForm({
        full_name: profile.full_name ?? "",
        cpf: profile.cpf ?? "",
        phone: profile.phone ?? "",
        birth_date: profile.birth_date ?? "",
        bio: address.bio ?? ""
      });
      const path = getAvatarPath(address);
      if (path) getSignedAvatarUrl(path).then(setAvatarUrl);
      else setAvatarUrl(null);
    }
  }, [profile]);
  const mut = useMutation({
    mutationFn: async () => {
      const {
        data: u
      } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Sessão expirada");
      const currentAddress = profile?.address ?? {};
      const {
        error
      } = await supabase.from("profiles").upsert({
        id: u.user.id,
        full_name: form.full_name || null,
        cpf: form.cpf || null,
        phone: form.phone || null,
        birth_date: form.birth_date || null,
        address: {
          ...currentAddress,
          bio: form.bio || void 0
        }
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Perfil atualizado");
      qc.invalidateQueries({
        queryKey: ["profile"]
      });
      qc.invalidateQueries({
        queryKey: ["profile", "header"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const uploadAvatar = useMutation({
    mutationFn: async (file) => {
      if (!profile?.userId) throw new Error("Sessão expirada");
      if (file.size > 3 * 1024 * 1024) throw new Error("Imagem muito grande (máx 3MB)");
      if (!file.type.startsWith("image/")) throw new Error("Envie uma imagem válida");
      const ext = file.name.split(".").pop() ?? "png";
      const path = `${profile.userId}/avatar-${Date.now()}.${ext}`;
      const {
        error: upErr
      } = await supabase.storage.from("avatars").upload(path, file, {
        upsert: true,
        contentType: file.type
      });
      if (upErr) throw upErr;
      const oldPath = getAvatarPath(profile.address);
      if (oldPath && oldPath !== path) {
        await supabase.storage.from("avatars").remove([oldPath]);
      }
      const currentAddress = profile.address ?? {};
      const {
        error: upsertErr
      } = await supabase.from("profiles").upsert({
        id: profile.userId,
        address: {
          ...currentAddress,
          avatar_path: path
        }
      });
      if (upsertErr) throw upsertErr;
    },
    onSuccess: () => {
      toast.success("Foto atualizada");
      qc.invalidateQueries({
        queryKey: ["profile"]
      });
      qc.invalidateQueries({
        queryKey: ["profile", "header"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const removeAvatar = useMutation({
    mutationFn: async () => {
      if (!profile?.userId) return;
      const path = getAvatarPath(profile.address);
      if (path) await supabase.storage.from("avatars").remove([path]);
      const currentAddress = profile.address ?? {};
      const {
        avatar_path: _drop,
        ...rest
      } = currentAddress;
      const {
        error
      } = await supabase.from("profiles").upsert({
        id: profile.userId,
        address: rest
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Foto removida");
      setAvatarUrl(null);
      qc.invalidateQueries({
        queryKey: ["profile"]
      });
      qc.invalidateQueries({
        queryKey: ["profile", "header"]
      });
    }
  });
  const initials = (form.full_name || profile?.email || "?").split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display", children: "Perfil profissional" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-20 w-20", children: [
          avatarUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: avatarUrl, alt: "Foto de perfil" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-lg", children: initials })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileRef, type: "file", accept: "image/*", className: "hidden", onChange: (e) => {
            const f = e.target.files?.[0];
            if (f) uploadAvatar.mutate(f);
            e.target.value = "";
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: () => fileRef.current?.click(), disabled: uploadAvatar.isPending, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-4 w-4 mr-1" }),
              " ",
              uploadAvatar.isPending ? "Enviando..." : "Alterar foto"
            ] }),
            avatarUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => removeAvatar.mutate(), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 mr-1" }),
              " Remover"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "PNG ou JPG, até 3MB." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "space-y-4", onSubmit: (e) => {
        e.preventDefault();
        mut.mutate();
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "E-mail" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: profile?.email ?? "", disabled: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Nome completo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.full_name, onChange: (e) => setForm({
              ...form,
              full_name: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "CPF" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.cpf, onChange: (e) => setForm({
              ...form,
              cpf: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Telefone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.phone, onChange: (e) => setForm({
              ...form,
              phone: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Nascimento" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: form.birth_date, onChange: (e) => setForm({
              ...form,
              birth_date: e.target.value
            }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Sobre / especialização" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 3, value: form.bio, onChange: (e) => setForm({
            ...form,
            bio: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: mut.isPending, children: "Salvar alterações" })
      ] })
    ] })
  ] });
}
const DAYS = [{
  value: 0,
  label: "Domingo"
}, {
  value: 1,
  label: "Segunda"
}, {
  value: 2,
  label: "Terça"
}, {
  value: 3,
  label: "Quarta"
}, {
  value: 4,
  label: "Quinta"
}, {
  value: 5,
  label: "Sexta"
}, {
  value: 6,
  label: "Sábado"
}];
function AgendaSection() {
  const qc = useQueryClient();
  const {
    data: profile
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const {
        data: u
      } = await supabase.auth.getUser();
      if (!u.user) return null;
      const {
        data
      } = await supabase.from("profiles").select("*").eq("id", u.user.id).maybeSingle();
      return {
        ...data ?? {},
        userId: u.user.id
      };
    }
  });
  const [agenda, setAgenda] = reactExports.useState(DEFAULT_AGENDA);
  reactExports.useEffect(() => {
    const a = profile?.address?.agenda;
    if (a) setAgenda({
      ...DEFAULT_AGENDA,
      ...a
    });
  }, [profile]);
  const mut = useMutation({
    mutationFn: async () => {
      if (!profile?.userId) throw new Error("Sessão expirada");
      const currentAddress = profile.address ?? {};
      const {
        error
      } = await supabase.from("profiles").upsert({
        id: profile.userId,
        address: {
          ...currentAddress,
          agenda
        }
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Agenda configurada");
      qc.invalidateQueries({
        queryKey: ["profile"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const toggleDay = (v) => {
    setAgenda((prev) => ({
      ...prev,
      hidden_days: prev.hidden_days.includes(v) ? prev.hidden_days.filter((d) => d !== v) : [...prev.hidden_days, v]
    }));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display", children: "Agenda" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "space-y-5", onSubmit: (e) => {
      e.preventDefault();
      mut.mutate();
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Início dos atendimentos" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: 0, max: 23, value: agenda.start_hour, onChange: (e) => setAgenda({
            ...agenda,
            start_hour: Number(e.target.value)
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Hora do dia (0-23)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Fim dos atendimentos" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: 1, max: 24, value: agenda.end_hour, onChange: (e) => setAgenda({
            ...agenda,
            end_hour: Number(e.target.value)
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Hora do dia (1-24)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Duração da sessão (min)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: 10, value: agenda.session_duration, onChange: (e) => setAgenda({
            ...agenda,
            session_duration: Number(e.target.value)
          }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Ocultar dias da semana" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: DAYS.map((d) => {
          const hidden = agenda.hidden_days.includes(d.value);
          return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => toggleDay(d.value), className: `px-3 py-1.5 rounded-md text-sm border transition ${hidden ? "bg-muted text-muted-foreground line-through border-border" : "bg-primary/10 text-primary border-primary/40"}`, children: d.label }, d.value);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Clique para ocultar/exibir na visualização semanal." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: mut.isPending, children: "Salvar agenda" })
    ] }) })
  ] });
}
function NotificationsSection() {
  const qc = useQueryClient();
  const {
    data: profile
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const {
        data: u
      } = await supabase.auth.getUser();
      if (!u.user) return null;
      const {
        data
      } = await supabase.from("profiles").select("*").eq("id", u.user.id).maybeSingle();
      return {
        ...data ?? {},
        userId: u.user.id
      };
    }
  });
  const [notif, setNotif] = reactExports.useState(DEFAULT_NOTIFICATIONS);
  reactExports.useEffect(() => {
    const n = profile?.address?.notifications;
    if (n) setNotif({
      ...DEFAULT_NOTIFICATIONS,
      ...n
    });
  }, [profile]);
  const mut = useMutation({
    mutationFn: async () => {
      if (!profile?.userId) throw new Error("Sessão expirada");
      const currentAddress = profile.address ?? {};
      const {
        error
      } = await supabase.from("profiles").upsert({
        id: profile.userId,
        address: {
          ...currentAddress,
          notifications: notif
        }
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Notificações atualizadas");
      qc.invalidateQueries({
        queryKey: ["profile"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const rows = [{
    key: "session_reminder",
    label: "Lembrete de sessão",
    desc: "Aviso no sino sobre sessões nas próximas 48h."
  }, {
    key: "daily_agenda",
    label: "Resumo diário da agenda",
    desc: "Mostrar as sessões do dia no dashboard."
  }, {
    key: "payment_alerts",
    label: "Alertas financeiros",
    desc: "Avisar sobre receitas e despesas pendentes."
  }, {
    key: "email_notifications",
    label: "Notificações por e-mail",
    desc: "Receber avisos importantes por e-mail."
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display", children: "Notificações" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "space-y-4", onSubmit: (e) => {
      e.preventDefault();
      mut.mutate();
    }, children: [
      rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 py-2 border-b last:border-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-sm", children: r.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: r.desc })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: notif[r.key], onCheckedChange: (v) => setNotif({
          ...notif,
          [r.key]: v
        }) })
      ] }, r.key)),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: mut.isPending, children: "Salvar preferências" })
    ] }) })
  ] });
}
function PasswordSection() {
  const [pwd, setPwd] = reactExports.useState("");
  const [pwd2, setPwd2] = reactExports.useState("");
  const mut = useMutation({
    mutationFn: async () => {
      if (pwd.length < 6) throw new Error("Mínimo 6 caracteres");
      if (pwd !== pwd2) throw new Error("As senhas não coincidem");
      const {
        error
      } = await supabase.auth.updateUser({
        password: pwd
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Senha atualizada");
      setPwd("");
      setPwd2("");
    },
    onError: (e) => toast.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display", children: "Alterar senha" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "space-y-4", onSubmit: (e) => {
      e.preventDefault();
      mut.mutate();
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Nova senha" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", value: pwd, onChange: (e) => setPwd(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Confirmar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", value: pwd2, onChange: (e) => setPwd2(e.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: mut.isPending, children: "Atualizar senha" })
    ] }) })
  ] });
}
function AccountSection() {
  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display", children: "Conta" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: signOut, children: "Sair da conta" }) })
  ] });
}
export {
  SettingsPage as component
};
