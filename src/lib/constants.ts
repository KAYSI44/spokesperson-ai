export enum IDENTITY {
  HOST = 'host',
  GUEST = 'guest',
}

export const NEW_MEETING = 'new';

// Assume a threshold for pitch and yaw angles that indicates the person is looking at the camera
export const PITCH_THRESHOLD = 3;
export const YAW_THRESHOLD = 5;
export const SIGMOID_STEEPNESS = 0.1;
export const EYES_OPEN_WEIGHT = 8;
export const EYE_DIRECTION_WEIGHT = 3;
