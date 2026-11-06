/**
 * Zona horaria del dispositivo, tal como la resuelve el navegador.
 */
export function getDeviceTimeZone(): string | null {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || null;
  } catch {
    return null;
  }
}

/**
 * Forma canónica de una zona IANA según el `Intl` de este navegador.
 * Sirve solo para comparar: dos grafías de una misma zona (alias) dan la misma clave.
 * Devuelve null si la zona falta o `Intl` la rechaza (un valor ilegible cuenta como "distinto").
 */
export function canonicalTimeZone(
  timeZone: string | null | undefined,
): string | null {
  if (!timeZone) return null;

  try {
    return new Intl.DateTimeFormat(undefined, { timeZone }).resolvedOptions()
      .timeZone;
  } catch {
    return null;
  }
}
