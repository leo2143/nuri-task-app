// ========================================
// CONSTANTES
// ========================================
export const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
export const PASSWORD_MIN_LENGTH = 5;
export const HAS_UPPERCASE = /[A-Z]/;
export const HAS_NUMBER = /\d/;

/**
 * Valida que un campo no esté vacío
 * @param value - Valor a validar
 * @param fieldName - Nombre del campo para el mensaje de error
 * @returns Mensaje de error o null si es válido
 */
export const validateRequired = (
  value: string,
  fieldName: string = "Este campo",
): string | null => {
  if (!value.trim()) {
    return `${fieldName} es obligatorio`;
  }
  return null;
};

/**
 * Valida la longitud mínima de un campo
 * @param value - Valor a validar
 * @param minLength - Longitud mínima requerida
 * @param fieldName - Nombre del campo para el mensaje de error
 * @returns Mensaje de error o null si es válido
 */
export const validateMinLength = (
  value: string,
  minLength: number,
  fieldName: string = "Este campo",
): string | null => {
  if (value.trim().length < minLength) {
    return `${fieldName} debe tener al menos ${minLength} caracteres`;
  }
  return null;
};

/**
 * Valida la longitud máxima de un campo
 * @param value - Valor a validar
 * @param maxLength - Longitud máxima permitida
 * @param fieldName - Nombre del campo para el mensaje de error
 * @returns Mensaje de error o null si es válido
 */
export const validateMaxLength = (
  value: string,
  maxLength: number,
  fieldName: string = "Este campo",
): string | null => {
  if (value.trim().length > maxLength) {
    return `${fieldName} no puede tener más de ${maxLength} caracteres`;
  }
  return null;
};

export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email.trim());
};

/**
 * Valida formato de email
 */
export const validateEmail = (email: string): string | null => {
  // Usar validación genérica para campo requerido
  const requiredError = validateRequired(email, "El email");
  if (requiredError) return requiredError;

  if (!isValidEmail(email)) {
    return "El email no es válido";
  }
  return null;
};

/**
 * Valida contraseña
 */
export const validatePassword = (password: string): string | null => {
  // Usar validación genérica para campo requerido
  const requiredError = validateRequired(password, "La contraseña");
  if (requiredError) return requiredError;

  // Usar validación genérica para longitud mínima
  const minLengthError = validateMinLength(
    password,
    PASSWORD_MIN_LENGTH,
    "La contraseña",
  );
  if (minLengthError) return minLengthError;

  return null;
};

/**
 * Valida campo genérico con longitud mínima opcional
 * @param fieldMessage - Nombre del campo para los mensajes de error
 * @param value - Valor a validar
 * @param minLength - (Opcional) Longitud mínima. Si es 0 o no se especifica, solo valida que no esté vacío. Por defecto 0
 * @returns Mensaje de error o null si es válido
 * @example
 */
export const validateField = (
  fieldMessage: string,
  value: string,
  minLength: number = 0,
): string | null => {
  // Usar validación genérica para campo requerido
  const requiredError = validateRequired(value, fieldMessage);
  if (requiredError) return requiredError;

  // Validar longitud mínima solo si se especifica (mayor a 0)
  if (minLength > 0) {
    const minLengthError = validateMinLength(value, minLength, fieldMessage);
    if (minLengthError) return minLengthError;
  }

  return null;
};

/**
 * Valida que las contraseñas coincidan
 */
export const validateConfirmPassword = (
  password: string,
  confirmPassword: string,
): string | null => {
  // Usar validación genérica para campo requerido
  const requiredError = validateRequired(
    confirmPassword,
    "La confirmación de contraseña",
  );
  if (requiredError) return requiredError;

  if (password !== confirmPassword) {
    return "Las contraseñas no coinciden";
  }
  return null;
};
