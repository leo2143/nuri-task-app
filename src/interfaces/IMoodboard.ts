/**
 * Interface para el modelo de Moodboard (Tablero de Inspiración)
 * Representa un tablero visual con imágenes y frases motivacionales
 */

/**
 * Interface para una imagen en el moodboard
 */
export interface IMoodboardImage {
  imageUrl: string;
  imageAlt: string;
  imagePositionNumber: number;
}

/**
 * Interface para una frase en el moodboard
 */
export interface IMoodboardPhrase {
  phrase: string;
}

/**
 * Interface para el modelo de Moodboard
 */
export interface IMoodboard {
  _id?: string;
  title: string;
  userId: string;
  images: IMoodboardImage[];
  phrases: IMoodboardPhrase[];
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Interface para crear un nuevo moodboard
 */
export interface ICreateMoodboard {
  title: string;
  userId: string;
  images?: IMoodboardImage[];
  phrases?: IMoodboardPhrase[];
}

/**
 * Interface para actualizar un moodboard
 */
export interface IUpdateMoodboard {
  title?: string;
  images?: IMoodboardImage[];
  phrases?: IMoodboardPhrase[];
}

/**
 * Interface para agregar una imagen al moodboard
 */
export interface IAddMoodboardImage {
  imageUrl: string;
  imageAlt: string;
  imagePositionNumber: number;
}

/**
 * Interface para agregar una frase al moodboard
 */
export interface IAddMoodboardPhrase {
  phrase: string;
}

