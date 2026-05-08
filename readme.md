# logseq-fluid-ai

A fork of [logseq-plugin-ai-assistant](https://github.com/ahonn/logseq-plugin-ai-assistant) with extended context, PDF integration, side-page chat, and a focused prompt set built around a note-taking workflow.

---

## What's new

**Flexible context**
Commands can draw from the current block, the full page, or everything written above the cursor — not just the block you run the command on.

**Smart rate limits & sliding window**
You can configure a maximum token limit. The plugin calculates a sliding window: your most recent notes get priority (preserving your active chat), and any attached PDF is dynamically truncated to perfectly fit whatever space is left in your context window. Currently keeping at least 70% percent of what is possible with token limit for the notes.

**PDF integration & dynamic page ranges**
On any Logseq PDF annotation page (one with a `file-path::` property), AI commands automatically include the PDF text as context. You can limit extraction to a specific chapter just by typing it naturally in your prompt (e.g., `/Ask (PDF) please summarize pages 10-25` or `p 10 to 25`). The plugin intercepts this and only reads those pages.

**Side-page chat**
`/Open Chat` and `/New Chat` create a dedicated `AI/PageName` note, open it in the right sidebar, and drop a backlink in your source note. `/Ask (chat)` continues the conversation there with your original notes automatically included as background context.

**Block output control**
Responses can be inserted as sibling blocks or children. Multi-block output splits on newlines so each line becomes its own block — used for flashcards, definitions, and lists.

**Streaming**
Optional per-prompt or global setting that pipes tokens into the block as they arrive. Best for long responses.

**Sanitizer**
Responses are automatically cleaned before writing, in order to prevent Logseq's "multiple unordered lists not supported" block error.

---

## Commands

| Command | Context | Output | Description |
|---|---|---|---|
| Quick Ask | Block | Insert (child) | Answer the question in the current block |
| Ask (chat) | Section above + source page | Insert (sibling) | Continue a conversation in a side-page note |
| Ask (PDF) | Page + PDF | Insert (sibling) | Answer using the annotation page's PDF as primary source |
| Open Chat | — | Side page | Open or resume the persistent chat page for this note |
| New Chat | — | Side page | Create a new timestamped chat page for this note |
| Research | Section above + source page | Insert (sibling) | Deep, highly detailed, multi-block research response |
| Flashcard (block) | Block | Insert (sibling) | One flashcard from the current block |
| Flashcard (page) | Page | Insert (siblings) | Flashcards for new content on the page, skips existing `#card` blocks |
| Flashcard (page, PDF context) | Page + PDF | Insert (siblings) | Same but PDF gives richer context for better cards |
| Flashcard (PDF only) | PDF | Insert (siblings) | Flashcards directly from the PDF source material |
| Define | Block | Insert (siblings) | One-sentence definitions for unfamiliar terms in the block |
| Tighten | Block | Replace | Fix grammar and spelling in place, minimal changes, `[ai: note]` for added context |
| Rework | Page | Replace | Rewrite the current block per the instruction written in the block above it |

---

## Settings

| Setting | Default | Description |
|---|---|---|
| API Key | — | Your OpenAI API key |
| Base Path | `https://api.openai.com/v1` | Override for proxies or alternative providers |
| Model | `gpt-4o-mini` | Global default model |
| Max Context Tokens | `100000` | Max tokens for context. Sliding window preserves recent notes and trims PDFs to fit. |
| Tag | `[[AI]]` | Appended to every AI-generated block |
| Streaming | `false` | Stream tokens into blocks as they arrive |
| Auto PDF | `true` | Automatically include PDF context on annotation pages |

---

## Custom prompts

Enable in settings under `customPrompts`. Each prompt is a JSON object:

```json
{
  "name": "My Command",
  "system": "You are a helpful assistant.",
  "prompt": "Do something with this:\n{content}",
  "output": "insert",
  "context": "block",
  "model": "gpt-4o",
  "maxTokens": 30000,
  "sibling": false,
  "multiBlock": false,
  "usePdf": false,
  "streaming": false,
  "outputMode": "inline",
  "includeSourcePage": false
}
