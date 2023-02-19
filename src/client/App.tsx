import { useState } from "react";
import { css } from "@emotion/react";
import { SUnitView } from "./components/SUnitView";
import { GameManager } from "../sushido";
import { useTimer } from "./util";
import { SObjView } from "./components/SObjView";
import { SUserView } from "./components/SUserView";
import { CustomerView } from "./components/CostomerView";

const appCss = css({
  fontSize: 30,
});

export function App() {
  const [gameManager] = useState(new GameManager());
  const [frame, setFrame] = useState(0);

  const userId = "U-test";

  useTimer(() => {
    gameManager.update(0.2);
    setFrame((f) => f + 1);
  }, 200);

  // console.log(gameManager, SObjModels);

  return (
    <div css={appCss}>
      <p>frame:{frame}</p>
      <p>coin:{gameManager.coin}</p>
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
