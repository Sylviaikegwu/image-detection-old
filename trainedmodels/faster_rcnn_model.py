# faster_rcnn_model.py
import torch
from torchvision import models

# Load Faster R-CNN model
model_path = ""
model = models.detection.fasterrcnn_resnet50_fpn(pretrained=False)
model.load_state_dict(torch.load(model_path))
model.eval()


def detect_faster_rcnn(image):
    """Detect objects in an image using the Faster R-CNN model."""
    try:
        if model is None:
            raise ValueError("Faster R-CNN model is not loaded.")
        with torch.no_grad():
            detections = model(image)
        return detections
    except Exception as e:
        print(f"Error during Faster R-CNN detection: {e}")
        return []

