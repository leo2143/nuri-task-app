import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import NotFound from "./NotFound";
import Forbidden from "./Forbidden";
import ServerError from "./ServerError";

export default function RootErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <NotFound />;
    }

    if (error.status === 401 || error.status === 403) {
      return <Forbidden />;
    }
  }

  return <ServerError />;
}
