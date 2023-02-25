import _ from "lodash";
import { SObjModel } from "../factory/type";

export const combineRecipe = [
  {
    inputs: ["シャリ", "マグロ"],
    code: "マグロにぎり",
    scale: 1,
  },
  {
    inputs: ["シャリ", "サーモン"],
    code: "サーモンにぎり",
    scale: 1,
  },
  {
    inputs: ["のり", "シャリ"],
    code: "軍艦シャリ",
    scale: 1,
  },
  {
    inputs: ["のり", "すめし"],
    code: "のりすめし",
    scale: 1,
  },
  {
    inputs: ["ねぎとろ", "軍艦シャリ"],
    code: "ねぎとろ軍艦",
    scale: 1,
  },
  {
    inputs: ["のりすめし", "ねぎとろ"],
    code: "ねぎとろ巻き",
    scale: 1,
  },
  {
    inputs: ["のりすめし", "マグロ"],
    code: "鉄火巻",
    scale: 1,
  },
  {
    inputs: ["シャリ", "たまごやき"],
    code: "たまごシャリ",
    scale: 1,
  },
  {
    inputs: ["たまごシャリ", "のり"],
    code: "たまごにぎり",
    scale: 1,
  },
  {
    inputs: ["軍艦シャリ", "たまごやき"],
    code: "たまごにぎり",
    scale: 1,
  },
  {
    inputs: ["えび", "シャリ"],
    code: "えびにぎり",
    scale: 1,
  },
  {
    inputs: ["ときたまご", "てんぷらこ"],
    code: "てんぷらこときたまご",
    scale: 1,
  },
  {
    inputs: ["てんぷらこときたまご", "えび"],
    code: "えびてんぷらこときたまご",
    scale: 1,
  },
  {
    inputs: ["えびてん", "シャリ"],
    code: "えびてんにぎり",
    scale: 1,
  },
  {
    inputs: ["瓶", "ときたまご"],
    code: "ときたまご入りの瓶",
    scale: 1,
  },
  {
    inputs: ["ときたまご入りの瓶", "えび"],
    code: "えびとときたまご入りの瓶",
    scale: 1,
  },
  {
    inputs: ["えび", "マヨネーズ"],
    code: "えびマヨ",
    scale: 1,
  },
  {
    inputs: ["えびマヨ", "軍艦シャリ"],
    code: "えびマヨ軍艦",
    scale: 1,
  },
  {
    inputs: ["ツナ", "マヨネーズ"],
    code: "ツナマヨ",
    scale: 1,
  },
  {
    inputs: ["ツナマヨ", "軍艦シャリ"],
    code: "ツナマヨ軍艦",
    scale: 1,
  },
  {
    inputs: ["アボカド", "サーモン"],
    code: "アボカドサーモン",
    scale: 1,
  },
  {
    inputs: ["アボカドサーモン", "のりすめし"],
    code: "カリフォルニアロール",
    scale: 1,
  },
];

export const SushiObjModels = {
  ...getRecips("マグロ", {
    kiru: { output: { type: "transform", code: "ねぎとろ" }, scale: 1 },
    yaru: { output: { type: "transform", code: "ツナ" }, scale: 1 },
  }),
  ...getRecips("サーモン"),
  ...getRecips("すめし", {
    nigiru: { output: { type: "transform", code: "シャリ" }, scale: 1.5 },
  }),
  ...getRecips("シャリ"),
  ...getRecips("マグロにぎり", {
    uru: { output: { type: "coin", value: 10 }, scale: 3 },
    taberu: { output: { type: "coin", value: 10 }, scale: 3 },
  }),
  ...getRecips("サーモンにぎり", {
    uru: { output: { type: "coin", value: 10 }, scale: 3 },
    taberu: { output: { type: "coin", value: 10 }, scale: 3 },
    yaku: {
      output: { type: "transform", code: "あぶりサーモンにぎり" },
      scale: 10,
    },
  }),
  ...getRecips("あぶりサーモンにぎり", {
    uru: { output: { type: "coin", value: 10 }, scale: 3 },
    taberu: { output: { type: "coin", value: 10 }, scale: 3 },
  }),
  ...getRecips("なまたまご", {
    nigiru: { output: { type: "transform", code: "ときたまご" }, scale: 6 },
  }),
  ...getRecips("ときたまご", {
    yaku: { output: { type: "transform", code: "たまごやき" }, scale: 3 },
    kiru: { output: { type: "transform", code: "マヨネーズ" }, scale: 0.5 },
  }),
  ...getRecips("マヨネーズ"),
  ...getRecips("たまごやき"),
  ...getRecips("たまごシャリ"),
  ...getRecips("たまごにぎり", {
    uru: { output: { type: "coin", value: 10 }, scale: 3 },
    taberu: { output: { type: "coin", value: 10 }, scale: 3 },
  }),
  ...getRecips("ねぎとろ"),
  ...getRecips("のり"),
  ...getRecips("軍艦シャリ"),
  ...getRecips("ねぎとろ軍艦", {
    uru: { output: { type: "coin", value: 10 }, scale: 3 },
    taberu: { output: { type: "coin", value: 10 }, scale: 3 },
  }),
  ...getRecips("のりすめし"),
  ...getRecips("ねぎとろ巻き", {
    uru: { output: { type: "coin", value: 10 }, scale: 3 },
    taberu: { output: { type: "coin", value: 10 }, scale: 3 },
  }),
  ...getRecips("鉄火巻", {
    uru: { output: { type: "coin", value: 10 }, scale: 3 },
    taberu: { output: { type: "coin", value: 10 }, scale: 3 },
  }),
  ...getRecips("えび"),
  ...getRecips("てんぷらこ"),
  ...getRecips("てんぷらこときたまご"),
  ...getRecips("えびてんぷらこときたまご", {
    yaku: { output: { type: "transform", code: "えびてん" }, scale: 0.5 },
  }),
  ...getRecips("えびてん", {
    uru: { output: { type: "coin", value: 10 }, scale: 3 },
    taberu: { output: { type: "coin", value: 10 }, scale: 3 },
  }),
  ...getRecips("えびにぎり", {
    uru: { output: { type: "coin", value: 10 }, scale: 3 },
    taberu: { output: { type: "coin", value: 10 }, scale: 3 },
  }),
  ...getRecips("えびてんにぎり", {
    uru: { output: { type: "coin", value: 10 }, scale: 3 },
    taberu: { output: { type: "coin", value: 10 }, scale: 3 },
  }),
  ...getRecips("瓶"),
  ...getRecips("ときたまご入りの瓶"),
  ...getRecips("えびとときたまご入りの瓶", {
    yaku: { output: { type: "transform", code: "茶碗蒸し" }, scale: 0.3 },
  }),
  ...getRecips("茶碗蒸し", {
    uru: { output: { type: "coin", value: 10 }, scale: 3 },
    taberu: { output: { type: "coin", value: 10 }, scale: 3 },
  }),
  ...getRecips("えびマヨ"),
  ...getRecips("えびマヨ軍艦", {
    uru: { output: { type: "coin", value: 10 }, scale: 3 },
    taberu: { output: { type: "coin", value: 10 }, scale: 3 },
  }),
  ...getRecips("ツナ"),
  ...getRecips("ツナマヨ"),
  ...getRecips("ツナマヨ軍艦", {
    uru: { output: { type: "coin", value: 10 }, scale: 3 },
    taberu: { output: { type: "coin", value: 10 }, scale: 3 },
  }),
  ...getRecips("アボカドサーモン"),
  ...getRecips("カリフォルニアロール", {
    uru: { output: { type: "coin", value: 10 }, scale: 3 },
    taberu: { output: { type: "coin", value: 10 }, scale: 3 },
  }),
};

export type SObjProcessModel = {
  output: { type: "transform"; code: string } | { type: "coin"; value: number };
  scale: number;
};

function getRecips(
  code: string,
  process: {
    [key: string]: SObjProcessModel;
  } = {}
): SObjModel {
  const recipe = combineRecipe
    .filter(({ inputs }) => inputs.includes(code))
    .map(({ inputs, code: recipeCode, scale }) => {
      const ii = inputs.filter((c) => c !== code);
      console.log(code, ii);
      return ii.length > 0
        ? {
            input: ii[0],
            code: recipeCode,
            scale,
          }
        : undefined;
    })
    .filter((v) => v);
  return {
    [code]: {
      code,
      process,
      recipe: _.reduce(
        recipe,
        (curr, { input, code, scale }: any) => ({
          ...curr,
          ...(input ? { [input]: { code, scale } } : {}),
        }),
        {}
      ),
    },
  };
}
