import { useRef, useState } from "react";

import AnimationCanvas, { AnimationCanvasRef } from "./components/AnimationCanvas";
import "./App.css";
import { GifGenerator, GifGeneratorRef } from "./components/GifGenerator";

function App() {
  const animationCanvasRef = useRef<AnimationCanvasRef>(null);
  const gifGeneratorRef = useRef<GifGeneratorRef>(null);
  // 帧列表
  const [frames, setFrames] = useState<HTMLImageElement[]>([]);
  // gif 结果
  const [gifResult, setGifResult] = useState<string | null>(null);

  return (
    <>
      <div>
        渲染器：
        <AnimationCanvas
          ref={animationCanvasRef}
          onFrame={(image) => {
            setFrames((frames) => [...frames, image]);
          }}
          onCompleted={() => {
            console.log("completed");
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
        </div>
      </div>
      <GifGenerator
        ref={gifGeneratorRef}
        width={400}
        height={300}
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
