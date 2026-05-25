# IMPORT REQUIRED LIBRARIES
import tensorflow as tf
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import json

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, GlobalAveragePooling2D
from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications.efficientnet import preprocess_input
from tensorflow.keras.layers import BatchNormalization
from sklearn.metrics import confusion_matrix
from sklearn.metrics import classification_report


# CHECK GPU
print("TensorFlow Version:", tf.__version__)

gpus = tf.config.list_physical_devices('GPU')

if gpus:

    print("GPU Detected:", gpus)

    for gpu in gpus:
        tf.config.experimental.set_memory_growth(gpu, True)

else:

    print("GPU NOT detected. Running on CPU")

# DATASET PATHS
train_path = "..."

val_path = "..."

test_path = "..."

# DATA GENERATORS
train_datagen = ImageDataGenerator(

    preprocessing_function=preprocess_input,

    rotation_range=20,

    zoom_range=0.2,

    horizontal_flip=True

)

val_datagen = ImageDataGenerator(

    preprocessing_function=preprocess_input

)

# LOAD DATASETS
train_generator = train_datagen.flow_from_directory(

    train_path,

    target_size=(224,224),

    batch_size=16,

    class_mode='categorical'

)

val_generator = val_datagen.flow_from_directory(

    val_path,

    target_size=(224,224),

    batch_size=16,

    class_mode='categorical'

)

test_generator = val_datagen.flow_from_directory(

    test_path,

    target_size=(224,224),

    batch_size=16,

    class_mode='categorical',

    shuffle=False

)

# SAVE CLASS LABELS
class_labels = train_generator.class_indices

with open("...", "w") as f:

    json.dump(class_labels, f)


NUM_CLASSES = train_generator.num_classes

# BUILD FINAL MODEL
conv_base = EfficientNetB0(

    weights='imagenet',

    include_top=False,

    input_shape=(224,224,3)

)

# FREEZE BACKBONE
conv_base.trainable = False

# MODEL ARCHITECTURE
model = Sequential([

    conv_base,

    GlobalAveragePooling2D(),

    Dense(
        512,
        activation='relu'
    ),

    BatchNormalization(),

    Dropout(0.37068505312470257),

    Dense(
        NUM_CLASSES,
        activation='softmax',
        dtype='float32'
    )

])

# MODEL SUMMARY
model.summary()

# COMPILE MODEL
model.compile(

    optimizer=tf.keras.optimizers.Adam(

        learning_rate=5.842780085220178e-05,
        clipnorm=1.0

    ),

    loss='categorical_crossentropy',

    metrics=['accuracy']

)

# CALLBACKS
early_stop = tf.keras.callbacks.EarlyStopping(

    monitor='val_loss',

    patience=5,

    restore_best_weights=True

)

checkpoint = tf.keras.callbacks.ModelCheckpoint(

    "...",

    monitor='val_accuracy',

    save_best_only=True,

    verbose=1

)

reduce_lr = tf.keras.callbacks.ReduceLROnPlateau(

    monitor='val_loss',

    factor=0.2,

    patience=2,

    min_lr=1e-6,

    verbose=1

)

# TRAIN MODEL
history = model.fit(

    train_generator,

    validation_data=val_generator,

    epochs=25,

    callbacks=[
        early_stop,
        checkpoint,
        reduce_lr
    ]

)

# EVALUATE MODEL
test_loss, test_acc = model.evaluate(test_generator)

print("\n=========================")
print("FINAL TEST RESULTS")
print("=========================")

print("\nTest Accuracy:", test_acc)

print("Test Loss:", test_loss)

# SAVE FINAL MODEL
model.save("...")

print("\nFinal Model Saved")

# ACCURACY GRAPH
plt.figure(figsize=(10,5))

plt.plot(

    history.history['accuracy'],

    label='Training Accuracy'

)

plt.plot(

    history.history['val_accuracy'],

    label='Validation Accuracy'

)

plt.title('Training vs Validation Accuracy')

plt.xlabel('Epoch')

plt.ylabel('Accuracy')

plt.legend()

plt.savefig("accuracy_graph.png")

plt.close()

# LOSS GRAPH
plt.figure(figsize=(10,5))

plt.plot(

    history.history['loss'],

    label='Training Loss'

)

plt.plot(

    history.history['val_loss'],

    label='Validation Loss'

)

plt.title('Training vs Validation Loss')

plt.xlabel('Epoch')

plt.ylabel('Loss')

plt.legend()

plt.savefig("loss_graph.png")

plt.close()

# PREDICTIONS
y_pred = model.predict(test_generator)

y_pred_classes = np.argmax(y_pred, axis=1)

y_true = test_generator.classes

# CONFUSION MATRIX
cm = confusion_matrix(

    y_true,

    y_pred_classes

)

plt.figure(figsize=(15,12))

sns.heatmap(

    cm,

    annot=True,

    fmt='d',

    cmap='Blues'

)

plt.title("Confusion Matrix")

plt.xlabel("Predicted")

plt.ylabel("Actual")

plt.savefig("confusion_matrix.png")

plt.close()

print("\nConfusion Matrix Saved")

# CLASSIFICATION REPORT
class_names = list(

    test_generator.class_indices.keys()

)

report = classification_report(

    y_true,

    y_pred_classes,

    target_names=class_names

)

print("\n=========================")
print("CLASSIFICATION REPORT")
print("=========================\n")

print(report)

# Save report
with open("classification_report.txt", "w") as f:

    f.write(report)

print("\nClassification Report Saved")

print("\n=========================")
print("ALL FILES SAVED")
print("=========================")