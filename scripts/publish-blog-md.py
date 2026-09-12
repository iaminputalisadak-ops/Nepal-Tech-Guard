"""Convert frontend/public/blog/*.md into blog-posts.json and unique cover JPGs."""
from __future__ import annotations

import html
import json
import os
import re
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    Image = None

ROOT = Path(__file__).resolve().parents[1]
BLOG_DIR = ROOT / "frontend" / "public" / "blog"
JSON_PATHS = [
    ROOT / "frontend" / "public" / "blog-posts.json",
    ROOT / "frontend" / "dist" / "assets" / "blog-posts.json",
]
UPLOAD_DIRS = [
    ROOT / "frontend" / "dist" / "uploads",
    ROOT / "frontend" / "public" / "uploads",
]

THEMES = {
    "ai-automation-small-business-2026": ((29, 78, 216), "AI"),
    "ai-chatbot-vs-human-support": ((124, 58, 237), "Support"),
    "business-process-automation": ((8, 145, 178), "Automate"),
    "choose-software-development-company": ((15, 23, 42), "Hiring"),
    "custom-software-vs-off-the-shelf": ((202, 138, 4), "Software"),
    "digital-transformation-small-business": ((22, 163, 74), "Digital"),
    "scalable-ecommerce-website": ((234, 88, 12), "Ecommerce"),
    "website-development-cost-2026": ((220, 38, 38), "Cost"),
    "website-not-converting": ((219, 39, 119), "Conversion"),
}


def parse_frontmatter(text: str) -> tuple[dict, str]:
    if not text.startswith("---"):
        return {}, text
    parts = text.split("---", 2)
    if len(parts) < 3:
        return {}, text
    meta: dict = {}
    tags: list[str] = []
    in_tags = False
    for raw in parts[1].splitlines():
        line = raw.rstrip()
        if in_tags:
            if line.startswith("  - "):
                tags.append(line[4:].strip().strip('"'))
                continue
            in_tags = False
        if not line or line.startswith("#"):
            continue
        if line.strip() == "tags:":
            in_tags = True
            continue
        if ":" not in line:
            continue
        key, val = line.split(":", 1)
        meta[key.strip()] = val.strip().strip('"')
    if tags:
        meta["tags"] = tags
    return meta, parts[2].lstrip("\n")


def inline(s: str) -> str:
    s = html.escape(s)
    s = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)", r"<em>\1</em>", s)
    s = re.sub(r"`([^`]+)`", r"<code>\1</code>", s)
    s = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2">\1</a>', s)
    return s


def table_html(rows: list[str]) -> str:
    body = []
    header = None
    for row in rows:
        cells = [c.strip() for c in row.strip().strip("|").split("|")]
        if all(re.fullmatch(r":?-{3,}:?", c.replace(" ", "")) for c in cells):
            continue
        tag = "th" if header is None else "td"
        body.append("<tr>" + "".join(f"<{tag}>{inline(c)}</{tag}>" for c in cells) + "</tr>")
        if header is None:
            header = True
    if not body:
        return ""
    head, *rest = body
    return "<table><thead>" + head + "</thead><tbody>" + "".join(rest) + "</tbody></table>"


def md_to_html(md: str, title: str) -> str:
    cut = re.split(r"\n## Meta Information\s*\n", md, maxsplit=1)
    md = cut[0]
    md = md.replace("## Internal Linking Suggestions", "## Related guides")
    md = re.sub(r"^# .+\n+", "", md, count=1)
    lines = md.replace("\r\n", "\n").split("\n")
    out: list[str] = []
    i = 0
    para: list[str] = []
    list_buf: list[str] = []
    list_tag = ""
    table_buf: list[str] = []

    def flush_para():
        if para:
            out.append("<p>" + inline(" ".join(para)) + "</p>")
            para.clear()

    def flush_list():
        nonlocal list_tag
        if list_buf:
            out.append(f"<{list_tag}>" + "".join(f"<li>{inline(x)}</li>" for x in list_buf) + f"</{list_tag}>")
            list_buf.clear()
            list_tag = ""

    def flush_table():
        if table_buf:
            out.append(table_html(table_buf))
            table_buf.clear()

    while i < len(lines):
        line = lines[i]
        if line.startswith("```"):
            flush_para(); flush_list(); flush_table()
            i += 1
            code = []
            while i < len(lines) and not lines[i].startswith("```"):
                code.append(html.escape(lines[i]))
                i += 1
            out.append("<pre><code>" + "\n".join(code) + "</code></pre>")
            i += 1
            continue
        if re.match(r"^\|.+\|$", line.strip()):
            flush_para(); flush_list()
            table_buf.append(line)
            i += 1
            continue
        flush_table()
        if line.strip() == "---":
            flush_para(); flush_list()
            i += 1
            continue
        h = re.match(r"^(#{2,3})\s+(.+)$", line)
        if h:
            flush_para(); flush_list()
            level = len(h.group(1))
            out.append(f"<h{level}>{inline(h.group(2))}</h{level}>")
            i += 1
            continue
        ul = re.match(r"^[-*]\s+(.+)$", line)
        if ul:
            flush_para()
            if list_tag and list_tag != "ul":
                flush_list()
            list_tag = "ul"
            list_buf.append(ul.group(1))
            i += 1
            continue
        ol = re.match(r"^\d+\.\s+(.+)$", line)
        if ol:
            flush_para()
            if list_tag and list_tag != "ol":
                flush_list()
            list_tag = "ol"
            list_buf.append(ol.group(1))
            i += 1
            continue
        if not line.strip():
            flush_para(); flush_list()
            i += 1
            continue
        flush_list()
        para.append(line.strip())
        i += 1
    flush_para(); flush_list(); flush_table()
    return "\n".join(out)


def wrap_text(draw, text, font, max_w):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if draw.textlength(trial, font=font) <= max_w:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines[:4]


def make_cover(path: Path, title: str, tag: str, color: tuple[int, int, int]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if Image is None:
        # SVG fallback if Pillow is missing
        svg = path.with_suffix(".svg")
        r, g, b = color
        svg.write_text(
            f'<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">'
            f'<rect width="1200" height="630" fill="rgb({r},{g},{b})"/>'
            f'<text x="80" y="120" fill="#fff" font-size="28" font-family="Arial">NEPAL TECHGUARD · {html.escape(tag.upper())}</text>'
            f'<text x="80" y="280" fill="#fff" font-size="48" font-family="Arial">{html.escape(title[:60])}</text>'
            f"</svg>",
            encoding="utf-8",
        )
        return
    img = Image.new("RGB", (1200, 630), color)
    draw = ImageDraw.Draw(img)
    # overlay panel
    r, g, b = color
    draw.rectangle((0, 0, 1200, 630), fill=(max(0, r - 20), max(0, g - 20), max(0, b - 30)))
    draw.rectangle((0, 0, 18, 630), fill=(255, 255, 255))
    try:
        font_lg = ImageFont.truetype("arialbd.ttf", 54)
        font_sm = ImageFont.truetype("arial.ttf", 26)
        font_tag = ImageFont.truetype("arialbd.ttf", 22)
    except OSError:
        font_lg = font_sm = font_tag = ImageFont.load_default()
    draw.text((72, 70), "NEPAL TECHGUARD", fill=(255, 255, 255), font=font_sm)
    draw.text((72, 112), tag.upper(), fill=(255, 255, 255), font=font_tag)
    y = 200
    for line in wrap_text(draw, title, font_lg, 1040):
        draw.text((72, y), line, fill=(255, 255, 255), font=font_lg)
        y += 70
    draw.text((72, 560), "shop.hedztech.com/blog", fill=(230, 237, 246), font=font_sm)
    img.save(path, "JPEG", quality=88)


def main() -> None:
    existing = []
    src = ROOT / "frontend" / "public" / "blog-posts.json"
    if src.exists():
        existing = json.loads(src.read_text(encoding="utf-8"))

    skip_slugs = set()
    new_posts = []
    for md_path in sorted(BLOG_DIR.glob("*.md")):
        meta, body = parse_frontmatter(md_path.read_text(encoding="utf-8"))
        slug = md_path.stem
        skip_slugs.add(slug)
        title = meta.get("title") or slug
        desc = meta.get("description") or title
        cover_name = Path(meta.get("cover") or f"/uploads/blog-{slug}.jpg").name
        cover = "/uploads/" + cover_name
        theme, tag = THEMES.get(slug, ((29, 78, 216), (meta.get("tags") or ["Guide"])[0]))
        html_body = md_to_html(body, title)
        new_posts.append({
            "slug": slug,
            "title": title,
            "description": desc,
            "cover": cover,
            "publishedAt": meta.get("publishedAt") or "2026-09-12",
            "tags": meta.get("tags") or ["Guide"],
            "html": html_body,
        })
        for folder in UPLOAD_DIRS:
            make_cover(folder / cover_name, title, tag, theme)
        print("published", slug, "html", len(html_body), "cover", cover_name)

    kept = [p for p in existing if p.get("slug") not in skip_slugs]
    posts = new_posts + kept
    posts.sort(key=lambda p: (p.get("publishedAt") or "", p.get("slug") or ""), reverse=True)
    payload = json.dumps(posts, ensure_ascii=False, indent=2)
    for dest in JSON_PATHS:
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(payload, encoding="utf-8")
        print("wrote", dest, "posts", len(posts))


if __name__ == "__main__":
    main()
