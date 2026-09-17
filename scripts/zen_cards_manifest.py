# Script to generate Zen card images via Agy
# We generate them sequentially or in batches and convert to webp

CARDS = [
    ("zen-001", "The Anchor Breath", "An antique iron anchor resting softly on a sun-dappled mossy sea bed beneath crystal clear turquoise shallow water, gentle caustics, tranquil, serene, Buddhist stillness"),
    ("zen-002", "Silent Mountain", "Majestic misty mountain peak at dawn with morning clouds drifting below, immovable dignity, Japanese sumi-e style mixed with modern soft digital painting, peaceful solitary mountain"),
    ("zen-003", "The Second Arrow", "A single traditional bamboo archery arrow resting harmlessly on a mossy stone by a quiet forest brook, dappled sunlight, letting go of struggle, pure tranquility"),
    ("zen-004", "Clear Water", "A smooth round ceramic bowl of mirror-still crystal clear spring water on a weathered wooden deck, reflecting cherry blossom branches and sky, settled sediment"),
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
