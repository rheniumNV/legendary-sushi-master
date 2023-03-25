import { SUnitModel, SUnitOptions } from "../factory/type";

export const マグロ箱: SUnitOptions = {
  code: "マグロ箱",
  stack: { maxCount: 0 },
  generation: { objCode: "マグロ" },
  titleEn: "",
  descriptionEn: "",
  descriptionJa: "マグロが取り出せる",
};

export const サーモン箱: SUnitOptions = {
  code: "サーモン箱",
  stack: { maxCount: 0 },
  generation: { objCode: "サーモン" },
  titleEn: "",
  descriptionEn: "",
  descriptionJa: "サーモンが取り出せる",
};

export const えび箱: SUnitOptions = {
  code: "えび箱",
  stack: { maxCount: 0 },
  generation: { objCode: "えび" },
  titleEn: "",
  descriptionEn: "",
  descriptionJa: "えびが取り出せる",
};

export const たこ箱: SUnitOptions = {
  code: "たこ箱",
  stack: { maxCount: 0 },
  generation: { objCode: "たこ" },
  titleEn: "",
  descriptionEn: "",
  descriptionJa: "たこが取り出せる",
};

export const いか箱: SUnitOptions = {
  code: "いか箱",
  stack: { maxCount: 0 },
  generation: { objCode: "いか" },
  titleEn: "",
  descriptionEn: "",
  descriptionJa: "いかが取り出せる",
};

export const てんぷらこ箱: SUnitOptions = {
  code: "てんぷらこ箱",
  stack: { maxCount: 0 },
  generation: { objCode: "てんぷらこ" },
  titleEn: "",
  descriptionEn: "",
  descriptionJa: "てんぷらこが取り出せる",
};

export const なまたまご箱: SUnitOptions = {
  code: "なまたまご箱",
  stack: { maxCount: 0 },
  generation: { objCode: "なまたまご" },
  titleEn: "",
  descriptionEn: "",
  descriptionJa: "なまたまごが取り出せる",
};

export const のり箱: SUnitOptions = {
  code: "のり箱",
  stack: { maxCount: 0 },
  generation: { objCode: "のり" },
  titleEn: "",
  descriptionEn: "",
  descriptionJa: "のりが取り出せる",
};

export const すめし箱: SUnitOptions = {
  code: "すめし箱",
  stack: { maxCount: 0 },
  generation: { objCode: "すめし" },
  titleEn: "",
  descriptionEn: "",
  descriptionJa: "すめしが取り出せる",
};

export const 瓶箱: SUnitOptions = {
  code: "瓶箱",
  stack: { maxCount: 0 },
  generation: { objCode: "瓶" },
  titleEn: "",
  descriptionEn: "",
  descriptionJa: "茶碗蒸しの茶器が取り出せる",
};

export const アボカド箱: SUnitOptions = {
  code: "アボカド箱",
  stack: { maxCount: 0 },
  generation: { objCode: "アボカド" },
  titleEn: "",
  descriptionEn: "",
  descriptionJa: "アボカドが取り出せる",
};

export const コンベア: SUnitOptions = {
  code: "コンベア",
  stack: { maxCount: 1 },
  transporter: [
    { type: "input", speed: 10 },
    undefined,
    { type: "output", speed: 10 },
    undefined,
  ],
  titleEn: "",
  descriptionEn: "",
  descriptionJa: "矢印の方向にを自動的に移動させる",
};

export const 直角コンベアL: SUnitOptions = {
  code: "直角コンベアL",
  stack: { maxCount: 1 },
  transporter: [
    { type: "input", speed: 10 },
    undefined,
    undefined,
    { type: "output", speed: 10 },
  ],
  titleEn: "",
  descriptionEn: "",
  descriptionJa: "左に曲がるコンベア",
};
export const 直角コンベアR: SUnitOptions = {
  code: "直角コンベアR",
  stack: { maxCount: 1 },
  transporter: [
    { type: "input", speed: 10 },
    { type: "output", speed: 10 },
    undefined,
    undefined,
  ],
  titleEn: "",
  descriptionEn: "",
  descriptionJa: "右に曲がるコンベア",
};
export const コンベア_Lv2: SUnitOptions = {
  code: "コンベア_Lv2",
  stack: { maxCount: 1 },
  transporter: [
    { type: "input", speed: 20 },
    undefined,
    { type: "output", speed: 20 },
    undefined,
  ],
  titleEn: "",
  descriptionEn: "",
  descriptionJa: "矢印の方向にを自動的に移動させる",
};

export const 直角コンベアL_Lv2: SUnitOptions = {
  code: "直角コンベアL_Lv2",
  stack: { maxCount: 1 },
  transporter: [
    { type: "input", speed: 10 },
    undefined,
    undefined,
    { type: "output", speed: 10 },
  ],
  titleEn: "",
  descriptionEn: "",
  descriptionJa: "左に曲がるコンベア",
};
export const 直角コンベアR_Lv2: SUnitOptions = {
  code: "直角コンベアR_Lv2",
  stack: { maxCount: 1 },
  transporter: [
    { type: "input", speed: 10 },
    { type: "output", speed: 10 },
    undefined,
    undefined,
  ],
  titleEn: "",
  descriptionEn: "",
  descriptionJa: "右に曲がるコンベア",
};
export const カウンター: SUnitOptions = {
  code: "カウンター",
  stack: { maxCount: 1 },
  process: [
    {
      processCode: "kiru",
      requireInteract: true,
      value: 5,
    },
    {
      processCode: "nigiru",
      requireInteract: true,
      value: 5,
    },
  ],
  titleEn: "",
  descriptionEn: "",
  descriptionJa: "調理(切る / 握る)を行える",
};

export const コンロ: SUnitOptions = {
  code: "コンロ",
  stack: { maxCount: 1 },
  process: [
    {
      processCode: "yaku",
      requireInteract: false,
      value: 5,
    },
  ],
  titleEn: "",
  descriptionEn: "",
  descriptionJa: "調理(加熱) を行える",
};

export const 自動にぎるくん: SUnitOptions = {
  code: "自動にぎるくん",
  stack: { maxCount: 1 },
  process: [
    {
      processCode: "nigiru",
      requireInteract: false,
      value: 15,
    },
  ],
  titleEn: "",
  descriptionEn: "",
  descriptionJa: "自動化ツール: 調理(握る)を行える",
};

export const ミキサー: SUnitOptions = {
  code: "ミキサー",
  stack: { maxCount: 1 },
  process: [
    {
      processCode: "kiru",
      requireInteract: false,
      value: 15,
    },
  ],
  titleEn: "",
  descriptionEn: "",
  descriptionJa: "調理(切る)を行える",
};

export const コンベアミキサー: SUnitOptions = {
  code: "コンベアミキサー",
  stack: { maxCount: 1 },
  process: [
    {
      processCode: "kiru",
      requireInteract: false,
      value: 15,
    },
  ],
  transporter: [
    { type: "input", speed: 10 },
    undefined,
    { type: "output", speed: 10 },
    undefined,
  ],
  titleEn: "",
  descriptionEn: "",
  descriptionJa: "ミキサーにコンベアの機能を付加したユニット",
};
export const コンベア自動にぎるくん: SUnitOptions = {
  code: "コンベア自動にぎるくん",
  stack: { maxCount: 1 },
  process: [
    {
      processCode: "nigiru",
      requireInteract: false,
      value: 15,
    },
  ],
  transporter: [
    { type: "input", speed: 10 },
    undefined,
    { type: "output", speed: 10 },
    undefined,
  ],
  titleEn: "",
  descriptionEn: "",
  descriptionJa: "自動にぎる君にコンベアの機能を付加したユニット",
};
export const コンベアコンロ: SUnitOptions = {
  code: "コンベアコンロ",
  stack: { maxCount: 1 },
  process: [
    {
      processCode: "yaku",
      requireInteract: false,
      value: 5,
    },
  ],
  transporter: [
    { type: "input", speed: 10 },
    undefined,
    { type: "output", speed: 10 },
    undefined,
  ],
  titleEn: "",
  descriptionEn: "",
  descriptionJa: "コンロにコンベアの機能を付加したユニット",
};

export const コンバイナ: SUnitOptions = {
  code: "コンバイナ",
  stack: { maxCount: 1 },
  transporter: [undefined, undefined, undefined, undefined],
  combiner: { count: 1, speed: 30 },
  titleEn: "",
  descriptionEn: "",
  descriptionJa: "自動化ツール: 二種類の素材を組み合わせる",
};

export const コンベアコンバイナ: SUnitOptions = {
  code: "コンベアコンバイナ",
  stack: { maxCount: 1 },
  transporter: [
    { type: "input", speed: 10 },
    { type: "input", speed: 10 },
    { type: "input", speed: 10 },
    { type: "output", speed: 10 },
  ],
  combiner: { count: 1, speed: 30 },
  titleEn: "",
  descriptionEn: "",
  descriptionJa: "コンバイナにコンベアの機能を付加したユニット",
};

export const 売却機: SUnitOptions = {
  code: "売却機",
  stack: { maxCount: 1 },
  process: [{ processCode: "uru", requireInteract: false, value: 2 }],
  transporter: [undefined, undefined, undefined, undefined],
  titleEn: "",
  descriptionEn: "",
  descriptionJa: "完成品を売却できる",
};

export const ダイニングテーブル: SUnitOptions = {
  code: "ダイニングテーブル",
  stack: { maxCount: 1 },
  process: [{ processCode: "taberu", requireInteract: false, value: 7 }],
  transporter: [undefined, undefined, undefined, undefined],
  titleEn: "",
  descriptionEn: "",
  descriptionJa: "お客さんが座るところ",
};

export const ゴミ箱: SUnitOptions = {
  code: "ゴミ箱",
  stack: { maxCount: 0 },
  delete: { addCoin: 0 },
  titleEn: "",
  descriptionEn: "",
  descriptionJa: "誤って作成した場合に破棄する箱",
};

export const ネオロイド箱: SUnitOptions = {
  code: "ネオロイド箱",
  stack: { maxCount: 0 },
  delete: { addCoin: 1 },
  titleEn: "",
  descriptionEn: "",
  descriptionJa: "",
};

export const SushiUnitModels: SUnitModel = {
  マグロ箱,
  サーモン箱,
  えび箱,
  たこ箱,
  いか箱,
  てんぷらこ箱,
  なまたまご箱,
  のり箱,
  すめし箱,
  瓶箱,
  アボカド箱,
  カウンター,
  コンロ,
  自動にぎるくん,
  ミキサー,
  コンベアミキサー,
  コンベア自動にぎるくん,
  コンベアコンロ,
  コンベアコンバイナ,
  コンバイナ,
  売却機,
  ダイニングテーブル,
  コンベア,
  直角コンベアL,
  直角コンベアR,
  コンベア_Lv2,
  直角コンベアL_Lv2,
  直角コンベアR_Lv2,
  ゴミ箱,
  ネオロイド箱,
};
