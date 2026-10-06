"""Convert images scraped from stylemart.sg (media-raw/) into web-ready WebP in public/media/."""
from pathlib import Path
from PIL import Image

RAW = Path("media-raw")
OUT = Path("public/media")
OUT.mkdir(parents=True, exist_ok=True)

# source file -> (output name, max long edge)
MAP = {
    # products: studio shots, front + alternate
    **{f"{i}.png": (f"product-p{i}", 900) for i in range(2, 15)},
    **{f"{i}.1.png": (f"product-p{i}-close", 600) for i in (1, 2, 3, 5, 6, 7, 11, 13)},
    "10.2.png": ("product-p10-close", 600),
    "look1.png": ("product-p1", 900),
    # editorial campaign
    "Copy-of-IMG_0279.jpg": ("editorial-gramophone", 2000),
    "Copy-of-IMG_0427-1-scaled.jpg": ("editorial-reclining", 2200),
    "Copy-of-IMG_9889-a-a-a.jpg": ("editorial-trio", 1500),
    "accessories.jpg": ("editorial-bride-red", 2000),
    "mens-wear.jpg": ("editorial-menswear", 2000),
    "services.jpg": ("editorial-gown-black", 2000),
    "mobileviewbanner-1.png": ("editorial-veil-portrait", 1334),
    "stylemartbanner-1.jpg": ("editorial-create-your-style", 1920),
    "Stylemark_0002.jpg": ("editorial-blush-lengha", 600),
    # runway
    "SSR_00482.jpg": ("runway-finale-menswear", 1500),
    "SSR_00559.jpg": ("runway-garden-1", 1500),
    "SSR_00563.jpg": ("runway-garden-2", 1500),
    "SSR_00592.jpg": ("runway-lineup-1", 1500),
    "SSR_00597.jpg": ("runway-lineup-2", 1500),
    "IMG_0546.jpg": ("runway-kl-1", 1500),
    "IMG_0984.jpg": ("runway-kl-shawl", 1500),
    "IMG_1019.jpg": ("runway-kl-couple", 1500),
    "IMG_1195.jpg": ("runway-kl-black", 1500),
    # Kavita
    "kavita-professional.jpg": ("kavita-portrait", 768),
    "SSR_3519.jpg": ("kavita-runway-bow", 726),
    "SSR_3540.jpg": ("kavita-runway-speech", 708),
    "1384145590_scan0012.jpg": ("press-kavita-feature", 1280),
    "1384145534_scan0003.jpg": ("press-kavita-profile", 1280),
    # store
    "history.jpg": ("store-interior", 1433),
    "kavita3.jpg": ("store-boutique", 344),
    # press / magazines / papers
    "1384145517_scan0001.jpg": ("press-sg-indian-entrepreneurs", 1280),
    "1384145541_scan0004.jpg": ("press-shopping-with-style", 1280),
    "1384145598_scan0013.jpg": ("press-magazine-gown", 1280),
    "1384145620_scan0014.jpg": ("press-a-love-affair", 1280),
    "1384145673_scan0015.jpg": ("press-runway-spread-1", 1280),
    "1384145683_scan0016.jpg": ("press-runway-spread-2", 1280),
    "1384145693_scan0017.jpg": ("press-runway-spread-3", 1280),
    "1384145714_scan0018.jpg": ("press-style-mistress", 1280),
    "1384145727_scan0019.jpg": ("press-looks-talking", 1280),
    "1384145935_scan0007.jpg": ("press-service-with-style", 1280),
    "1384145949_scan0008.jpg": ("press-cool-silks", 1280),
    "1388976460_scan0011.jpg": ("press-straits-times-money", 1280),
    "1384146204_today_paper12.jpg": ("press-today-paper", 1920),
}

total = 0
for src, (name, edge) in MAP.items():
    im = Image.open(RAW / src)
    im = im.convert("RGBA" if im.mode in ("RGBA", "LA", "P") else "RGB")
    if im.mode == "RGBA" and im.getextrema()[3][0] == 255:
        im = im.convert("RGB")
    im.thumbnail((edge, edge), Image.LANCZOS)
    out = OUT / f"{name}.webp"
    im.save(out, "WEBP", quality=80, method=6)
    total += out.stat().st_size
    print(f"{name:34} {im.size[0]}x{im.size[1]}")

logo = Image.open(RAW / "logo.png").convert("RGBA")
logo.save(OUT / "logo.png", optimize=True)
print(f"total {total/1e6:.1f} MB")
