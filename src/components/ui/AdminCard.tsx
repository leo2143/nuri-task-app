import React from "react";
import { Link } from "react-router-dom";

interface AdminCardProps {
  to?: string;
  bgColor: "bg-secondary" | "bg-brand";
  textColor?: "text-neutral" | "text-tertiary";
  padding: "p-10" | "p-14";
  children: React.ReactNode;
  icon?: {
    src: string;
    alt: string;
    className: string; // Posición exacta del ícono
  };
  hasHover?: boolean;
}

export default function AdminCard({
  to,
  bgColor,
  textColor = "text-tertiary",
  padding,
  children,
  icon,
  hasHover = true,
}: AdminCardProps) {
  const cardClasses = `
    relative overflow-hidden w-full ${bgColor} ${padding} rounded-lg text-center ${textColor}
    shadow-lg shadow-tertiary-dark/25
    ${hasHover ? "hover:scale-110 transition-all ease-linear" : ""}
  `.trim();

  const content = (
    <>
      {icon && <img className={icon.className} src={icon.src} alt={icon.alt} />}
      <span>{children}</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={cardClasses}>
        {content}
      </Link>
    );
  }

  return <div className={cardClasses}>{content}</div>;
}
