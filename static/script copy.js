document
  .getElementById("upload-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData();
    const imageInput = document.getElementById("image");

    if (imageInput.files.length === 0) {
      alert("Please select an image to upload.");
      return;
    }

    formData.append("image", imageInput.files[0]);
    document.getElementById("loading").style.display = "block";

    try {
      const response = await fetch("/detect_with_context", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      document.getElementById("loading").style.display = "none";

      if (!response.ok) {
        displayError(result.error || "An unknown error occurred.");
        return;
      }

      displayResults(result);
    } catch (error) {
      document.getElementById("loading").style.display = "none";
      displayError(error.message);
    }
  });

function displayResults(result) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  if (result.yolov5_detections && result.yolov5_detections.length > 0) {
    resultsDiv.innerHTML += "<h2>Detections:</h2>";

    const detectionCounts = {};
    result.yolov5_detections.forEach((detection) => {
      detectionCounts[detection.class_name] =
        (detectionCounts[detection.class_name] || 0) + 1;
    });

    resultsDiv.innerHTML += "<div class='detection-summary'>";
    for (const [className, count] of Object.entries(detectionCounts)) {
      resultsDiv.innerHTML += `<div class="detection-count">${count} ${className}${
        count > 1 ? "s" : ""
      }</div>`;
    }
    resultsDiv.innerHTML += "</div>";

    result.yolov5_detections.forEach((detection) => {
      resultsDiv.innerHTML += `
              <div class="detection-item">
                  <span class="class-name">${sanitizeHTML(
                    detection.class_name
                  )}</span>
                  <span class="confidence">(Confidence: ${
                    detection.confidence
                  }%)</span>
              </div>
          `;
    });
  } else {
    resultsDiv.innerHTML += "<p>No objects detected.</p>";
  }
}

function displayError(message) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = `<p class="error">Error: ${sanitizeHTML(message)}</p>`;
}

function sanitizeHTML(str) {
  const temp = document.createElement("div");
  temp.textContent = str;
  return temp.innerHTML;
}
  // Display Faster R-CNN results
  /*
  if (result.faster_rcnn_detections && result.faster_rcnn_detections.length > 0) {
    resultsDiv.innerHTML += "<h2>Faster R-CNN Detections:</h2>";
    result.faster_rcnn_detections.forEach((detection) => {
      resultsDiv.innerHTML += `<div class="result">Detected: ${sanitizeHTML(detection.cnn_classification)} (SVM: ${sanitizeHTML(detection.svm_classification)})</div>`;
    });
  }
  */

  // Display Relationships
  /*
  if (result.relationships && result.relationships.length > 0) {
    resultsDiv.innerHTML += "<h2>Relationships:</h2>";
    result.relationships.forEach((relationship) => {
      resultsDiv.innerHTML += `<div class="result">${sanitizeHTML(relationship.type)} between ${relationship.objects.join(" and ")}</div>`;
    });
  }
  */

  // Display Global Scene Features
  /*
  if (result.global_scene_features) {
    resultsDiv.innerHTML += "<h2>Global Scene Features:</h2>";
    for (const [key, value] of Object.entries(result.global_scene_features)) {
      resultsDiv.innerHTML += `<div class="result">${sanitizeHTML(key)}: ${sanitizeHTML(value)}</div>`;
    }
  }
  */