import { Link } from "react-router-dom";

export default function AdminUser() {
  return (
    <div className="flex flex-col gap-6 justify-center">
      <h2>ESTAMOS EN USER</h2>

      <div className="flex w-full gap-4 p-5 justify-between items-center rounded-lg bg-white shadow-lg shadow-tertiary-dark/25">
        <div className="flex gap-5">
          <div className="bg-primary-light rounded-full w-50">0</div>
          <div>
            <p className="text-tertiary-dark/50 text-xl">Peito el mostro</p>
            <span className="text-tertiary-dark/50 text-sm">Suscripto: No</span>
          </div>
        </div>
        <Link to="user" className="text-primary font-bold">
          Ver
        </Link>{" "}
      </div>
    </div>
  );
}
