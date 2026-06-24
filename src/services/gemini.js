import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export async function analyzeTask(task, deadline, hours) {
  const prompt = `
You are BeforeTomorrow, an AI productivity coach.

Analyze the following task:

Task: ${task}
Deadline: ${deadline}
Estimated Hours: ${hours}

Return ONLY in this format:

Priority: [High/Medium/Low]

Risk Score: [0-100]

Task Breakdown:
- Step 1
- Step 2
- Step 3

Suggested Schedule:
Day 1: ...
Day 2: ...
Day 3: ...

Productivity Tip:
...

Rules:
- Keep response under 120 words.
- Be concise and actionable.
- Use bullet points.
- Do not write long explanations.
- Do not use markdown symbols like ** or ##.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text;
}