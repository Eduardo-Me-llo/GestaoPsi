import { createFileRoute } from "@tanstack/react-router";
import { RodaViaEditor } from "@/components/wheel/RodaViaEditor";

export const Route = createFileRoute("/_authenticated/clientes/$id/roda-via")({
  component: () => {
    const { id } = Route.useParams();
    return (
      <div className="container py-6">
        <RodaViaEditor clientId={id} />
      </div>
    );
  },
});
