import StatusPage from "./StatusPage";

export default function NotFound() {
  return (
    <StatusPage
      code="404"
      title="Página no encontrada"
      message="¡Ups! La página que buscás no existe."
    />
  );
}
