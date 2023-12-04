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

type PhraseCount = Record<string, number>;
export function countOccurences(phraseList: string[]): PhraseCount {
  const phraseCount: PhraseCount = {};

  for (const phrase of phraseList) {
    const existingPhrases = Object.keys(phraseCount);

    // Check if the current phrase intersects with any of the existing phrases
    const intersectingPhrase = existingPhrases.find((existingPhrase) =>
      existingPhrase.includes(phrase),
    );

    // if there is an intersection, merge to the existing phrase
    if (intersectingPhrase) {
      phraseCount[intersectingPhrase] += 1;
    } else {
      phraseCount[phrase] = (phraseCount[phrase] || 0) + 1;
    }
  }

  return phraseCount;
}

export function transformMapToArray(
  map: Map<string, number>,
): { text: string; value: number }[] {
  return Array.from(map.entries()).map(([text, value]) => ({ text, value }));
}
