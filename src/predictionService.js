// src/predictionService.js

const API_URL = 'https://bms-server-lc3t.onrender.com'; // <-- your live backend

export async function sendFileForPrediction(file, futureCount = 0) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('future_cycles', futureCount);

  const res = await fetch(`${API_URL}/predict`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Server error: ${res.status} - ${msg}`);
  }

  return await res.json();
}

