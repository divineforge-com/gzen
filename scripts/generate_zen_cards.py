import os
import subprocess
import time

CARDS = [
    ("zen-005", "The Sacred Pause", "The calm quiet space between rolling ocean waves at twilight, silky water surface, golden horizon light, deep rhythmic breathing, absolute stillness"),
    ("zen-006", "River Log", "A smooth weathered cedar log floating effortlessly down a calm winding forest river, dappled golden sunlight, surrendered to the natural current"),
    ("zen-007", "Autumn Leaf", "A single golden-red Japanese maple leaf floating gently down through soft autumn light over a mossy Zen garden stone, graceful transition"),
    ("zen-008", "Transient Cloud", "A solitary soft luminous white cumulus cloud floating across a vast calm pastel twilight sky, impermanence, vast open space"),
    ("zen-009", "The Uncarved Block", "A natural rustic uncarved block of aromatic cedar wood resting on tatami mat, raw simplicity, wabi-sabi essence, warm soft sunlight"),
    ("zen-010", "Morning Dew", "A single glistening luminous morning dewdrop resting on a vibrant green lotus leaf, refracting the rising golden sun like a diamond, fleeting beauty"),
    ("zen-011", "The Empty Cup", "A handmade rustic ceramic tea cup sitting empty on a dark slate tray, steam rising gently into morning light, open vessel, readiness"),
    ("zen-012", "Beginner's Mind", "Fresh clean washi calligraphy paper on a wooden desk with a single moist ink brush and smooth stone inkwell, boundless possibility, pure potential"),
    ("zen-013", "Silent Bell", "An ancient bronze temple singing bowl sitting on a silk brocade cushion, silent resonant serenity, peaceful temple garden in background"),
    ("zen-014", "Unburdened Hands", "Two gentle open human hands resting palm-up in a meditation mudra, bathed in warm gentle morning light, releasing all attachments, total freedom"),
    ("zen-015", "The Mirror Mind", "A pristine circular bronze water mirror reflecting the clear open sky and bamboo stalks without clinging or distorting, crystal clarity"),
    ("zen-016", "Gentle Lamp", "A traditional Japanese washi paper and bamboo lantern emitting warm soft amber candlelight in a twilight garden, unconditional gentle glow"),
    ("zen-017", "Indra's Net", "A delicate spider web at dawn covered in dewdrops, each droplet reflecting all the other droplets in an infinite luminous web of connection, cosmic harmony"),
    ("zen-018", "Compassionate Ear", "A tranquil listening pavilion beside a singing stream and gentle wind chimes in bamboo grove, mindful deep listening, serene forest haven"),
    ("zen-019", "Rooted Bamboo", "A cluster of supple green bamboo stalks bending gracefully in a gentle mountain breeze, rooted deep in mossy earth, resilient flexibility"),
    ("zen-020", "The Lotus Root", "A pure radiant white and pink sacred lotus blossom blooming above still pond water with green lily pads, purity born from muddy depths, enlightenment")
]

OUT_DIR = "/home/divineforge/development/gzen/apps/gzen/public/assets/cards"
os.makedirs(OUT_DIR, exist_ok=True)

for card_id, title, desc in CARDS:
    webp_path = os.path.join(OUT_DIR, f"{card_id}.webp")
    if os.path.exists(webp_path):
        print(f"[{card_id}] already exists, skipping.")
        continue

    png_path = os.path.join(OUT_DIR, f"{card_id}.png")
    prompt = (
        f"Generate an image using generate_image tool.\n\n"
        f"Prompt: A serene, peaceful Zen minimalist 4:3 digital painting of {title}. {desc}. "
        f"Peaceful Buddhist aesthetic, tranquil, harmonious, contemplative, beautiful soft lighting, no text, no letters, no UI frame, pure meditative art.\n"
        f"Save destination: Save the generated image file to {png_path}\n"
    )

    print(f"[{card_id}] Generating {title}...", flush=True)
    cmd = ["/home/divineforge/.local/bin/agy", "--print", prompt, "--dangerously-skip-permissions"]
    try:
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=90)
    except subprocess.TimeoutExpired:
        print(f"[{card_id}] Timed out after 90s, continuing...", flush=True)
        continue

    if os.path.exists(png_path):
        cwebp_cmd = ["cwebp", "-q", "85", png_path, "-o", webp_path]
        subprocess.run(cwebp_cmd, capture_output=True)
        if os.path.exists(webp_path):
            os.remove(png_path)
            print(f"[{card_id}] SUCCESS -> {webp_path}", flush=True)
    else:
        print(f"[{card_id}] Failed. agy stdout: {res.stdout[:150]} stderr: {res.stderr[:150]}", flush=True)

    time.sleep(2)

print("Batch generation completed.", flush=True)
