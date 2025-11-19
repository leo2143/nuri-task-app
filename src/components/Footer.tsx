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
import MenuNavItem from "./MenuNavItem";

export default function Footer() {
  return (
    <footer className="w-full bg-neutral fixed bottom-0 z-30">
      <div className="min-h-[60px] max-h-[60px]   bg-brand rounded-full text-white m-5  text-center relative flex items-center justify-between">
        <img
          className="h-full"
          src={navButton}
          alt="ícono de botón de navegación"
        />
        <MenuNavItem
          to="/"
          icon={home}
          iconHover={homeBrown}
          whitHover={false}
          whitelabel={false}
        />

        <MenuNavItem
          to="/goals"
          icon={star}
          iconHover={starBrown}
          whitHover={false}
          whitelabel={false}
        />

        <MenuNavItem
          to="/"
          icon={metrics}
          iconHover={metricBrown}
          whitHover={false}
          whitelabel={false}
        />

        <MenuNavItem
          to="/"
          icon={heart}
          iconHover={heartBlue}
          whitHover={false}
          whitelabel={false}
          iconClass=" w-8 h-8"
        />
      </div>
    </footer>
  );
}
