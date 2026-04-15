// Interfície Perimetrable
interface Perimetrable {
  perimetre(): number;
}

// Classe Rectangle
class Rectangle implements Perimetrable {
  protected base: number;
  protected alcada: number;

  constructor(base: number, alcada: number) {
    this.base = base;
    this.alcada = alcada;
  }

  perimetre(): number {
    return 2 * (this.base + this.alcada);
  }
}

// Classe Quadrat que hereta de Rectangle
class Quadrat extends Rectangle {
  constructor(costat: number) {
    super(costat, costat);
  }
}

// Classe Cercle
class Cercle implements Perimetrable {
  private radi: number;

  constructor(radi: number) {
    this.radi = radi;
  }

  perimetre(): number {
    return 2 * Math.PI * this. radi;
  }
}

// Exemple d'ús
const rectangle = new Rectangle(10, 5);
console.log("Perímetre rectangle:", rectangle.perimetre()); // 30

const quadrat = new Quadrat(6);
console.log("Perímetre quadrat:", quadrat. perimetre());     // 24

const cercle = new Cercle(5);
console.log("Perímetre cercle:", cercle. perimetre());       // 31.41592653589793