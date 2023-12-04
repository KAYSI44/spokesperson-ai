export const percToDeg = (perc: number) => perc * 360;
export const degToRad = (deg: number) => (deg * Math.PI) / 180;
export const percToRad = (perc: number) => degToRad(percToDeg(perc));

interface ConversationItem {
  timestamp: number;
  transcript: string;
}

export function calculateWordsPerMinute(
  conversation: ConversationItem[],
): number {
  const totalWords = conversation.reduce(
    (acc, item) => acc + item.transcript.split(/\s+/).length,
    0,
  );

  const totalTimeMinutes =
    Math.max(conversation[conversation.length - 1]?.timestamp, 1) / 60;
  return totalWords / totalTimeMinutes;
}

export function calculateTotalConversationTime(
  conversation: ConversationItem[],
  silenceThreshold: number,
): number {
  let totalTalkingTime = 0;

  for (let i = 1; i < conversation.length; i++) {
    const timeGap = conversation[i].timestamp - conversation[i - 1].timestamp;

    // If the time gap is below the silence threshold, consider it as talking time
    if (timeGap <= silenceThreshold) {
      totalTalkingTime += timeGap;
    }
  }

  return totalTalkingTime;
}

export function calculateWordFrequency(
  conversation: ConversationItem[],
  topN: number,
): Map<string, number> {
  const wordCountMap = new Map<string, number>();

  conversation.forEach((item) => {
    const words = item.transcript.split(/\s+/);
    words.forEach((word) => {
      const normalizedWord = word.toLowerCase();
      const count = wordCountMap.get(normalizedWord) || 0;
      wordCountMap.set(normalizedWord, count + 1);
    });
  });

  const sortedEntries: [string, number][] = Array.from(
    wordCountMap.entries(),
  ).sort((a, b) => b[1] - a[1]);
  const topEntries = sortedEntries.slice(0, topN);

  return new Map(topEntries);
}
