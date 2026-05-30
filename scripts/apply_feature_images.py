import os
import re

def add_feature_img_to_frontmatter(content_dir):
    for root, _, files in os.walk(content_dir):
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Check if it already has a feature or featured image
                if re.search(r'^feature:.*$', content, re.MULTILINE) or re.search(r'^images:.*$', content, re.MULTILINE):
                    continue

                match = re.search(r'^title:\s*["\']?(.*?)["\']?$', content, re.MULTILINE)
                if match:
                    title = match.group(1)
                    slug = re.sub(r'[^a-zA-Z0-9]', '-', title.lower())
                    img_name = f"img/og-{slug[:30]}.jpg"

                    # Ensure image exists
                    if os.path.exists(os.path.join('assets', img_name)):
                        # Add to frontmatter
                        updated_content = re.sub(
                            r'(^title:.*?$)',
                            f'\\1\nfeature: {img_name}',
                            content,
                            flags=re.MULTILINE
                        )

                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(updated_content)
                        print(f"Added feature image to {file_path}")

add_feature_img_to_frontmatter('content')
