import Conductor from './conductor';

// Exemple 1: Conductor que pot portar moto
const conductor1 = new Conductor("Pepito", new Date(1992, 0, 15), true);

console.log(conductor1.print()); 
// "Nom: Pepito, Edat: 33, Pot portar moto:  Sí"

console.log(conductor1.print(false)); 
// "Nom:  Pepito, Edat:  33, Pot portar moto: No"

console.log(conductor1.print("Joan")); 
// "Nom: Joan, Edat: 33, Pot portar moto:  Sí"

console.log(conductor1.print(new Date(2000, 5, 20))); 
// "Nom: Pepito, Edat: 24, Pot portar moto: Sí"

// Exemple 2: Conductor que no pot portar moto
const conductor2 = new Conductor("Maria", new Date(1995, 7, 10), false);

console.log(conductor2.print());
// "Nom: Maria, Edat: 29, Pot portar moto:  No"

console.log(conductor2.print(true));
// "Nom: Maria, Edat: 29, Pot portar moto:  Sí"

// Exemple 3: Provar els setters
conductor1.nom = "Pere";
conductor1.potPortarMoto = false;
console.log(conductor1.print());
// "Nom: Pere, Edat: 33, Pot portar moto: No"

// Exemple 4: Això llança error (menor de 18 anys)
try {
  const conductor3 = new Conductor("Jove", new Date(2010, 0, 1), false);
} catch (error) {
  console.log(error.message);
  // "El conductor ha de tenir almenys 18 anys"
}

// Exemple 5: Provar setter de data (error)
try {
  conductor1.dataNaixement = new Date(2015, 3, 20);
} catch (error) {
  console.log(error.message);
  // "El conductor ha de tenir almenys 18 anys"
}