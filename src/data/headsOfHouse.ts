// Bio estática por persona (Head of House y founder), ya que la API no
// trae descripción ni foto de ninguno de los dos. Key = "firstName
// lastName" tal como vienen esos campos en /Houses (heads) o el string de
// `founder`, para poder buscar por el nombre que ya devuelve el fetch.
// Datos verificados contra el Harry Potter Wiki (harrypotter.fandom.com).
export const headsOfHouse: Record<string, string> = {
  "Minerva McGonagall":
    "Head of Gryffindor House and Transfiguration teacher. An Animagus (she turns into a tabby cat), strict but fair, and after the Battle of Hogwarts she becomes headmistress of the school.",
  "Horace Slughorn":
    "Head of Slytherin House and Potions teacher. Founded the 'Slug Club' to surround himself with talented or well-connected students; vain and fond of crystallised pineapple, he prefers comfort to confrontation.",
  "Severus Snape":
    "Head of Slytherin House from 1981 to 1997 and Potions teacher (later Defence Against the Dark Arts). A former Death Eater turned secret double agent for Dumbledore, driven by his love for Lily Potter.",
  "Filius Flitwick":
    "Head of Ravenclaw House and Charms teacher. Part-goblin and short in stature, he was a duelling champion in his youth, with a shelf full of trophies to prove it.",
  "Pomona Sprout":
    "Head of Hufflepuff House and Herbology teacher. Spends much of her time in the school's greenhouses, and in 1993 she brewed the Mandrake Restorative Draught to cure those petrified by Slytherin's monster.",
  "Godric Gryffindor":
    "One of the four founders of Hogwarts. He valued courage and daring above all, was the finest duellist of his time, and preferred his sword to magic; he also created the Sorting Hat.",
  "Salazar Slytherin":
    "Founder of Hogwarts, a pure-blood wizard and Parselmouth who prized ambition and cunning. Unable to get the school to accept only pure-blood wizards, he left and built the Chamber of Secrets.",
  "Rowena Ravenclaw":
    "Founder of Hogwarts, considered the most brilliant witch of her age. She created Ravenclaw's Diadem, which enhanced the wisdom of its wearer, and valued wit above all in her students.",
  "Helga Hufflepuff":
    "Founder of Hogwarts known for her warmth and sense of fairness. Unlike the other founders, she welcomed any student willing to work hard, regardless of lineage or innate talent.",
};
