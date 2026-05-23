export interface Story {
  id: string;
  title: string;
  reference: string;
  summary: string;
  content: string;
  book: string;
  chapter: number;
}

export const stories: Story[] = [
  {
    id: "creacion",
    title: "La Creación",
    reference: "Génesis 1:1-2:3",
    summary: "El inicio de todo lo que conocemos, creado con propósito y amor.",
    content: "Al principio, cuando no existía nada más que oscuridad y silencio, Dios decidió crear el universo. Su voz rompió el vacío diciendo: 'Hágase la luz', y la luz inundó todo. Separó la luz de la oscuridad, llamándolas día y noche.\n\nEn los días siguientes, el mundo cobró forma. Dios separó las aguas de los cielos y de la tierra firme. Hizo brotar plantas de todos los colores y frutos deliciosos. Puso el sol para iluminar el día y la luna con las estrellas para guiar la noche.\n\nLuego, llenó el mar de criaturas asombrosas y los cielos de aves que cantaban al volar. Creó a los animales terrestres, desde los más pequeños hasta los más grandes. Finalmente, como su obra maestra, creó al ser humano para que cuidara de este hermoso hogar.\n\nAl séptimo día, Dios descansó, mirando todo lo que había hecho y viendo que era bueno en gran manera.",
    book: "genesis",
    chapter: 1
  },
  {
    id: "noe",
    title: "Noé y el Diluvio",
    reference: "Génesis 6-9",
    summary: "Una historia de obediencia, paciencia y una nueva oportunidad para el mundo.",
    content: "En un tiempo donde la gente se había olvidado de hacer el bien, un hombre llamado Noé decidió seguir caminando con Dios. Dios le advirtió que vendría un gran diluvio para limpiar la tierra y le dio una tarea casi imposible: construir un barco gigantesco, un arca.\n\nNoé trabajó durante años, ante las miradas burlonas de sus vecinos. Con paciencia, construyó cada parte del arca y reunió parejas de todos los animales. Cuando el cielo se oscureció y las primeras gotas cayeron, Noé, su familia y todos los animales ya estaban a salvo dentro.\n\nLlovió durante cuarenta días y cuarenta noches. Las aguas cubrieron hasta las montañas más altas. Pero Dios no se olvidó de Noé. Después de mucho tiempo, un arcoíris brilló en el cielo como una promesa eterna de que nunca más habría un diluvio así. El mundo tenía una nueva oportunidad.",
    book: "genesis",
    chapter: 6
  },
  {
    id: "david",
    title: "David y Goliat",
    reference: "1 Samuel 17",
    summary: "El valor no viene de la fuerza física, sino de la confianza en Dios.",
    content: "Había un joven pastor llamado David, que pasaba sus días cuidando ovejas y tocando el arpa. Mientras tanto, su nación estaba en guerra contra los filisteos. En el campo de batalla, un gigante llamado Goliat aterrorizaba a todos los soldados, desafiándolos a pelear.\n\nNadie se atrevía a enfrentarlo, hasta que David llegó para llevar comida a sus hermanos. Al escuchar las burlas del gigante, David no sintió miedo, sino indignación. Confiado en que Dios lo protegería, rechazó la pesada armadura del rey y fue al encuentro de Goliat solo con su honda y cinco piedras lisas.\n\nEl gigante se rió al ver a un muchacho, pero David le respondió que él venía en el nombre de Dios. Con un solo lanzamiento certero, la piedra alcanzó la frente de Goliat y el gigante cayó. Aquel día, todos aprendieron que con fe, ningún gigante es demasiado grande.",
    book: "1samuel",
    chapter: 17
  },
  {
    id: "hijo-prodigo",
    title: "El Hijo Pródigo",
    reference: "Lucas 15:11-32",
    summary: "Una parábola sobre el amor incondicional y el perdón de un padre.",
    content: "Jesús contó la historia de un hombre que tenía dos hijos. El más joven, impaciente por vivir su propia vida, pidió su parte de la herencia y se fue lejos. Gastó todo su dinero en fiestas y lujos, hasta que se quedó sin nada y tuvo que trabajar alimentando cerdos.\n\nEn su momento más bajo, recordó la bondad de su padre y decidió volver, esperando ser tratado solo como un empleado. Pero mientras aún estaba lejos, su padre lo vio venir y corrió hacia él con los brazos abiertos.\n\nEl padre no le pidió explicaciones ni le reprochó sus errores. En lugar de eso, organizó la fiesta más grande, diciendo: 'Mi hijo estaba perdido y ha sido hallado'. Es el recordatorio de que no importa cuánto nos alejemos, el amor de nuestro Padre siempre nos espera para volver a casa.",
    book: "lucas",
    chapter: 15
  },
  {
    id: "moises",
    title: "Moisés y el Éxodo",
    reference: "Éxodo 14",
    summary: "El asombroso camino hacia la libertad a través del mar.",
    content: "Moisés lideraba a miles de personas que escapaban de la esclavitud en Egipto. Parecía que finalmente eran libres, hasta que se encontraron atrapados: frente a ellos estaba el inmenso Mar Rojo y detrás, el ejército del Faraón que venía a capturarlos.\n\nEl pueblo tuvo miedo, mas Moisés les dijo: 'No teman, verán la salvación de Dios'. Dios le ordenó extender su vara sobre el mar. De repente, un viento fuerte sopló y las aguas se dividieron, formando dos muros líquidos y dejando un camino seco en medio.\n\nTodo el pueblo cruzó a salvo. Cuando el ejército egipcio intentó seguirlos, el mar volvió a su lugar. Ese día, entre cantos y alegría, celebraron su verdadera libertad, sabiendo que Dios abre caminos donde parece que no los hay.",
    book: "exodo",
    chapter: 14
  }
];
