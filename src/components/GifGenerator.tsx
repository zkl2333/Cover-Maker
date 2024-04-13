import { ForwardedRef, forwardRef, useImperativeHandle } from "react";
import worker from "gif.js/dist/gif.worker.js?url";
import GIF from "gif.js";

interface GifGeneratorProps {
  width: number;
  height: number;
  frames: Record<string, HTMLImageElement>;
  delay: number;
  onCompleted: (url: string) => void;
}

export interface GifGeneratorRef {
  generate: () => void;
}

export const GifGenerator = forwardRef(
  (
    { width, height, frames, delay, onCompleted }: GifGeneratorProps,
    ref: ForwardedRef<GifGeneratorRef>
  ) => {
    useImperativeHandle(ref, () => ({
      generate: () => {
        const gif = new GIF({
          workers: 4,
          quality: 10,
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
              console.log("add frame", index, delay);
              gif.addFrame(frames[index], { delay });
            }
          });

        gif.render();

        gif.on("finished", function (blob) {
          const url = URL.createObjectURL(blob);
          onCompleted(url);
        });
      },
    }));

    return <></>;
  }
);
