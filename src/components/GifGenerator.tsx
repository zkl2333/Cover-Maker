import { ForwardedRef, forwardRef, useImperativeHandle, useState } from "react";
import worker from "gif.js/dist/gif.worker.js?url";
import GIF from "gif.js";
import { Button, Empty, Input, Modal, Progress, Spin, message } from "antd";

interface GifGeneratorProps {
  width: number;
  height: number;
  frames: Record<string, HTMLImageElement>;
}

export interface GifGeneratorRef {
  generate: () => void;
}

export const GifGenerator = forwardRef(
  ({ width, height, frames }: GifGeneratorProps, ref: ForwardedRef<GifGeneratorRef>) => {
    const [settings, setSettings] = useState({
      quality: 10,
      fps: 60,
      workers: 4,
    });

    const [result, setResult] = useState<string>("");

    const [generating, setGenerating] = useState(false);
    const [progress, setProgress] = useState(0);

    const generate = () => {
      if (Object.keys(frames).length === 0) {
        Modal.error({
          title: "错误",
          content: "请先捕捉帧",
          centered: true,
        });
        return;
      }

      setGenerating(true);
      setProgress(0);
      setResult("");

      const gif = new GIF({
        workers: settings.workers,
        quality: settings.quality,
        width: width,
        height: height,
        workerScript: worker,
      });

      Object.keys(frames)
        .map(Number)
        .sort((a, b) => a - b)
        .forEach((index) => {
          const frame = frames[index];
          if (frame) {
            gif.addFrame(frames[index], { delay: 1000 / settings.fps });
          }
        });

      gif.render();
      message.destroy("generate");

      gif.on("finished", function (blob) {
        const url = URL.createObjectURL(blob);
        setResult(url);
        setGenerating(false);
      });

      gif.on("progress", function (p) {
        setProgress(p);
      });
    };

    const handlerSettings = (key: string, value: any) => {
      setSettings((settings) => {
        return { ...settings, [key]: value };
      });
    };

    useImperativeHandle(ref, () => ({
      generate,
    }));

    return (
      <div className="flex flex-col gap-4">
        <div>
          <div className="text-2xl font-bold">GIF 合成器</div>
          <div className="text-gray-500">用于将捕捉的帧合成 GIF</div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* 帧率 */}
          <div className="flex gap-2 items-center">
            <div className="flex-shrink-0">帧率：</div>
            <Input
              type="number"
              value={settings.fps}
              onChange={(e) => {
                handlerSettings("fps", e.target.value);
              }}
            />
          </div>
          {/* 工作线程数 */}
          <div className="flex gap-2 items-center">
            <div className="flex-shrink-0">工作线程数：</div>
            <Input
              type="number"
              value={settings.workers}
              onChange={(e) => {
                handlerSettings("workers", e.target.value);
              }}
            />
          </div>
          {/* 质量 */}
          <div className="flex gap-2 items-center">
            <div className="flex-shrink-0">质量：</div>
            <Input
              type="number"
              value={settings.quality}
              onChange={(e) => {
                handlerSettings("quality", e.target.value);
              }}
            />
          </div>
          <div className="flex gap-2 col-span-2 text-left">
            <Button
              type="primary"
              onClick={() => {
                console.log("generate");
                generate();
              }}
              loading={generating}
            >
              生成 GIF
            </Button>
            <Button
              type="primary"
              onClick={() => {
                const a = document.createElement("a");
                a.href = result;
                a.download = "animation.gif";
                a.click();
              }}
              disabled={!result}
            >
              下载 GIF
            </Button>
          </div>
        </div>

        {
          // 进度条
          progress > 0 && (
            <div className="flex gap-2 items-center">
              <div className="flex-shrink-0">生成进度：</div>
              <Progress percent={parseInt(String(progress * 100))} />
            </div>
          )
        }

        <div
          className="flex items-center justify-center border border-gray-200 rounded-md overflow-auto"
          style={{
            width: width,
            height: height,
          }}
        >
          {result ? (
            <img src={result} alt="GIF" />
          ) : (
            <Empty
              description={
                generating ? (
                  <div className="flex flex-col items-center gap-2">
                    <Spin />
                    <div>生成中...</div>
                  </div>
                ) : (
                  <div>请先生成 GIF</div>
                )
              }
            />
          )}
        </div>
      </div>
    );
  }
);
