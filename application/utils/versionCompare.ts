export function compareSemver(a: string, b: string): -1 | 0 | 1 {
  const partsA = a.split(".").map((part) => parseInt(part, 10) || 0);
  const partsB = b.split(".").map((part) => parseInt(part, 10) || 0);
  const length = Math.max(partsA.length, partsB.length);

  for (let index = 0; index < length; index += 1) {
    const valueA = partsA[index] ?? 0;
    const valueB = partsB[index] ?? 0;
    if (valueA < valueB) return -1;
    if (valueA > valueB) return 1;
  }

  return 0;
}

export function parseMajorMinor(version: string): {
  major: number;
  minor: number;
} {
  const parts = version.split(".").map((part) => parseInt(part, 10) || 0);
  return { major: parts[0] ?? 0, minor: parts[1] ?? 0 };
}
