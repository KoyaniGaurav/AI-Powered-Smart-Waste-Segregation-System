import os
import shutil
from sklearn.model_selection import train_test_split

# original dataset path
dataset_path = "dataset"

# output split dataset path
output_path = "dataset_split"

# split ratios
train_ratio = 0.75
val_ratio = 0.10
test_ratio = 0.15

# image formats
image_extensions = (".jpg", ".jpeg", ".png", ".webp")

# create split folders
for split in ["train", "val", "test"]:
    os.makedirs(os.path.join(output_path, split), exist_ok=True)

# loop through each class
for class_name in os.listdir(dataset_path):

    class_path = os.path.join(dataset_path, class_name)

    if os.path.isdir(class_path):

        # get all image files
        images = [
            img for img in os.listdir(class_path)
            if img.lower().endswith(image_extensions)
        ]

        # shuffle + split
        train_images, temp_images = train_test_split(
            images,
            test_size=(1 - train_ratio),
            random_state=42
        )

        val_size_adjusted = val_ratio / (val_ratio + test_ratio)

        val_images, test_images = train_test_split(
            temp_images,
            test_size=(1 - val_size_adjusted),
            random_state=42
        )

        # create class folders
        for split in ["train", "val", "test"]:
            os.makedirs(
                os.path.join(output_path, split, class_name),
                exist_ok=True
            )

        # helper function
        def copy_images(image_list, split_name):

            for image in image_list:

                src = os.path.join(class_path, image)

                dst = os.path.join(
                    output_path,
                    split_name,
                    class_name,
                    image
                )

                shutil.copy2(src, dst)

        # copy files
        copy_images(train_images, "train")
        copy_images(val_images, "val")
        copy_images(test_images, "test")

        # print stats
        print(f"\n{class_name}")
        print(f"Train : {len(train_images)}")
        print(f"Val   : {len(val_images)}")
        print(f"Test  : {len(test_images)}")

print("\n===================================")
print("Dataset Split Completed Successfully")
print("===================================")