import NuriAlegre from "../../assets/images/nuri-alegre.png";

export default function Onboarding1() {
  return (
    <section>
      <div>
        <h2>Bienvenidoa Nuri Task</h2>
      </div>
      <div>
        <img src={NuriAlegre} alt="Nuri mascota alegre" />
      </div>
      <div>
        <p>Organizá tus metas, avanzá a tu ritmo y dejá que Nuri te acompañe en el camino.</p>
      </div>
    </section>
  );
}
