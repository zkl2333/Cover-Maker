// 创建Pixi应用
// const app = new PIXI.Application({
//   width: 400,
//   height: 300,
//   backgroundColor: 0x1099bb,
// });
async function main() {
  const app = new PIXI.Application();
  await app.init({ width: 400, height: 300 });
  document.getElementById("pixi-container").appendChild(app.canvas);

  // 创建背景
  const bg = new PIXI.Graphics();
  bg.rect(0, 0, app.screen.width, app.screen.height);
  bg.fill(0x1099bb);
  app.stage.addChild(bg);

  // 创建动画精灵等初始化设置
  await PIXI.Assets.load("./assets/bunny.png");
  let sprite = PIXI.Sprite.from("./assets/bunny.png");
  sprite.anchor.set(0.5);
  sprite.width = 100;
  sprite.height = 100;
  sprite.x = app.screen.width / 2;
  sprite.y = app.screen.height / 2;
  app.stage.addChild(sprite);

  // 创建GIF实例
  var gif = new GIF({
    workers: 2,
    quality: 10,
    workerScript: "./script/gif.worker.js",
  });

  let frameCount = 0;
  const totalFrames = 60; // 总帧数，根据需要调整

  app.ticker.add(async (ticker) => {
    // 动画更新
    sprite.rotation += (2 * Math.PI) / 60;

    if (frameCount < totalFrames) {
      const image = await app.renderer.extract.image(app.stage);
      image.style.width = "80px";
      image.style.height = "60px";
      gif.addFrame(image, { delay: 1000 / 60 });
      document.getElementById("frame-list").appendChild(image);

      frameCount++;
    } else {
      // 动画结束，生成GIF
      gif.render();
      app.ticker.stop();
    }
  });

  gif.on("finished", function (blob) {
    // 创建一个链接来下载GIF
    const url = URL.createObjectURL(blob);
    // const link = document.createElement("a");
    // link.href = url;
    // link.textContent = "download the GIF";
    // link.download = "myAnimation.gif";
    // document.body.appendChild(link);

    const img = new Image();
    img.src = url;
    img.style.width = "400px";
    img.style.height = "300px";
    document.body.appendChild(img);
  });
}

main();
