export const chatHistory = [
  {
    id: "chat-1",
    title: "What is JavaScript?",
    group: "Today",
    messages: [
      {
        id: "msg-1",
        role: "user",
        content: "What is JavaScript?",
      },
      {
        id: "msg-2",
        role: "assistant",
        reactions: { liked: false, disliked: false },
        content: [
          {
            type: "paragraph",
            text: "JavaScript is a programming language used to make websites interactive.",
          },
          {
            type: "paragraph",
            text: "It lets you update content, react to clicks, and build user interfaces in the browser.",
          },
        ],
      },
    ],
  },

  {
    id: "chat-2",
    title: "Explain CSS Grid",
    group: "Today",
    messages: [
      {
        id: "msg-3",
        role: "user",
        content: "Explain CSS Grid",
      },
      {
        id: "msg-4",
        role: "assistant",
        reactions: { liked: false, disliked: false },
        content: [
          {
            type: "paragraph",
            text: "CSS Grid is a layout system for organizing content into rows and columns.",
          },
          {
            type: "code",
            language: "css",
            code: `.wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}`,
          },
        ],
      },
    ],
  },

  {
    id: "chat-3",
    title: "Build a website",
    group: "Yesterday",
    messages: [],
  },

  {
    id: "chat-4",
    title: "Learn SCSS",
    group: "Yesterday",
    messages: [],
  },

  {
    id: "chat-5",
    title: "Responsive design strategy",
    group: "Previous 7 days",
    messages: [],
  },

  {
    id: "chat-6",
    title: "JavaScript interview questions",
    group: "Previous 7 days",
    messages: [],
  },

  {
    id: "chat-7",
    title: "Portfolio design ideas",
    group: "Older",
    messages: [],
  },

  {
    id: "chat-8",
    title: "Git and GitHub commands",
    group: "Older",
    messages: [],
  },
];

export const appState = {
  activeChatId: null,
};

export const mockResponseOpeners = [
  "Great prompt. Here is a clean way to approach it:",
  "Nice question. A practical answer is:",
  "Here is a quick mock response you can use:",
  "Good call. The best next step is:",
];

export const mockResponseActions = [
  "Break it into small steps and implement one piece at a time.",
  "Validate it in the browser after each small change.",
  "Keep the UI state in one place so view switches remain predictable.",
  "If needed, I can generate a stricter version with edge-case handling.",
];