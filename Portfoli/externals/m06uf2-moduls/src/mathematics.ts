export function min(array: number[]): number {
  if (!array.length) throw new Error("Array is empty");
  return Math.min(...array);
}

export function max(array: number[]): number {
  if (!array.length) throw new Error("Array is empty");
  return Math.max(...array);
}

export function decompose(n: number): number[] {
  if (n < 2) return [];

  const factors: number[] = [];
  let divisor = 2;

  while (n >= 2) {
    if (n % divisor === 0) {
      factors.push(divisor);
      n = n / divisor;
    } else {
      divisor++;
    }
  }

  return factors;
}
