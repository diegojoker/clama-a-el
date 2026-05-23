export interface Devotional {
  id: string;
  title: string;
  content: string;
  verseReference: string;
  verseText: string;
}

export const dailyDevotionals: Record<string, Devotional> = {
  // Keyed by date index or specific date string
  "default": {
    id: "d1",
    title: "Caminando en Su Luz",
    content: "Vivir en la luz de Dios significa más que simplemente evitar el mal; significa buscar activamente Su presencia en cada pequeña decisión de nuestro día. Cuando permitimos que Su Palabra ilumine nuestro camino, las sombras de la duda y el miedo comienzan a desvanecerse. No estamos llamados a tener todas las respuestas, sino a confiar en Aquel que es la Respuesta.\n\nHoy, tómate un momento para respirar y reconocer que no caminas solo. Cada paso que das, por pequeño que sea, está siendo guiado por un amor que no conoce límites. Que tu corazón encuentre descanso en la promesa de que Su guía es constante y Su misericordia se renueva con cada amanecer. Permite que Su paz sea el árbitro de tus pensamientos y que Tu fe sea el motor de tus acciones.",
    verseReference: "Salmos 119:105",
    verseText: "Lámpara es a mis pies tu palabra, y lumbrera a mi camino."
  }
};

export interface Series {
  id: string;
  title: string;
  duration: number;
  price: number;
  category: string;
}

export const devotionalSeries: Series[] = [
  { id: "ansiedad-7", title: "7 días sobre la Ansiedad", duration: 7, price: 15, category: "ansiedad" },
  { id: "perdon-7", title: "7 días sobre el Perdón", duration: 7, price: 15, category: "perdon" },
  { id: "fe-7", title: "7 días sobre la Fe", duration: 7, price: 15, category: "fe" },
  { id: "salmos-30", title: "30 días con los Salmos", duration: 30, price: 35, category: "proposito" },
  { id: "matrimonio-7", title: "7 días sobre el Matrimonio", duration: 7, price: 15, category: "matrimonio" }
];
