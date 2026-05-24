# IMPORT REQUIRED LIBRARIES
import tensorflow as tf
import matplotlib.pyplot as plt
import optuna
import seaborn as sns
import numpy as np
import pandas as pd

from tensorflow.keras import mixed_precision
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, GlobalAveragePooling2D

from tensorflow.keras.applications import (
    EfficientNetB0,
    EfficientNetB1,
    MobileNetV2,
    ResNet50
)

from tensorflow.keras.preprocessing.image import ImageDataGenerator

from tensorflow.keras.applications.efficientnet import preprocess_input

from sklearn.metrics import confusion_matrix
from sklearn.metrics import classification_report

# MIXED PRECISION
mixed_precision.set_global_policy('mixed_float16')

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
train_path = "/mnt/e/AI-Powered Smart Waste Segregation & Recycling Analysis System/dataset_split/train"

val_path = "/mnt/e/AI-Powered Smart Waste Segregation & Recycling Analysis System/dataset_split/val"

test_path = "/mnt/e/AI-Powered Smart Waste Segregation & Recycling Analysis System/dataset_split/test"

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

    batch_size=8,

    class_mode='categorical'

)

val_generator = val_datagen.flow_from_directory(

    val_path,

    target_size=(224,224),

    batch_size=8,

    class_mode='categorical'

)

test_generator = val_datagen.flow_from_directory(

    test_path,

    target_size=(224,224),

    batch_size=8,

    class_mode='categorical',

    shuffle=False

)

NUM_CLASSES = train_generator.num_classes

# OPTUNA OBJECTIVE FUNCTION
def objective(trial):

    # MODEL SELECTION
    model_name = trial.suggest_categorical(

        "model_name",

        [
            "EfficientNetB0",
            "EfficientNetB1",
            "MobileNetV2",
            "ResNet50"
        ]

    )

    # HYPERPARAMETERS
    learning_rate = trial.suggest_float(

        "learning_rate",

        1e-5,

        1e-3,   
        log=True

    )

    dropout1 = trial.suggest_float(

        "dropout1",

        0.2,

        0.5

    )

    dropout2 = trial.suggest_float(

        "dropout2",

        0.1,

        0.4

    )

    dense1 = trial.suggest_categorical(

        "dense1",

        [128, 256, 512]

    )

    dense2 = trial.suggest_categorical(

        "dense2",

        [64, 128]

    )

    use_second_dense = trial.suggest_categorical(

        "use_second_dense",

        [True, False]

    )

    # LOAD BACKBONE MODEL
    if model_name == "EfficientNetB0":

        conv_base = EfficientNetB0(

            weights='imagenet',

            include_top=False,

            input_shape=(224,224,3)

        )

    elif model_name == "EfficientNetB1":

        conv_base = EfficientNetB1(

            weights='imagenet',

            include_top=False,

            input_shape=(224,224,3)

        )

    elif model_name == "MobileNetV2":

        conv_base = MobileNetV2(

            weights='imagenet',

            include_top=False,

            input_shape=(224,224,3)

        )

    elif model_name == "ResNet50":

        conv_base = ResNet50(

            weights='imagenet',

            include_top=False,

            input_shape=(224,224,3)

        )

    # FREEZE BACKBONE
    conv_base.trainable = False

    # BUILD MODEL
    model = Sequential()

    model.add(conv_base)

    model.add(GlobalAveragePooling2D())

    # First Dense Layer

    model.add(Dense(

        dense1,

        activation='relu'

    ))

    model.add(Dropout(dropout1))

    # Optional Second Dense Layer
    if use_second_dense:

        model.add(Dense(

            dense2,

            activation='relu'

        ))

        model.add(Dropout(dropout2))

    # Output Layer
    model.add(Dense(

        NUM_CLASSES,

        activation='softmax',

        dtype='float32'

    ))

    # COMPILE MODEL
    model.compile(

        optimizer=tf.keras.optimizers.Adam(

            learning_rate=learning_rate

        ),

        loss='categorical_crossentropy',

        metrics=['accuracy']

    )

    # CALLBACKS
    early_stop = tf.keras.callbacks.EarlyStopping(

        monitor='val_loss',

        patience=2,

        restore_best_weights=True

    )

    # TRAIN MODEL
    history = model.fit(

        train_generator,

        validation_data=val_generator,

        epochs=10,

        callbacks=[early_stop],

        verbose=1

    )

    # GET BEST VALIDATION ACCURACY
    best_val_acc = max(

        history.history['val_accuracy']

    )

    # CLEAR SESSION
    tf.keras.backend.clear_session()

    return best_val_acc

# RUN OPTUNA STUDY
study = optuna.create_study(

    direction='maximize'

)

study.optimize(

    objective,

    n_trials=10

)

# BEST PARAMETERS
print("\n=========================")
print("BEST TRIAL PARAMETERS")
print("=========================\n")

print(study.best_trial.params)

best_params = study.best_trial.params

# SAVE TRIAL RESULTS
results_df = study.trials_dataframe()

results_df.to_csv(

    "optuna_results.csv",

    index=False

)

print("\nOptuna Results Saved")

# BEST MODEL SUMMARY
print("\n=========================")
print("BEST MODEL CONFIGURATION")
print("=========================\n")

for key, value in best_params.items():

    print(f"{key} : {value}")