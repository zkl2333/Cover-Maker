import {
  Sprite,
  DisplacementFilter,
  Application,
  Container,
  Texture,
  FillGradient,
  TextStyle,
  Text,
} from "pixi.js";
import "pixi.js/advanced-blend-modes";

export function addDisplacementEffect(app: Application) {
  // 从预加载的位移资源创建一个精灵。
  const sprite = Sprite.from("displacement");

  // 将基础纹理包裹模式设置为重复，以允许纹理 UV 平铺和重复。
  sprite.texture.source.addressMode = "repeat";

  // 使用精灵纹理创建位移过滤器。
  const filter = new DisplacementFilter({
    sprite,
    scale: 50,
    width: app.screen.width,
    height: app.screen.height,
  });

  // 将过滤器添加到舞台上。
  app.stage.filters = [filter];
}

// 创建动画背景
export async function addBackground(app: Application) {
  // 创建容器并将其添加到舞台
  const container = new Container();

  // 对角线长度
  const diagonal = Math.sqrt(app.screen.width ** 2 + app.screen.height ** 2);

  // canvas 纹理
  const createCanvasSprite = (color1: string, color2: string) => {
    const canvas = document.createElement("canvas");
    canvas.width = diagonal;
    canvas.height = diagonal;
    const ctx = canvas.getContext("2d")!;

    const gradient = ctx.createLinearGradient(0, 0, diagonal, diagonal);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, diagonal, diagonal);

    const texture = Texture.from(canvas);

    const sprite = new Sprite(texture);
    sprite.anchor.set(0.5);
    sprite.x = app.screen.width / 2;
    sprite.y = app.screen.height / 2;

    return sprite;
  };

  const sprite1 = createCanvasSprite("rgba(255, 0, 0, 0.5)", "rgba(0, 0, 255, 0.5)");
  const sprite2 = createCanvasSprite("rgba(255, 0, 255, 0.5)", "rgba(0, 255, 0, 0.5)");
  sprite2.blendMode = "negation";

  app.ticker.add(() => {
    sprite1.rotation += Math.PI / 30;
    sprite2.rotation -= Math.PI / 15;
  });

  container.addChild(sprite1, sprite2);
  app.stage.addChild(container);
}

// 添加文字
export async function addText(app: Application, text: string) {
  const style = new TextStyle({
    fontFamily: "Arial",
    fontSize: 56,
    // fontStyle: "italic",
    fontWeight: "bold",
    fill: "white",
    // stroke: { color: "#FFFFFF", width: 1, join: "round" },
    dropShadow: {
      color: "#333",
      blur: 8,
      angle: Math.PI / 6,
      distance: 6,
    },
    wordWrap: true,
    wordWrapWidth: 440,
  });

  const richText = new Text({
    text: text,
    style,
  });

  richText.x = app.screen.width / 2;
  richText.y = app.screen.height / 2;
  richText.anchor.set(0.5);

  app.stage.addChild(richText);
}
