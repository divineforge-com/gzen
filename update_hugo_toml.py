import re

with open('hugo.toml', 'r') as f:
    content = f.read()

# Add Open Graph params to default config
if 'defaultSocialImage' not in content:
    replacement = '''[params]
  # These are read by our custom partials, not by Blowfish directly
  brand          = "GrowZen"
  brandSubtitle  = "聚善"
  brandTagline   = "禅生定，定生慧"
  lotusEmoji     = "🪷"

  # Default image for social sharing (Open Graph and Twitter Cards)
  defaultSocialImage = "img/og-image.jpg"
  defaultAppearance = "light"
'''
    content = re.sub(r'\[params\]\n.*?lotusEmoji.*?=.*?"🪷"', replacement, content, flags=re.DOTALL)

    with open('hugo.toml', 'w') as f:
        f.write(content)
    print("Updated hugo.toml with defaultSocialImage")
else:
    print("hugo.toml already contains defaultSocialImage")
