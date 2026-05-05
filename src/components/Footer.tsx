import {
  navButton,
  star,
  starBrown,
  home,
  homeBrown,
  heart,
  heartBlue,
  metricBrown,
  metrics,
} from "../assets/svg-icons";
import ActionSelect from "./ui/ActionSelect";
import FooterBar, { type FooterNavItem } from "./FooterBar";

const items: FooterNavItem[] = [
  { to: "/", icon: home, iconHover: homeBrown, label: "Inicio" },
  { to: "/goals", icon: star, iconHover: starBrown, label: "Metas" },
  { to: "/metrics", icon: metrics, iconHover: metricBrown, label: "Métricas" },
  {
    to: "/moodboard",
    icon: heart,
    iconHover: heartBlue,
    label: "Favoritos",
    iconClass: " w-8 h-8",
  },
];

export default function Footer() {
  return (
    <FooterBar
      items={items}
      leadingAction={
        <ActionSelect>
          <img
            className="w-[60px] h-[60px] cursor-pointer"
            src={navButton}
            alt="ícono de botón de navegación"
          />
        </ActionSelect>
      }
    />
  );
}
