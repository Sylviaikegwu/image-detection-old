from flask import Flask, request, jsonify, render_template, send_file
from trainedmodels.yolo_model import detect_yolo
from PIL import Image, ImageDraw, ImageFont
import numpy as np
import io
import os
import base64

app = Flask(__name__)
app.config['DEBUG'] = False

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/detect_with_context', methods=['POST'])
def detect_with_context():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # Read and process image
        image = Image.open(file)
        image_np = np.array(image)
        results = detect_yolo(image_np)
        result = results[0]
        
        # Create a copy of the image for drawing
        draw_image = image.copy()
        draw = ImageDraw.Draw(draw_image)
        
        formatted_detections = []
        if hasattr(result, 'boxes') and result.boxes is not None:
            for box in result.boxes:
                # Get detection info
                bbox = box.xyxy[0].cpu().numpy()
                class_id = int(box.cls[0].item())
                class_name = result.names[class_id]
                confidence = round(float(box.conf[0].item()) * 100, 2)
                
                # Draw rectangle
                draw.rectangle(bbox, outline='#cc4e4e', width=2)
                
                # Draw label
                label = f'{class_name} {confidence}%'
                # Inside your YOLO drawing code
                draw.text((bbox[0], bbox[1] - 10), label, fill='blue', font=ImageFont.truetype("arial.ttf", 13))
                # draw.text((bbox[0], bbox[1] - 10), label, fill='blue')
                
                formatted_detections.append({
                    'class_name': class_name,
                    'confidence': confidence,
                    'bbox': bbox.tolist()
                })
        
        # Convert image to base64
        buffered = io.BytesIO()
        draw_image.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        
        return jsonify({
            'yolov5_detections': formatted_detections,
            'image': img_str
        }), 200

    except Exception as e:
        print("Error occurred:", str(e))
        import traceback
        print(traceback.format_exc())
        return jsonify({'error': f'Processing error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)