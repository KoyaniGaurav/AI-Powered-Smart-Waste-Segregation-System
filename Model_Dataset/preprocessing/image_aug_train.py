import os
import math
import random
from tensorflow.keras.preprocessing.image import ImageDataGenerator, load_img, img_to_array, array_to_img

# =========================
# PATHS
# =========================

train_path = "dataset_split/train"

# target minimum train images per class
TARGET_COUNT = 280

# supported image formats
image_extensions = (".jpg", ".jpeg", ".png", ".webp")

# =========================
# AUGMENTATION SETTINGS
# =========================

datagen = ImageDataGenerator(

    rotation_range=20,
    width_shift_range=0.15,
    height_shift_range=0.15,
    shear_range=0.15,
    zoom_range=0.15,

    horizontal_flip=True,

    brightness_range=[0.8, 1.2],

    fill_mode='nearest'
)

# =========================
# START AUGMENTATION
# =========================

for class_name in os.listdir(train_path):

    class_path = os.path.join(train_path, class_name)

    if os.path.isdir(class_path):

        # get all images
        images = [
            img for img in os.listdir(class_path)
            if img.lower().endswith(image_extensions)
        ]

        current_count = len(images)

        print(f"\nClass: {class_name}")
        print(f"Current Images: {current_count}")

        # skip if already enough
        if current_count >= TARGET_COUNT:

            print("No augmentation needed.")
            continue

        # how many extra images needed
        extra_images_needed = TARGET_COUNT - current_count

        print(f"Extra Images Needed: {extra_images_needed}")

        generated_count = 0

        # keep generating until target reached
        while generated_count < extra_images_needed:

            # randomly select image
            image_name = random.choice(images)

            image_path = os.path.join(class_path, image_name)

            try:

                # load image
                img = load_img(image_path)

                # convert to array
                x = img_to_array(img)

                # reshape for generator
                x = x.reshape((1,) + x.shape)

                # generate augmented image
                aug_iter = datagen.flow(
                    x,
                    batch_size=1
                )

                # get one augmented image
                aug_image = next(aug_iter)[0].astype("uint8")

                # create unique filename
                new_image_name = (
                    f"aug_{generated_count}_{image_name}"
                )

                save_path = os.path.join(
                    class_path,
                    new_image_name
                )

                # save augmented image
                array_to_img(aug_image).save(save_path)

                generated_count += 1

            except Exception as e:

                print(f"Error processing {image_path}")
                print(e)

        print(f"Generated: {generated_count} images")

print("\n===================================")
print("Train Augmentation Completed")
print("===================================")