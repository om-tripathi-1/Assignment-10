import { mockResponseActions, mockResponseOpeners } from "./data.js";
import { pickRandom } from "./utils.js";

export function buildMockAssistantBlocks(promptText = "") {
  const normalizedPrompt = promptText.trim();

  return [
    { type: "paragraph", text: pickRandom(mockResponseOpeners) },
    {
      type: "paragraph",
      text: normalizedPrompt
        ? `You asked: "${normalizedPrompt}"`
        : "I can keep helping with this chat flow.",
    },
    { type: "paragraph", text: pickRandom(mockResponseActions) },
  ];
}
