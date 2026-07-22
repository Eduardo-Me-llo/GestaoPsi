import { createFileRoute } from "@tanstack/react-router";
import { WheelEditor } from "@/components/wheel/WheelEditor";
import { TEEN_AXES } from "@/components/wheel/axes";

export const Route = createFileRoute("/_authenticated/clientes/$id/roda-adolescente")({
  component: () => {
    const { id } = Route.useParams();
    return <WheelEditor clientId={id} wheelType="adolescente" axes={TEEN_AXES} title="Roda da Vida — Adolescente" />;
  },
});
