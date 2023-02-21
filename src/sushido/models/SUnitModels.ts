import { SUnitModel, SUnitOptions } from "../factory/type";

export const マグロ箱: SUnitOptions = {
  code: "マグロ箱",
  stack: { maxCount: 0 },
  generation: { objCode: "マグロ" },
};

export const サーモン箱: SUnitOptions = {
  code: "サーモン箱",
  stack: { maxCount: 0 },
  generation: { objCode: "サーモン" },
};

export const えび箱: SUnitOptions = {
  code: "えび箱",
  stack: { maxCount: 0 },
  generation: { objCode: "えび" },
};

export const てんぷらこ箱: SUnitOptions = {
  code: "てんぷらこ箱",
  stack: { maxCount: 0 },
  generation: { objCode: "てんぷらこ" },
};

export const なまたまご箱: SUnitOptions = {
  code: "なまたまご箱",
  stack: { maxCount: 0 },
  generation: { objCode: "なまたまご" },
};

export const のり箱: SUnitOptions = {
  code: "のり箱",
  stack: { maxCount: 0 },
  generation: { objCode: "のり" },
};

export const すめし箱: SUnitOptions = {
  code: "すめし箱",
  stack: { maxCount: 0 },
  generation: { objCode: "すめし" },
};

export const 瓶箱: SUnitOptions = {
  code: "瓶箱",
  stack: { maxCount: 0 },
  generation: { objCode: "瓶" },
};

export const コンベア: SUnitOptions = {
  code: "コンベア",
  stack: { maxCount: 1 },
  transporter: [
    { type: "input", speed: 20 },
    undefined,
    { type: "output", speed: 20 },
    undefined,
  ],
};

export const 直角コンベアL: SUnitOptions = {
  code: "直角コンベアL",
  stack: { maxCount: 1 },
  transporter: [
    { type: "input", speed: 20 },
    undefined,
    undefined,
    { type: "output", speed: 20 },
  ],
};
export const 直角コンベアR: SUnitOptions = {
  code: "直角コンベアR",
  stack: { maxCount: 1 },
  transporter: [
    { type: "input", speed: 20 },
    { type: "output", speed: 20 },
    undefined,
    undefined,
  ],
};

export const カウンター: SUnitOptions = {
  code: "カウンター",
  stack: { maxCount: 1 },
  process: [
    {
      processCode: "kiru",
      requireInteract: true,
      value: 10,
    },
    {
      processCode: "nigiru",
      requireInteract: true,
      value: 10,
    },
  ],
};

export const コンロ: SUnitOptions = {
  code: "コンロ",
  stack: { maxCount: 1 },
  process: [
    {
      processCode: "yaku",
      requireInteract: false,
      value: 10,
    },
  ],
};

export const 自動にぎるくん: SUnitOptions = {
  code: "自動にぎるくん",
  stack: { maxCount: 1 },
  process: [
    {
      processCode: "nigiru",
      requireInteract: false,
      value: 20,
    },
  ],
};

export const ミキサー: SUnitOptions = {
  code: "ミキサー",
  stack: { maxCount: 1 },
  process: [
    {
      processCode: "kiru",
      requireInteract: false,
      value: 20,
    },
  ],
};

export const コンバイナ: SUnitOptions = {
  code: "コンバイナ",
  stack: { maxCount: 1 },
  transporter: [undefined, undefined, undefined, undefined],
  combiner: { count: 1, speed: 30 },
};

export const 売却機: SUnitOptions = {
  code: "売却機",
  stack: { maxCount: 1 },
  process: [{ processCode: "uru", requireInteract: false, value: 7 }],
  transporter: [undefined, undefined, undefined, undefined],
};

export const ダイニングテーブル: SUnitOptions = {
  code: "ダイニングテーブル",
  stack: { maxCount: 1 },
  process: [{ processCode: "taberu", requireInteract: false, value: 7 }],
  transporter: [undefined, undefined, undefined, undefined],
};

export const SushiUnitModels: SUnitModel = {
  マグロ箱,
  サーモン箱,
  えび箱,
  てんぷらこ箱,
  なまたまご箱,
  のり箱,
  すめし箱,
  瓶箱,
  コンベア,
  カウンター,
  コンロ,
  自動にぎるくん,
  ミキサー,
  コンバイナ,
  売却機,
  ダイニングテーブル,
  直角コンベアL,
  直角コンベアR,
};
