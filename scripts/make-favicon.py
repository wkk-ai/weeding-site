from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
WINE = (92, 61, 74, 255)
GOLD = (196, 165, 116, 255)


def ring_icon(size: int, rounded: bool) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    if rounded:
        draw.rounded_rectangle(
            [0, 0, size - 1, size - 1],
            radius=max(4, round(size * 0.22)),
            fill=WINE,
        )
    else:
        draw.rectangle([0, 0, size - 1, size - 1], fill=WINE)

    if size <= 16:
        stroke = 2
        radius = 4.2
        offset = 3.1
    else:
        stroke = max(2, round(size * 0.075))
        radius = size * 0.22
        offset = size * 0.125

    cy = size / 2
    for cx in (size / 2 - offset, size / 2 + offset):
        draw.ellipse(
            [cx - radius, cy - radius, cx + radius, cy + radius],
            outline=GOLD,
            width=stroke,
        )
    return img


def save_ico(path: Path) -> None:
    source = ring_icon(256, rounded=False)
    source.save(
        path,
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
    )


def main() -> None:
    app = ROOT / "src" / "app"
    public = ROOT / "public"
    mockups = ROOT / "mockups"
    app.mkdir(parents=True, exist_ok=True)
    public.mkdir(parents=True, exist_ok=True)
    mockups.mkdir(parents=True, exist_ok=True)

    ico = app / "favicon.ico"
    save_ico(ico)
    save_ico(public / "favicon.ico")
    save_ico(mockups / "favicon.ico")

    apple = ring_icon(180, rounded=True)
    apple.save(app / "apple-icon.png", "PNG")
    apple.save(public / "apple-icon.png", "PNG")
    apple.save(mockups / "apple-icon.png", "PNG")

    svg = (app / "icon.svg").read_text()
    (public / "icon.svg").write_text(svg)
    (mockups / "favicon.svg").write_text(svg)


if __name__ == "__main__":
    main()
