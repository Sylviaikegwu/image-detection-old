# import torch
from ultralytics import YOLO

def detect_yolo(image):
    try:
        model = YOLO('trainedmodels/yolov5_trained_final.pt')  # Your trained model path
        results = model(image)
        return results
    except Exception as e:
        raise RuntimeError("Error loading YOLOv5 model: " + str(e))
