import StatusPage from "./StatusPage";

export default function ServerError() {
  return (
    <StatusPage
      code="500"
      title="Ocurrió un error inesperado"
      message="¡Ups! Algo salió mal. Esperá un toque y volvé a intentar."
    />
  );
}
