import { useRef, useState } from "react";
import { GifGenerator, GifGeneratorRef } from "./components/GifGenerator";
import AnimationCanvas, { AnimationCanvasRef } from "./components/AnimationCanvas";
import "./App.css";

function App() {
  const animationCanvasRef = useRef<AnimationCanvasRef>(null);
  const gifGeneratorRef = useRef<GifGeneratorRef>(null);
  // 帧列表
  const [frames, setFrames] = useState<Record<string, HTMLImageElement>>({});
  // gif 结果
  const [gifResult, setGifResult] = useState<string | null>(null);

  return (
    <>
      <div>
        渲染器：
        <AnimationCanvas
          width={450}
          height={253}
          ref={animationCanvasRef}
          onFrame={(currentFrame, image) => {
            setFrames((frames) => {
              return { ...frames, [currentFrame]: image };
            });
          }}
          onCompleted={() => {
            // console.log("completed");
          }}
        />
        <div>
          <button
            onClick={() => {
              animationCanvasRef.current?.start();
            }}
          >
            开始
          </button>
          <button
            onClick={() => {
              animationCanvasRef.current?.stop();
            }}
          >
            停止
          </button>
        </div>
      </div>
      <GifGenerator
        ref={gifGeneratorRef}
        width={450}
        height={253}
        frames={frames}
        delay={1000 / 60}
        onCompleted={(url) => {
          setGifResult(url);
        }}
      />
      <div>
        <button
          onClick={() => {
            gifGeneratorRef.current?.generate();
          }}
        >
          生成 GIF
        </button>
      </div>
      <div>{gifResult && <img src={gifResult} alt="gif" />}</div>
    </>
  );
}

export default App;
