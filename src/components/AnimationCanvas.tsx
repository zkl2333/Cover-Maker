import { useRef, useEffect, useImperativeHandle, forwardRef, ForwardedRef } from "react";
import { Application, Graphics, Sprite, Assets } from "pixi.js";
import reactLogo from "@/assets/react.svg";

interface AnimationCanvasProps {
  onFrame: (frames: HTMLImageElement) => void;
  onCompleted: () => void;
}

export interface AnimationCanvasRef {
  start: () => void;
  stop: () => void;
}

const AnimationCanvas = forwardRef(function (
  { onFrame, onCompleted }: AnimationCanvasProps,
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
      width: 400,
      height: 300,
      autoStart: false,
    });

    DivRef.current.appendChild(app.canvas);

    // 创建背景
    const bg = new Graphics();
    bg.rect(0, 0, app.screen.width, app.screen.height);
    bg.fill(0x1099bb);
    app.stage.addChild(bg);

    // 创建动画精灵等初始化设置
    await Assets.load(reactLogo);
    let sprite = Sprite.from(reactLogo);
    sprite.anchor.set(0.5);
    sprite.width = 100;
    sprite.height = 100;
    sprite.x = app.screen.width / 2;
    sprite.y = app.screen.height / 2;
    app.stage.addChild(sprite);

    let frameCount = 0;
    const totalFrames = 60;

    app.ticker.add(async () => {
      // 动画更新
      sprite.rotation += (2 * Math.PI) / 60;
      frameCount++;

      if (frameCount < totalFrames) {
        const image = await app.renderer.extract.image(app.stage);
        onFrame(image);
      } else {
        app.ticker.stop();
        onCompleted();
      }
    });
  };

  useEffect(() => {
    setup();
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
