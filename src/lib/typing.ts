import { PiiEntityType } from '@aws-sdk/client-comprehend';

export function isDefined<T>(argument: T | undefined): argument is T {
  return argument !== undefined;
}

interface PiiEntity {
  type: PiiEntityType;
  value: string;
}

export function mergePiiEntitiesByType(objects: PiiEntity[]) {
  const mergedObjects: Record<string, PiiEntity> = {};

  objects.forEach((entity) => {
    const { type, value } = entity;

    if (!mergedObjects[type]) {
      mergedObjects[type] = entity;
    } else {
      mergedObjects[type].value += ` | ${value}`;
    }
  });

  return Object.values(mergedObjects);
}
