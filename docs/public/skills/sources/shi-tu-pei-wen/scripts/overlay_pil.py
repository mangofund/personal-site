#!/usr/bin/env python3
"""overlay_pil.py — PIL 叠字兜底：Playwright 跑不通时用。

把标题叠在一张真实照片底部深色带上，出 PNG。
只做兜底，没有版式；能跑 Playwright 就不要走这条路。
用法：python3 overlay_pil.py --image 图.jpg --title 标题 --out 输出.png [--width 2100] [--height 900]
"""
import argparse
from PIL import Image, ImageDraw, ImageFont

FONT = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"


def wrap(draw, text, font, max_w):
    lines, cur = [], ""
    for ch in text:
        if draw.textlength(cur + ch, font=font) <= max_w:
            cur += ch
        else:
            lines.append(cur)
            cur = ch
    if cur:
        lines.append(cur)
    return lines


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--image", required=True)
    ap.add_argument("--title", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--width", type=int, default=2100)
    ap.add_argument("--height", type=int, default=900)
    a = ap.parse_args()

    im = Image.open(a.image).convert("RGB")
    # 等比裁切，铺满画板
    tw, th = a.width, a.height
    scale = max(tw / im.width, th / im.height)
    im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    x = (im.width - tw) // 2
    y = (im.height - th) // 2
    im = im.crop((x, y, x + tw, y + th))

    band_h = int(th * 0.42)
    band = Image.new("RGBA", (tw, band_h), (20, 18, 15, 225))
    im = im.convert("RGBA")
    im.alpha_composite(band, (0, th - band_h))
    im = im.convert("RGB")

    draw = ImageDraw.Draw(im)
    size = 92 if tw >= 2000 else 64
    font = ImageFont.truetype(FONT, size)
    lines = wrap(draw, a.title, font, tw - 2 * 90)
    lh = int(size * 1.35)
    total = lh * len(lines)
    top = th - band_h + (band_h - total) // 2
    for i, line in enumerate(lines):
        draw.text((90, top + i * lh), line, font=font, fill=(245, 239, 227))
    im.save(a.out)
    print(f"已出图：{a.out}（{tw}x{th}，PIL 兜底）")


if __name__ == "__main__":
    main()
