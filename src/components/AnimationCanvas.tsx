import { useRef, useEffect, useImperativeHandle, forwardRef, ForwardedRef } from "react";
import { Application, Assets } from "pixi.js";
import displacement_map from "@/assets/displacement_map.png";
import { addBackground, addText } from "../utils";

async function preload() {
  // 创建要加载的资产数据数组。
  const assets = [
    {
      alias: "displacement",
      src: displacement_map,
    },
  ];

  // 加载上面定义的资源。
  await Assets.load(assets);
}

interface AnimationCanvasProps {
  width: number;
  height: number;
  onFrame: (_currentFrame: number, frame: HTMLImageElement) => void;
  onCompleted: () => void;
}

export interface AnimationCanvasRef {
  start: () => void;
  stop: () => void;
}

const AnimationCanvas = forwardRef(function (
  { width, height, onFrame, onCompleted }: AnimationCanvasProps,
  ref: ForwardedRef<AnimationCanvasRef>
) {
  const DivRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);

  const setup = async () => {
    if (!DivRef.current) return;
    if (appRef.current) return;

    const app = new Application();
    appRef.current = app;

    await app.init({
      antialias: true,
      width,
      height,
      useBackBuffer: true,
      autoStart: false,
    });

    DivRef.current.appendChild(app.canvas);
  };

  const render = async () => {
    if (appRef.current) return;

    await setup();
    await preload();

    const app = appRef.current!;
    addBackground(app);
    // addDisplacementEffect(app);
    addText(app, "多吃点!");

    const totleFrames = 60 * 1;
    let currentFrame = 0;

    app.ticker.add(async () => {
      currentFrame += 1;
      if (currentFrame > totleFrames) {
        app.ticker.stop();
        onCompleted();
      } else {
        const _currentFrame = currentFrame;
        const image = await app.renderer.extract.image({
          target: app.stage,
          frame: app.screen,
        });
        console.log("currentFrame", _currentFrame);
        onFrame(_currentFrame, image);
      }
    });
  };

  useEffect(() => {
    render();
  }, []);

  useImperativeHandle(ref, () => ({
    start() {
      console.log("start");
      if (appRef.current) {
        appRef.current.ticker.start();
      }
    },
    stop() {
      console.log("stop");
      if (appRef.current) {
        appRef.current.ticker.stop();
      }
    },
  }));

  return <div ref={DivRef} />;
});

export default AnimationCanvas;
