import { type ClassValue, clsx } from 'clsx';
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator';
import { twMerge } from 'tailwind-merge';
import {
  EYES_OPEN_WEIGHT,
  EYE_DIRECTION_WEIGHT,
  PITCH_THRESHOLD,
  SIGMOID_STEEPNESS,
  YAW_THRESHOLD,
} from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      if (reader.result) {
        resolve((reader.result as string).split(',')[1]);
      } else {
        reject(new Error('Failed to read the blob.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading the blob.'));
    };

    reader.readAsDataURL(blob);
  });
}

export function bytesToSize(bytes: number) {
  var k = 1000;
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) {
    return '0 Bytes';
  }
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}

export function downloadFile(base64AudioData: string) {
  const byteCharacters = atob(base64AudioData);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'audio/wav' });

  const url = URL.createObjectURL(blob);

  // Createa a temporary link and trigger the download
  const a = document.createElement('a');
  a.href = url;
  a.download = 'captured_audio.wav';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Revoke the object URL to free up resources
  URL.revokeObjectURL(url);
}

export function generateRandomID() {
  const randomName = uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
  });
  return randomName;
}

export function sigmoid(x: number, steepness: number): number {
  return 1 / (1 + Math.exp(-steepness * x));
}

export function calculateAwarenessScore(
  Pitch: number,
  Yaw: number,
  EyesOpen: number,
) {
  // Calculate awareness based on pitch and yaw
  const awarenessPitch = sigmoid(
    Math.abs(Pitch) - PITCH_THRESHOLD,
    SIGMOID_STEEPNESS,
  );
  const awarenessYaw = sigmoid(
    Math.abs(Yaw) - YAW_THRESHOLD,
    SIGMOID_STEEPNESS,
  );

  // Blend the awareness values, with weights for eye direction and eyes open
  const awarenessMetric =
    (((awarenessPitch + awarenessYaw) / 2) * EYE_DIRECTION_WEIGHT +
      EyesOpen * EYES_OPEN_WEIGHT) /
    (EYE_DIRECTION_WEIGHT + EYES_OPEN_WEIGHT);

  return awarenessMetric;
}

export function secondsToMMSS(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds) % 60;

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}
