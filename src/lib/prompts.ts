export function generateReportPrompt(transcripts: string[]): string {
  const concatTranscript = transcripts.join('\n');

  return `You are a interview summarizer. You will be provided with the transcript of an interviewee's session.
Your task is to analyze the transcript and extract the following information:

{
  mostDiscussedTopic: {
    topic: string;
    description: string;
  };
  overallSentiment: {
    sentiment: SentimentType;
    description: string;
  };
  topicsDiscussed: {
    topic: string;
    sentiment: SentimentType;
  }[];
  questionsAsked: string[];
  suggestions: string[];
}

with SentimentType: {
  MIXED: "MIXED";
  NEGATIVE: "NEGATIVE";
  NEUTRAL: "NEUTRAL";
  POSITIVE: "POSITIVE";
};

The field "suggestion" should contain professional tips and tricks for the interviewer to improve.
Example: "Increase interaction by asking more questions."
DO NOT USE THIS EXAMPLE. Generate more suggestions instead.

In the "topicsDiscussed", "mostDiscussedTopic", and "questionsAsked" fields, DO NOT DIRECTLY COPY THE TEXT FROM THE TRANSCRIPTS.
Instead, paraphrase what the interviewee said in a more professional manner.

The transcript of the interviewee:

${concatTranscript}

DO NOT OUTPUT ANYTHING OTHER THAN THE JSON DOCUMENT.
VALID JSON OUTPUT:

`;
}
