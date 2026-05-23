import os
from PIL import Image
import imagehash

dataset_path = "E:\AI-Powered Smart Waste Segregation & Recycling Analysis System\dataset_split\\train"

# supported image formats
image_extensions = (".jpg", ".jpeg", ".png", ".webp")

# store hashes
hashes = {}

# store duplicate pairs
duplicates = []

# count removed files
removed_count = 0
print("Processing...")
for class_name in os.listdir(dataset_path):

    class_path = os.path.join(dataset_path, class_name)

    if os.path.isdir(class_path):

        for file in os.listdir(class_path):

            if file.lower().endswith(image_extensions):

                file_path = os.path.join(class_path, file)

                try:
                    # open image
                    img = Image.open(file_path)

                    # generate perceptual hash
                    img_hash = imagehash.phash(img)

                    # duplicate found
                    if img_hash in hashes:

                        original_file = hashes[img_hash]

                        duplicates.append((file_path, original_file))

                        # REMOVE duplicate image
                        os.remove(file_path)

                        removed_count += 1

                        print(f"Removed Duplicate:")
                        print(f"Deleted : {file_path}")
                        print(f"Original: {original_file}\n")

                    else:
                        hashes[img_hash] = file_path

                except Exception as e:
                    print(f"Error processing {file_path} -> {e}")

print("\n===================================")
print(f"Total Duplicates Removed: {removed_count}")
print("===================================")