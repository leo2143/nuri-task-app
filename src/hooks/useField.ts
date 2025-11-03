import { useState } from "react";

interface UseFieldReturn {
  type: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Custom hook para manejar campos de formulario
 * @param type - Tipo del input (text, email, password, etc.)
 * @returns Objeto con propiedades para conectar directamente al input
 */
export const useField = (type: string): UseFieldReturn => {
  const [value, setValue] = useState("");

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
};
