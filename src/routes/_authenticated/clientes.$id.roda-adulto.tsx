import { createFileRoute } from "@tanstack/react-router";
import { WheelEditor } from "@/components/wheel/WheelEditor";
import { ADULT_AXES } from "@/components/wheel/axes";

export const Route = createFileRoute("/_authenticated/clientes/$id/roda-adulto")({
  component: () => {
    const { id } = Route.useParams();
    return <WheelEditor clientId={id} wheelType="adulto" axes={ADULT_AXES} title="Roda da Vida — Adulto" />;
  },
});
