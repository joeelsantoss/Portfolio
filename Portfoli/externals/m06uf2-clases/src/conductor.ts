export default class Conductor {
   nom: string;
   dataNaixement: Date;
   potPortarMoto: boolean;

  constructor(nom: string, dataNaixement: Date, potPortarMoto: boolean) {
    // Validar que la edad sea mayor o igual a 18 años
    const avui = new Date();
    const edat = avui.getFullYear() - dataNaixement.getFullYear();
    const mesActual = avui.getMonth();
    const mesNaixement = dataNaixement.getMonth();

    if (edat < 18 || (edat === 18 && mesActual < mesNaixement)) {
      throw new Error('El conductor debe tener al menos 18 años');
    }

    this.nom = nom;
    this.dataNaixement = dataNaixement;
    this.potPortarMoto = potPortarMoto;
  }

  // Getters y setters para nom
  getNom(): string {
    return this.nom;
  }

  setNom(nom: string): void {
    this.nom = nom;
  }

  // Getters y setters para dataNaixement
  getDataNaixement(): Date {
    return this.dataNaixement;
  }

  setDataNaixement(dataNaixement: Date): void {
    // Validar que la edad sea mayor o igual a 18 años
    const avui = new Date();
    const edat = avui.getFullYear() - dataNaixement.getFullYear();
    const mesActual = avui.getMonth();
    const mesNaixement = dataNaixement.getMonth();

    if (edat < 18 || (edat === 18 && mesActual < mesNaixement)) {
      throw new Error('El conductor debe tener al menos 18 años');
    }

    this.dataNaixement = dataNaixement;
  }

  // Getters y setters para potPortarMoto
  getPotPortarMoto(): boolean {
    return this.potPortarMoto;
  }

  setPotPortarMoto(potPortarMoto: boolean): void {
    this.potPortarMoto = potPortarMoto;
  }

  // Método para calcular la edad
  private getEdat(): number {
    const avui = new Date();
    let edat = avui.getFullYear() - this.dataNaixement.getFullYear();
    const mesActual = avui.getMonth();
    const mesNaixement = this.dataNaixement.getMonth();

    if (mesActual < mesNaixement) {
      edat--;
    }

    return edat;
  }

  // Método print con parámetros opcionalesPolymorphism
  print(override?: string | Date | boolean): string {
    const motoText = this.potPortarMoto ? 'Sí' : 'No';
    let resultado = `Nom: ${this.nom}, Edat: ${this.getEdat()}, Pot portar moto: ${motoText}`;

    if (override !== undefined) {
      if (typeof override === 'string') {
        // Reemplazar el nombre
        resultado = `Nom: ${override}, Edat: ${this.getEdat()}, Pot portar moto: ${motoText}`;
      } else if (override instanceof Date) {
        // Reemplazar la fecha de nacimiento y recalcular edad
        const edatNova = new Date().getFullYear() - override.getFullYear();
        resultado = `Nom: ${this.nom}, Edat: ${edatNova}, Pot portar moto: ${motoText}`;
      } else if (typeof override === 'boolean') {
        // Reemplazar potPortarMoto
        const motoTextNova = override ? 'Sí' : 'No';
        resultado = `Nom: ${this.nom}, Edat: ${this.getEdat()}, Pot portar moto: ${motoTextNova}`;
      }
    }

    return resultado;
  }
}

// Ejemplos de uso
console.log('=== Ejemplos de uso de la clase Conductor ===\n');

// Crear un conductor válido
const conductor1 = new Conductor('Pepito', new Date(1992, 5, 15), true);
console.log('Conductor 1 - Sin parámetros:');
console.log(conductor1.print());
console.log('\nConductor 1 - Con nombre diferente:');
console.log(conductor1.print('Juan'));
console.log('\nConductor 1 - Con fecha diferente:');
console.log(conductor1.print(new Date(1990, 0, 1)));
console.log('\nConductor 1 - Con moto = false:');
console.log(conductor1.print(false));

// Crear otro conductor
console.log('\n---\n');
const conductor2 = new Conductor('María', new Date(2000, 11, 10), false);
console.log('Conductor 2 - Sin parámetros:');
console.log(conductor2.print());
console.log('\nConductor 2 - Con moto = true:');
console.log(conductor2.print(true));

// Intentar crear un conductor menor de 18 años (generará error)
console.log('\n---\n');
try {
  const conductorMenor = new Conductor('Carlos', new Date(2010, 0, 1), false);
} catch (error) {
  console.log('Error:', (error as Error).message);
}

export { Conductor };
