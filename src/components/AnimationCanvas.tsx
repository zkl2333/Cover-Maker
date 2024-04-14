import { useRef, useEffect, useImperativeHandle, forwardRef, ForwardedRef } from "react";
import { Application } from "pixi.js";
import { addBackground, addText } from "../utils";
import { Empty } from "antd";

interface RunderProps {
  width: number;
  height: number;
  colors: any;
  title: any;
  subTitle: any;
}

interface AnimationCanvasProps extends RunderProps {
  onFrame: (_currentFrame: number, frame: HTMLImageElement) => void;
  onCompleted: () => void;
}

export interface AnimationCanvasRef {
  start: () => void;
  stop: () => void;
  reset: () => void;
  capture: () => void;
}

const AnimationCanvas = forwardRef(function (
  { width, height, colors, title, subTitle, onFrame }: AnimationCanvasProps,
  ref: ForwardedRef<AnimationCanvasRef>
) {
  const DivRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);

  const setup = async (div: HTMLDivElement, { width, height }: RunderProps) => {
    console.log("setup");
    appRef.current?.destroy();
    const app = new Application();
    await app.init({
      antialias: true,
      width,
      height,
      useBackBuffer: true,
    });
    appRef.current = app;
    // 清空容器
    div.innerHTML = "";
    div.appendChild(app.canvas);
    return app;
  };

  const render = async (runderProps: RunderProps) => {
    if (!DivRef.current) return;
    const app = await setup(DivRef.current, runderProps);
    addBackground(app, colors);
    addText(app, title, subTitle);
  };

  useEffect(() => {
    render({
      width,
      height,
      colors,
      title,
      subTitle,
    });
  }, [width, height, colors, title, subTitle]);

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
    reset() {
      console.log("reset");
      render({
        width,
        height,
        colors,
        title,
        subTitle,
      });
    },
    async capture() {
      console.log("capture");

      const totleFrames = 60 * 1;
      let currentFrame = 0;

      const app = appRef.current!;

      app.ticker.add(async () => {
        currentFrame += 1;
        if (currentFrame > totleFrames) {
          // app.ticker.stop();
        } else {
          const _currentFrame = currentFrame;
          const image = await app.renderer.extract.image({
            target: app.stage,
            frame: app.screen,
          });
          onFrame(_currentFrame, image);
        }
      });
    },
  }));

  return (
    <div
      ref={DivRef}
      className="flex justify-center items-center"
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <Empty />
    </div>
  );
});

export default AnimationCanvas;
