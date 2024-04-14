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
export async function addBackground(
  app: Application,
  colors: {
    start1: string;
    start2: string;
    end1: string;
    end2: string;
  }
) {
  console.log("colors", colors);
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

  // const sprite1 = createCanvasSprite("rgba(255, 0, 0, 0.5)", "rgba(0, 0, 255, 0.5)");
  const sprite1 = createCanvasSprite(colors.start1, colors.end1);
  // const sprite2 = createCanvasSprite("rgba(255, 0, 255, 0.5)", "rgba(0, 255, 0, 0.5)");
  const sprite2 = createCanvasSprite(colors.start2, colors.end2);
  sprite2.blendMode = "negation";

  app.ticker.add(() => {
    sprite1.rotation += Math.PI / 30;
    sprite2.rotation -= Math.PI / 15;
  });

  container.addChild(sprite1, sprite2);
  app.stage.addChild(container);
}

// 添加文字
export async function addText(
  app: Application,
  title: {
    text: string;
    fontFamily: string;
    fontSize: number;
  },
  subTitle: {
    text: string;
    fontFamily: string;
    fontSize: number;
  }
) {
  const LINE_HEIGHT = 1.4;
  const totalHeight = title.fontSize * LINE_HEIGHT + subTitle.fontSize * LINE_HEIGHT;
  const titleTop = app.screen.height / 2 - totalHeight / 2;
  const subTitleTop = titleTop + title.fontSize * LINE_HEIGHT;

  if (title.text) {
    const titleStyle = new TextStyle({
      fontFamily: title.fontFamily,
      lineHeight: LINE_HEIGHT,
      fontSize: title.fontSize,
      fontWeight: "bold",
      fill: "white",
      dropShadow: {
        color: "#333",
        blur: 8,
        angle: Math.PI / 6,
        distance: 6,
      },
      // wordWrap: true,
      wordWrapWidth: 440,
    });

    const richText = new Text({
      text: title.text,
      style: titleStyle,
    });

    richText.x = app.screen.width / 2;
    richText.y = titleTop;
    richText.anchor.set(0.5, 0);
    app.stage.addChild(richText);
  }

  if (subTitle.text) {
    const subTitleStyle = new TextStyle({
      fontFamily: subTitle.fontFamily,
      fontSize: subTitle.fontSize,
      lineHeight: LINE_HEIGHT,
      fill: "white",
      dropShadow: {
        color: "#333",
        blur: 8,
        angle: Math.PI / 6,
        distance: 6,
      },
      // wordWrap: true,
      wordWrapWidth: 440,
    });

    const richText = new Text({
      text: subTitle.text,
      style: subTitleStyle,
    });

    richText.x = app.screen.width / 2;
    richText.y = subTitleTop;
    richText.anchor.set(0.5, 0);
    app.stage.addChild(richText);
  }
}
