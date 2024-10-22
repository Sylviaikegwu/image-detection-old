# svm_model.py
import joblib

# Load SVM model (assumed you have a trained model)
try:
    svm_model = joblib.load('path_to_svm_model.pkl')
except Exception as e:
    raise RuntimeError("Error loading SVM model: " + str(e))

def classify_svm(features):
    return svm_model.predict([features])
    # return svm_model.predict([features])[0]  # Return single prediction
