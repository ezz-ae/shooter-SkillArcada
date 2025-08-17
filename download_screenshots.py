import os
import re
import requests

def download_and_replace_images(readme_path="README.md", output_dir="docs/screenshots"):
    """
    Downloads images from Firebase Storage links in a README.md file,
    saves them to a specified directory, and updates the README.md with
    relative paths.

    Args:
        readme_path (str): The path to the README.md file.
        output_dir (str): The directory to save the downloaded screenshots.
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    with open(readme_path, "r", encoding="utf-8") as f:
        readme_content = f.read()

    # Find all image tags with Firebase Storage URLs
    img_tags = re.findall(r'<img src="(https://firebasestorage.googleapis.com/[^"]+)" alt="([^"]+)"', readme_content)

    for url, alt_text in img_tags:
        try:
            response = requests.get(url, stream=True)
            response.raise_for_status()  # Raise an exception for bad status codes

            # Sanitize the alt text to create a valid filename
            filename = re.sub(r'[^\w\-_\. ]', '', alt_text).replace(' ', '_') + ".png"
            filepath = os.path.join(output_dir, filename)

            with open(filepath, 'wb') as img_file:
                for chunk in response.iter_content(chunk_size=8192):
                    img_file.write(chunk)

            # Replace the original URL with the relative path in the README content
            relative_path = os.path.relpath(filepath, os.path.dirname(readme_path))
            readme_content = readme_content.replace(url, relative_path)
            print(f"Downloaded and replaced: {alt_text} -> {relative_path}")

        except requests.exceptions.RequestException as e:
            print(f"Error downloading image from {url}: {e}")
        except Exception as e:
            print(f"An unexpected error occurred: {e}")

    # Write the updated README content back to the file
    with open(readme_path, "w", encoding="utf-8") as f:
        f.write(readme_content)
    print("README.md updated with relative paths.")

if __name__ == "__main__":
    download_and_replace_images()