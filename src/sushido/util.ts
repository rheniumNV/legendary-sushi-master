import { Pos } from "./factory/type";

export function processPos(
  pos1: Pos,
  pos2: Pos,
  process: (a: number, b: number) => number
): Pos {
  return [process(pos1[0], pos2[0]), process(pos1[1], pos2[1])];
}

export function normalizedPos(pos: Pos): Pos {
  if (pos[0] === 0 && pos[1] === 0) {
    return [0, 0];
  }
  const p = Math.sqrt(pos[0] * pos[0] + pos[1] * pos[1]);
  return [pos[0] / p, pos[1] / p];
}
