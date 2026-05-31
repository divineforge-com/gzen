from PIL import Image, ImageDraw, ImageFont

def create_og_image(output_path):
    # Set dimensions for Open Graph image
    width = 1200
    height = 630

    # Create image with warm peach cream background
    image = Image.new('RGB', (width, height), color='#fff8f5')
    draw = ImageDraw.Draw(image)

    # Draw simple gradient or accents (simulated here with a few circles/rectangles)
    # Accent color: #e8956d (saffron)
    draw.ellipse((-100, -100, 300, 300), fill='#fbe4d8')
    draw.ellipse((900, 400, 1400, 900), fill='#fbe4d8')

    # Try to load a font, or use default if none available
    try:
        font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 80)
        font_medium = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 40)
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 30)
    except IOError:
        font_large = ImageFont.load_default()
        font_medium = ImageFont.load_default()
        font_small = ImageFont.load_default()

    # Draw main text
    # Chinese: 善聚慧生
    # English: Where Goodness Gathers, Wisdom Grows
    text_color = '#4a2c1a' # warm dark brown

    # Simple centered text
    draw.text((600, 250), "GrowZen", font=font_large, fill=text_color, anchor="mm")
    draw.text((600, 350), "Where Goodness Gathers, Wisdom Grows", font=font_medium, fill='#e8956d', anchor="mm")
    draw.text((600, 500), "gzen.io", font=font_small, fill=text_color, anchor="mm")

    # Save the image
    image.save(output_path)
    print(f"Created Open Graph image at {output_path}")

create_og_image('assets/img/og-image.jpg')
