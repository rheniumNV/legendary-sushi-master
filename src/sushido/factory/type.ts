import { SObj } from "./SObj";
import { SUnit } from "./SUnit";

export type SId = string;
export type SUnitCode = string;
export type SObjCode = string;
export type Pos = [number, number];
export type Direction = 0 | 1 | 2 | 3;
export type ProcessCode = "nigiru" | "kiru" | "uru" | "yaku" | "taberu";

export type SObjMoveStartTask = {
  code: "moveStart";
  target?: SObj;
  from: SUnit;
  to: SUnit;
  speed: number;
};
export type SObjMoveUpdateTask = {
  code: "moveUpdate";
  to: SUnit;
};
export type SObjProcessTask = { code: "process"; target: SUnit };
export type SObjCombineTask = { code: "combine"; target: SUnit };
export type SObjTask =
  | SObjMoveStartTask
  | SObjMoveUpdateTask
  | SObjProcessTask
  | SObjCombineTask;

export type Transport = {
  type: "input" | "output";
  speed: number;
};

export type SUnitOptions = {
  code: SUnitCode;
  stack: {
    maxCount: number;
  };
  process?: {
    processCode: ProcessCode;
    value: number;
    requireInteract: boolean;
  }[];
  generation?: {
    objCode: SObjCode;
  };
  transporter?: [
    Transport | undefined,
    Transport | undefined,
    Transport | undefined,
    Transport | undefined
  ];
  combiner?: {
    count: number;
    speed: number;
  };
  delete?: {
    addCoin: number;
  };
  titleEn?: string;
  descriptionJa?: string;
  descriptionEn?: string;
};

export type SObjOptions = {
  code: string;
  process: {
    [key: string]: {
      output:
        | { type: "transform"; code: string }
        | { type: "coin"; value: number };
      scale: number;
    };
  };
  recipe: { [key: string]: { code: string; scale: number } };
};

export type SUnitModel = {
  [key: string]: SUnitOptions;
};

export type SObjModel = {
  [key: string]: SObjOptions;
};

export type FactoryModel = {
  unitModel: SUnitModel;
  objModel: SObjModel;
};
