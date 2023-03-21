import { useState } from "react";
import { css } from "@emotion/react";
import { SUnitView } from "./components/SUnitView";
import { GameData, GameManager, MapData } from "../sushido";
import { useTimer } from "./util";
import { SObjView } from "./components/SObjView";
import { SUserView } from "./components/SUserView";
import { CustomerView } from "./components/CostomerView";

const appCss = css({
  fontSize: 30,
});

export type GameReport = {};

const defaultGame: GameData = {
  score: 0,
  coin: 0,
  dayCount: 0,
  menuCodes: ["マグロにぎり", "鉄火巻", "ねぎとろ巻き", "ねぎとろ軍艦"],
  dayTime: 60,
  xMax: 6,
  yMax: 6,
  customerSpawnRatio: 0.7,
  customerSpawnInterval: 1,
  maxCustomerCount: 10,
  customerModel: [
    {
      visualCode: "normal",
      maxOrderCount: 3,
      nextOrderRatio: 0.8,
      paymentScale: 1,
      patienceScale: 1,
      eatScale: 1,
      thinkingOrderScale: 1,
      pickWeight: 1,
      moveSpeed: 1,
    },
    {
      visualCode: "dart",
      maxOrderCount: 2,
      nextOrderRatio: 0.75,
      paymentScale: 0.5,
      patienceScale: 1,
      eatScale: 2,
      thinkingOrderScale: 1.5,
      pickWeight: 0.5,
      moveSpeed: 1.5,
    },
    {
      visualCode: "relax",
      maxOrderCount: 5,
      nextOrderRatio: 0.9,
      paymentScale: 1.5,
      patienceScale: 2,
      eatScale: 0.5,
      thinkingOrderScale: 0.5,
      pickWeight: 0.2,
      moveSpeed: 0.75,
    },
  ],
};

const defaultMap: MapData = [
  { code: "マグロ箱", pos: [0, 0], direction: 0 },
  { code: "すめし箱", pos: [1, 0], direction: 0 },
  { code: "コンベア", pos: [0, 1], direction: 0 },
  { code: "コンベア", pos: [2, 0], direction: 3 },
  { code: "コンベア", pos: [2, 1], direction: 0 },
  { code: "コンベア", pos: [2, 3], direction: 0 },
  { code: "自動にぎるくん", pos: [2, 2], direction: 0 },
  { code: "ミキサー", pos: [0, 2], direction: 0 },
  { code: "コンベア", pos: [0, 3], direction: 0 },
  { code: "コンベア", pos: [1, 4], direction: 1 },
  { code: "コンバイナ", pos: [2, 4], direction: 0 },
  { code: "コンベア", pos: [3, 4], direction: 1 },
  { code: "のり箱", pos: [4, 4], direction: 0 },
  { code: "コンバイナ", pos: [0, 4], direction: 0 },
  { code: "コンベア", pos: [0, 5], direction: 0 },
  { code: "売却機", pos: [0, 6], direction: 0 },
  { code: "コンベア", pos: [3, 0], direction: 3 },
  { code: "コンバイナ", pos: [4, 0], direction: 0 },
  { code: "コンベア", pos: [5, 0], direction: 3 },
  { code: "コンバイナ", pos: [6, 0], direction: 0 },
  { code: "コンベア", pos: [7, 0], direction: 1 },
  { code: "マグロ箱", pos: [8, 0], direction: 0 },
  { code: "コンベア", pos: [8, 1], direction: 0 },
  { code: "ミキサー", pos: [8, 2], direction: 0 },
  { code: "コンベア", pos: [7, 2], direction: 1 },
  { code: "コンバイナ", pos: [6, 2], direction: 0 },
  { code: "コンベア", pos: [5, 2], direction: 3 },
  { code: "コンベア", pos: [5, 1], direction: 0 },
  { code: "のり箱", pos: [4, -2], direction: 0 },
  { code: "コンベア", pos: [4, -1], direction: 0 },
  { code: "コンベア", pos: [6, -1], direction: 2 },
  { code: "売却機", pos: [6, -2], direction: 0 },
  { code: "コンベア", pos: [6, 3], direction: 0 },
  { code: "売却機", pos: [6, 4], direction: 0 },
  { code: "えび箱", pos: [2, 6], direction: 0 },
  { code: "コンベア", pos: [3, 6], direction: 3 },
  { code: "コンバイナ", pos: [4, 6], direction: 0 },
  { code: "コンベア", pos: [5, 6], direction: 1 },
  { code: "てんぷらこ箱", pos: [6, 6], direction: 0 },
  { code: "コンベア", pos: [4, 7], direction: 0 },
  { code: "コンベア", pos: [5, 7], direction: 3 },
  { code: "コンロ", pos: [6, 7], direction: 0 },
  { code: "コンベア", pos: [7, 7], direction: 3 },
  { code: "コンバイナ", pos: [8, 7], direction: 0 },
  { code: "コンベア", pos: [9, 7], direction: 1 },
  { code: "自動にぎるくん", pos: [10, 7], direction: 0 },
  { code: "コンベア", pos: [11, 7], direction: 1 },
  { code: "すめし箱", pos: [12, 7], direction: 0 },
  { code: "コンベア", pos: [8, 6], direction: 2 },
  { code: "売却機", pos: [8, 5], direction: 0 },
  { code: "カウンター", pos: [1, 7], direction: 0 },
  { code: "カウンター", pos: [2, 7], direction: 0 },
  { code: "ダイニングテーブル", pos: [2, 9], direction: 0 },
  { code: "ダイニングテーブル", pos: [3, 9], direction: 0 },
  { code: "ダイニングテーブル", pos: [4, 9], direction: 0 },
];

export function App() {
  const [gameManager] = useState(new GameManager(defaultGame, defaultMap));
  const [frame, setFrame] = useState(0);

  const userId = "U-test";

  useTimer(() => {
    gameManager.update(0.2);
    setFrame((f) => f + 1);
  }, 200);

  console.log(gameManager);

  return (
    <div css={appCss}>
      <p>frame:{frame}</p>
      <p>coin:{gameManager.todayCoin}</p>
      <div css={css({ position: "absolute", top: 200 })}>
        {gameManager.fm.sUnitArray.map((unit, i) => (
          <SUnitView
            key={i}
            sUnit={unit}
            releaseFunc={(id: string) => {
              gameManager.emitGameEvent({
                code: "releaseObj",
                userId,
                unitId: id,
                handSide: "RIGHT",
              });
            }}
            startInteract={() => {
              gameManager.emitGameEvent({
                code: "startInteractUnit",
                userId,
                unitId: unit.id,
              });
            }}
            endInteract={() => {
              gameManager.emitGameEvent({
                code: "endInteractUnit",
                userId,
                unitId: unit.id,
              });
            }}
          />
        ))}
        {gameManager.fm.sUnitArray.map((unit, i) => (
          <SObjView
            key={i}
            sUnit={unit}
            getObj={(id) => {
              return gameManager.fm.sObjs.get(id);
            }}
            grabFunc={(id: string) => {
              gameManager.emitGameEvent({
                code: "grabObj",
                handSide: "RIGHT",
                userId,
                objId: id,
              });
            }}
          />
        ))}
        {gameManager.customers.map((customer) => (
          <CustomerView customer={customer} />
        ))}
      </div>

      {gameManager.fm.sUserArray.map((user) => (
        <SUserView user={user} />
      ))}
    </div>
  );
}
