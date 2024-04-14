import { Empty } from "antd";

interface FramesListProps {
  width: number;
  height: number;
  frames: Record<string, HTMLImageElement>;
}

const FramesList = ({ width, height, frames }: FramesListProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-2xl font-bold">动画帧列表</div>
        <div className="text-gray-500">查看动画帧</div>
      </div>

      {Object.keys(frames).length > 0 ? (
        <div
          className="p-4 grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2 grid-flow-row auto-rows-max  
          border border-gray-200 rounded-md overflow-auto"
          style={{
            width,
            height,
          }}
        >
          {Object.keys(frames)
            .map(Number)
            .sort((a, b) => a - b)
            .map((key) => (
              <div key={key}>
                <img src={frames[key].src} alt={key.toString()} />
                <div className="text-xs">第{key}帧</div>
              </div>
            ))}
        </div>
      ) : (
        <div
          className="flex justify-center items-center border border-gray-200 rounded-md"
          style={{
            width,
            height,
          }}
        >
          <Empty description="请先捕捉动画帧" />
        </div>
      )}
    </div>
  );
};

export default FramesList;
