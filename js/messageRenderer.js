import { escapeHTML } from "./utils.js";

function renderBlock(block) {
  switch (block.type) {
    case "heading":
      return `<h${block.level}>${escapeHTML(block.text)}</h${block.level}>`;

    case "list":
      return `<ul>${block.items.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>`;

    case "code":
      return `
        <div class="code-block">
          <div class="code-block__header">
            <span>${escapeHTML(block.language || "code")}</span>
            <button type="button" class="code-block__copy" data-code="${encodeURIComponent(block.code)}">Copy</button>
          </div>
          <pre class="code-block__content"><code>${escapeHTML(block.code)}</code></pre>
        </div>
      `;

    case "table":
      return `
        <div class="table-wrapper">
          <table class="message-table">
            <thead>
              <tr>${block.headers.map((header) => `<th>${escapeHTML(header)}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${block.rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHTML(cell)}</td>`).join("")}</tr>`).join("")}
            </tbody>
          </table>
        </div>
      `;

    case "link":
      return `<a href="${block.href || "#"}" class="message__link">${escapeHTML(block.text)}</a>`;

    default:
      return `<p>${escapeHTML(block.text)}</p>`;
  }
}

function renderMessageActions(message) {
  const isLiked = message.reactions?.liked ? "message-action--active" : "";
  const isDisliked = message.reactions?.disliked
    ? "message-action--active"
    : "";

  return `
    <div class="message__actions">
      <button class="message-action" type="button" data-action="copy-message" aria-label="Copy message" title="Copy">
        <img src="assets/icons/copy.svg" alt="" class="message-action__icon" />
      </button>
      <button class="message-action ${isLiked}" type="button" data-action="like" aria-label="Like response" title="Like">
        <img src="assets/icons/thumb-up.svg" alt="" class="message-action__icon" />
      </button>
      <button class="message-action ${isDisliked}" type="button" data-action="dislike" aria-label="Dislike response" title="Dislike">
        <img src="assets/icons/thumb-down.svg" alt="" class="message-action__icon" />
      </button>
      <button class="message-action" type="button" data-action="regenerate" aria-label="Regenerate response" title="Regenerate">
        <img src="assets/icons/regenerate.svg" alt="" class="message-action__icon" />
      </button>
    </div>
  `;
}

export function renderMessage(message) {
  if (message.role === "user") {
    return `
      <article class="message message--user" data-message-id="${message.id}">
        <div class="message__content">
          <p>${escapeHTML(message.content)}</p>
        </div>
      </article>
    `;
  }

  if (message.loading) {
    return `
      <article class="message message--assistant message--loading" data-message-id="${message.id}">
        <div class="message__content">
          <p>Thinking...</p>
        </div>
      </article>
    `;
  }

  const blocks = Array.isArray(message.content)
    ? message.content
    : [{ type: "paragraph", text: message.content }];

  return `
    <article class="message message--assistant" data-message-id="${message.id}">
      <div class="message__content">
        ${blocks.map(renderBlock).join("")}
      </div>
      ${renderMessageActions(message)}
    </article>
  `;
}

export function renderComposer() {
  return `
    <form class="chat-composer search" id="chatComposer">
      <button
        class="search__add chat-composer__attach"
        type="button"
        aria-label="Add attachment"
      >
        <img
          src="assets/icons/plus.svg"
          alt=""
          class="icon-content"
        />
      </button>

      <textarea
        class="search__input chat-composer__input"
        id="chatInput"
        placeholder="Message ChatGPT"
        rows="1"
        aria-label="Message"
      ></textarea>

      <div class="search__actions">
        <div class="model-selector">
          <button
            class="model-selector__trigger search__think"
            type="button"
            aria-label="Select model"
            aria-expanded="false"
          >
            <img
              src="assets/icons/brain.svg"
              alt=""
              class="icon-content"
            />

            <span class="selected-model">GPT-5</span>

            <span class="model-selector__arrow">⌄</span>
          </button>

          <div
            class="model-selector__menu"
            hidden
          >
            <button
              class="model-selector__option active"
              type="button"
              data-model="GPT-5"
            >
              <span class="model-selector__option-main">
                <strong>GPT-5</strong>
                <small>Best for complex tasks</small>
              </span>

              <span class="model-selector__check">✓</span>
            </button>

            <button
              class="model-selector__option"
              type="button"
              data-model="GPT-4"
            >
              <span class="model-selector__option-main">
                <strong>GPT-4</strong>
                <small>Fast and capable</small>
              </span>

              <span class="model-selector__check">✓</span>
            </button>
          </div>
        </div>

        <button
          class="search__mic"
          type="button"
          aria-label="Voice input"
        >
          <img
            src="assets/icons/microphone.svg"
            alt="mic icon"
            class="icon-content"
          />
        </button>

        <button
          class="search__voice chat-composer__send"
          type="submit"
          aria-label="Send message"
        >
          <img
            src="assets/icons/voice.svg"
            alt="send icon"
            class="icon-content voice-svg"
          />
        </button>
      </div>
    </form>
  `;
}

export function renderWelcomePanel() {
  return `
    <div class="welcome-panel">
      <h2>What’s on your mind today?</h2>
      <div class="suggestion-grid">
        <button type="button" class="suggestion-pill">Create an image</button>
        <button type="button" class="suggestion-pill">Write or edit</button>
        <button type="button" class="suggestion-pill">Search the web</button>
      </div>
    </div>
  `;
}