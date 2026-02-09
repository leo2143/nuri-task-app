import React from "react";
import { Link } from "react-router-dom";

interface AdminCardProps {
  to?: string;
  shadow?: string;
  bgColor: "bg-white" | "bg-secondary" | "bg-brand";
  textColor?: "text-neutral" | "text-tertiary";
  padding: string
  children: React.ReactNode;
  icon?: {
    src: string;
    alt: string;
    className: string;
  };
  hasHover?: boolean;
}

export default function AdminCard({
  to,
  bgColor,
  shadow,
  textColor = "text-tertiary",
  padding,
  children,
  icon,
  hasHover = true,
}: AdminCardProps) {
  const cardClasses = `
    relative overflow-hidden w-full ${bgColor} ${padding} ${shadow} rounded-lg text-center ${textColor}
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
