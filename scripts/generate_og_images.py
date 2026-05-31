import os
import re
from PIL import Image, ImageDraw, ImageFont

def get_title_from_md(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    match = re.search(r'^title:\s*["\']?(.*?)["\']?$', content, re.MULTILINE)
    if match:
        return match.group(1)
    return None

def create_og_image(output_path, title, subtitle="GrowZen - Where Goodness Gathers, Wisdom Grows"):
    width = 1200
    height = 630

    image = Image.new('RGB', (width, height), color='#fff8f5')
    draw = ImageDraw.Draw(image)

    # Accent background graphics
    draw.ellipse((-100, -100, 300, 300), fill='#fbe4d8')
    draw.ellipse((900, 400, 1400, 900), fill='#fbe4d8')

    # Load fonts
    try:
        font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 60)
        font_medium = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 30)
    except IOError:
        font_large = ImageFont.load_default()
        font_medium = ImageFont.load_default()

    text_color = '#4a2c1a'
    accent_color = '#e8956d'

    # Simple word wrap for title
    if len(title) > 25:
        words = title.split(' ')
        lines = []
        current_line = []
        for word in words:
            current_line.append(word)
            if len(' '.join(current_line)) > 25:
                lines.append(' '.join(current_line))
                current_line = []
        if current_line:
            lines.append(' '.join(current_line))

        y_offset = 250 - (len(lines) * 35)
        for line in lines:
            draw.text((600, y_offset), line, font=font_large, fill=text_color, anchor="mm")
            y_offset += 80
    else:
        draw.text((600, 250), title, font=font_large, fill=text_color, anchor="mm")

    draw.text((600, 450), subtitle, font=font_medium, fill=accent_color, anchor="mm")

    image.save(output_path)
    print(f"Created Open Graph image for '{title}' at {output_path}")

def process_content_dir(content_dir):
    for root, _, files in os.walk(content_dir):
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                title = get_title_from_md(file_path)

                if title:
                    # Create a slugified name for the image
                    slug = re.sub(r'[^a-zA-Z0-9]', '-', title.lower())
                    img_name = f"og-{slug[:30]}.jpg"
                    img_path = os.path.join('assets/img', img_name)

                    if not os.path.exists(img_path):
                        create_og_image(img_path, title)

                        # We also want to update the markdown frontmatter to include the featured image
                        # But Hugo Blowfish uses `feature: ...` in frontmatter or `feature.*` in page bundle.
                        # For simplicity, we just generate the images here.

if __name__ == "__main__":
    # Create default image
    os.makedirs('assets/img', exist_ok=True)
    create_og_image('assets/img/og-default.jpg', "GrowZen", "Where Goodness Gathers, Wisdom Grows")

    # Process all content
    process_content_dir('content')
