import { useRef, useState } from "react";
import { GifGenerator, GifGeneratorRef } from "./components/GifGenerator";
import AnimationCanvas, { AnimationCanvasRef } from "./components/AnimationCanvas";
import { Button, ColorPicker, Input } from "antd";
import {
  CaretLeftOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import FramesList from "./components/FramesList";

function App() {
  const animationCanvasRef = useRef<AnimationCanvasRef>(null);
  const gifGeneratorRef = useRef<GifGeneratorRef>(null);
  // 帧列表
  const [frames, setFrames] = useState<Record<string, HTMLImageElement>>({});

  // 设置
  const [settings, setSettings] = useState({
    width: 640,
    height: 360,
    fps: 60,
    workers: 2,
    colors: {
      start1: "rgba(255, 0, 0, 0.5)",
      end1: "rgba(0, 0, 255, 0.5)",
      start2: "rgba(255, 0, 255, 0.5)",
      end2: "rgba(0, 255, 0, 0.5)",
    },
    title: {
      text: "你好, 世界!",
      fontFamily: "微软雅黑",
      fontSize: 100,
    },
    subTitle: {
      text: "Powered by 多吃点",
      fontFamily: "微软雅黑",
      fontSize: 22,
    },
  });

  const handlerSettings = (key: string, value: any) => {
    setSettings((settings) => {
      return { ...settings, [key]: value };
    });
  };

  return (
    <div className="flex flex-col gap-6 py-6 items-center text-center">
      <div className="flex flex-col gap-4 min-w-[600px]">
        {/* 基础设置 */}
        <div className="flex flex-col gap-4">
          <div>
            <div className="text-2xl font-bold">基础设置</div>
            <div className="text-gray-500">设置渲染器和 GIF 生成器</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* 画布宽度 */}
            <div className="flex gap-2 items-center">
              <div className="flex-shrink-0">画布宽度：</div>
              <Input
                type="number"
                value={settings.width}
                onChange={(e) => {
                  handlerSettings("width", e.target.value);
                }}
              />
            </div>
            {/* 画布高度 */}
            <div className="flex gap-2 items-center">
              <div className="flex-shrink-0">画布高度：</div>
              <Input
                type="number"
                value={settings.height}
                onChange={(e) => {
                  handlerSettings("height", e.target.value);
                }}
              />
            </div>
          </div>
        </div>
        {/* 背景设置 */}
        <div className="flex flex-col gap-4">
          <div>
            <div className="text-2xl font-bold">背景设置</div>
            <div className="text-gray-500">设置渐变色背景</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* 起始颜色 1 */}
            <div className="flex gap-2 items-center">
              <div className="flex-shrink-0">起始颜色 1：</div>
              <ColorPicker
                showText
                value={settings.colors.start1}
                onChange={(color) => {
                  handlerSettings("colors", {
                    ...settings.colors,
                    start1: color.toHexString(),
                  });
                }}
              />
            </div>
            {/* 结束颜色 1 */}
            <div className="flex gap-2 items-center">
              <div className="flex-shrink-0">结束颜色 1：</div>
              <ColorPicker
                showText
                value={settings.colors.end1}
                onChange={(color) => {
                  handlerSettings("colors", {
                    ...settings.colors,
                    end1: color.toHexString(),
                  });
                }}
              />
            </div>
            {/* 起始颜色 2 */}
            <div className="flex gap-2 items-center">
              <div className="flex-shrink-0">起始颜色 2：</div>
              <ColorPicker
                showText
                value={settings.colors.start2}
                onChange={(color) => {
                  handlerSettings("colors", {
                    ...settings.colors,
                    start2: color.toHexString(),
                  });
                }}
              />
            </div>
            {/* 结束颜色 2 */}
            <div className="flex gap-2 items-center">
              <div className="flex-shrink-0">结束颜色 2：</div>
              <ColorPicker
                showText
                value={settings.colors.end2}
                onChange={(color) => {
                  handlerSettings("colors", {
                    ...settings.colors,
                    end2: color.toHexString(),
                  });
                }}
              />
            </div>
          </div>
        </div>
        {/* 内容设置 */}
        <div className="flex flex-col gap-4">
          <div>
            <div className="text-2xl font-bold">内容设置</div>
            <div className="text-gray-500">设置标题和副标题</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <div className="text-gray-500">标题</div>
              {/* 标题 */}
              <div className="flex gap-2 items-center">
                <div className="flex-shrink-0">标题：</div>
                <Input
                  value={settings.title.text}
                  onChange={(e) => {
                    handlerSettings("title", {
                      ...settings.title,
                      text: e.target.value,
                    });
                  }}
                />
              </div>
              {/* 标题字体 */}
              <div className="flex gap-2 items-center">
                <div className="flex-shrink-0">标题字体：</div>
                <Input
                  value={settings.title.fontFamily}
                  onChange={(e) => {
                    handlerSettings("title", {
                      ...settings.title,
                      fontFamily: e.target.value,
                    });
                  }}
                />
              </div>
              {/* 标题字号 */}
              <div className="flex gap-2 items-center">
                <div className="flex-shrink-0">标题字号：</div>
                <Input
                  type="number"
                  value={settings.title.fontSize}
                  onChange={(e) => {
                    handlerSettings("title", {
                      ...settings.title,
                      fontSize: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-gray-500">副标题</div>
              {/* 副标题 */}
              <div className="flex gap-2 items-center">
                <div className="flex-shrink-0">副标题：</div>
                <Input
                  value={settings.subTitle.text}
                  onChange={(e) => {
                    handlerSettings("subTitle", {
                      ...settings.subTitle,
                      text: e.target.value,
                    });
                  }}
                />
              </div>
              {/* 标题字体 */}
              <div className="flex gap-2 items-center">
                <div className="flex-shrink-0">标题字体：</div>
                <Input
                  value={settings.subTitle.fontFamily}
                  onChange={(e) => {
                    handlerSettings("subTitle", {
                      ...settings.subTitle,
                      fontFamily: e.target.value,
                    });
                  }}
                />
              </div>
              {/* 副标题字号 */}
              <div className="flex gap-2 items-center">
                <div className="flex-shrink-0">副标题字号：</div>
                <Input
                  type="number"
                  value={settings.subTitle.fontSize}
                  onChange={(e) => {
                    handlerSettings("subTitle", {
                      ...settings.subTitle,
                      fontSize: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 渲染器 */}
      <div className="flex flex-col gap-4">
        <div>
          <div className="text-2xl font-bold">渲染器</div>
          <div className="text-gray-500">渲染动画（渲染速度不是最终动画速度）</div>
        </div>
        <AnimationCanvas
          {...settings}
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
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<CaretLeftOutlined />}
            onClick={() => {
              animationCanvasRef.current?.reset();
            }}
          >
            重置
          </Button>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={() => {
              animationCanvasRef.current?.start();
            }}
          >
            开始
          </Button>
          <Button
            type="primary"
            icon={<PauseCircleOutlined />}
            onClick={() => {
              animationCanvasRef.current?.stop();
            }}
          >
            暂停
          </Button>
          <Button
            type="primary"
            icon={<VideoCameraOutlined />}
            onClick={() => {
              setFrames({});
              animationCanvasRef.current?.capture();
            }}
          >
            捕捉
          </Button>
        </div>
      </div>

      {/* 动画帧列表 */}
      <FramesList width={settings.width} height={settings.height} frames={frames} />

      {/* GIF 生成器 */}
      <GifGenerator
        ref={gifGeneratorRef}
        width={settings.width}
        height={settings.height}
        frames={frames}
      />
    </div>
  );
}

export default App;
