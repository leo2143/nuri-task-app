// import { Button } from ".";

// export interface ModalProps {
//   isOpen: boolean;
//   onClose: () => void;

//   message: string;
//   icon?: React.ReactNode;
//   type?: "warning" | "error" | "info" | "sucess";

//   onConfirm: () => void;
//   showCancelButton?: boolean;
// }
// export default function Modal({
//   isOpen,
//   type,
//   message,
//   onClose,
//   onConfirm,
//   showCancelButton,
// }: ModalProps) {
//   const baseStyle = "";

//   const warningStyles = "";

//   const errorStyles = "";

//   const infoStyles = "";

//   const sucessStyles = "";

//   useEffect(() => {
//     const handleEscape = (e: KeyboardEvent) => {
//       if (e.key === "Escape" && isOpen) {
//         onClose();
//       }
//     };

//     if (isOpen) {
//       document.addEventListener("keydown", handleEscape);
//       // Prevenir scroll del body
//       document.body.style.overflow = "hidden";
//     }

//     return () => {
//       document.removeEventListener("keydown", handleEscape);
//       document.body.style.overflow = "unset";
//     };
//   }, [isOpen, onClose]);

//   if (!isOpen) return null;

//   const handleConfirm = () => {
//     if (onConfirm) {
//       onConfirm();
//     }
//     onClose();
//   };
//   const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
//     // Solo cerrar si se hace click en el backdrop, no en el contenido
//     if (e.target === e.currentTarget) {
//       onClose();
//     }
//   };

//   return (
//     <div className="fondo oscuro">
//       <div className="container">
//         <div className="nuri">
//           <img src="" alt="" />
//         </div>
//         <div className="titulo-texto">
//           <img src="" alt="" />
//         </div>
//         <div className="titulo-texto">
//           <Button type="button" size="lg" variant="secondary"></Button>
//         </div>
//       </div>
//     </div>
//   );
// }
