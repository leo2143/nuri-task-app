import StatusPage from "./StatusPage";

export default function Forbidden() {
  return (
    <StatusPage
      code="403"
      title="No tenés acceso a esta página"
      message="¡Ups! Esta sección es solo para administradores."
    />
  );
}
