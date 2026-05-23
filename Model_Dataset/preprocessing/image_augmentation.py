import os
from tensorflow.keras.preprocessing.image import ImageDataGenerator, load_img, img_to_array
from PIL import Image


dataset_path = r"E:\AI-Powered Smart Waste Segregation & Recycling Analysis System\dataset\Augmentation"

datagen = ImageDataGenerator(
    rotation_range=25,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    brightness_range=[0.7, 1.3],
    fill_mode='nearest'
)

augment_count = 5

valid_extensions = ('.jpg', '.jpeg', '.png')


for root, dirs, files in os.walk(dataset_path):
     for file in files:

        if file.lower().endswith(valid_extensions):

            image_path = os.path.join(root, file)

            try:
                # Load image
                img = load_img(image_path)

                # Convert to array
                x = img_to_array(img)

                # Reshape for generator
                x = x.reshape((1,) + x.shape)

                # Generate augmented images
                i = 0

                for batch in datagen.flow(
                    x,
                    batch_size=1,
                    save_to_dir=root,
                    save_prefix='aug',
                    save_format='jpg'
                ):

                    i += 1

                    if i >= augment_count:
                        break

                print(f"Done: {image_path}")

            except Exception as e:
                print(f"Error in {image_path}")
                print(e)

print("Augmentation Completed!")