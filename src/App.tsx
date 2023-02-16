import { useState } from "react";
import { css } from "@emotion/react";
import { SUnitView } from "./components/SUnitView";
import { GameManager } from "./sushido/GameManager";
import { useTimer } from "./util";
import { SObjView } from "./components/SObjView";
import { SObjModels } from "./sushido/models/SObjModels";
import { SUserView } from "./components/SUserView";

const appCss = css({
  fontSize: 30,
});

export function App() {
  const [gameManager] = useState(new GameManager());
  const [frame, setFrame] = useState(0);

  const userId = "U-test";

  useTimer(() => {
    gameManager.update(0.02);
    setFrame((f) => f + 1);
  }, 20);

  // console.log(gameManager, SObjModels);

  return (
    <div css={appCss}>
      <p>frame:{frame}</p>
      <p>coin:{gameManager.coin}</p>
      <div css={css({ position: "absolute", top: 200 })}>
        {gameManager.sUnitArray.map((unit, i) => (
          <SUnitView
            key={i}
            sUnit={unit}
            releaseFunc={(id: string) => {
              gameManager.releaseObj(userId, id);
            }}
            startInteract={() => {
              gameManager.startInteractUnit(userId, unit.id);
            }}
            endInteract={() => {
              gameManager.endInteractUnit(userId, unit.id);
            }}
          />
        ))}
        {gameManager.sUnitArray.map((unit, i) => (
          <SObjView
            key={i}
            sUnit={unit}
            getObj={(id) => {
              return gameManager.sObjs.get(id);
            }}
            grabFunc={(id: string) => {
              gameManager.grabObj(userId, id);
            }}
          />
        ))}
      </div>
      {gameManager.sUserArray.map((user) => (
        <SUserView user={user} />
      ))}
    </div>
  );
}
