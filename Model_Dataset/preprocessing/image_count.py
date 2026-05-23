import os

# dataset folder path
dataset_path = "E:\AI-Powered Smart Waste Segregation & Recycling Analysis System\dataset_split\\train"

# supported image extensions
image_extensions = (".jpg", ".jpeg", ".png", ".bmp", ".webp")

# dictionary to store counts
class_counts = {}

# loop through each class folder
for class_name in os.listdir(dataset_path):

    class_path = os.path.join(dataset_path, class_name)

    # check if it is a folder
    if os.path.isdir(class_path):

        count = 0

        # count images
        for file in os.listdir(class_path):
            if file.lower().endswith(image_extensions):
                count += 1

        class_counts[class_name] = count

# print results
print("\nImage Count Per Class:\n")

for class_name, count in sorted(class_counts.items()):
    print(f"{class_name} --> {count} images")

# total images
total_images = sum(class_counts.values())

print(f"\nTotal Images in Dataset: {total_images}")