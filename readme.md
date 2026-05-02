# logseq-fluid-ai

A fork of [logseq-plugin-ai-assistant](https://github.com/ahonn/logseq-plugin-ai-assistant) with extended context, PDF integration, side-page chat, and a focused prompt set built around a note-taking workflow.

---

## What's new

**Flexible context**
Commands can draw from the current block, the full page, or everything written above the cursor — not just the block you run the command on.

**PDF integration**
On any Logseq PDF annotation page (one with a `file-path::` property), AI commands automatically include the PDF text as context. No setup needed. Limit extraction to a specific chapter by writing `pdf-page-range:: 10 50` in a block above the cursor. Hard ceiling is ~120,000 characters (~30,000 tokens, roughly 30–40 dense pages). If you are reading a longer pdf, you can use the pdfPageRange property.

**Side-page chat**
`/Open Chat` and `/New Chat` create a dedicated `AI/PageName` note, open it in the right sidebar, and drop a backlink in your source note. `/Ask (chat)` continues the conversation there with your original notes automatically included as background context.

**Block output control**
Responses can be inserted as sibling blocks or children. Multi-block output splits on newlines so each line becomes its own block — used for flashcards, definitions, and lists.

**Streaming**
Optional per-prompt or global setting that pipes tokens into the block as they arrive. Best for long responses; leave off for short commands.

**Sanitizer**
Responses are automatically cleaned before writing, hopefully preventing Logseq's "multiple unordered lists not supported" block error.

---

## Commands

| Command | Context | Output | Description |
|---|---|---|---|
| Quick Ask | Block | Insert (child) | Answer the question in the current block |
| Ask (chat) | Section above + source page | Insert (sibling) | Continue a conversation in a side-page note |
| Ask (PDF) | Page + PDF | Insert (sibling) | Answer using the annotation page's PDF as primary source |
| Open Chat | — | Side page | Open or resume the persistent chat page for this note |
| New Chat | — | Side page | Create a new timestamped chat page for this note |
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
  "sibling": false,
  "multiBlock": false,
  "usePdf": false,
  "pdfPageRange": [1, 50],
  "streaming": false,
  "outputMode": "inline",
  "includeSourcePage": false
}
```

| Field | Required | Options / Notes |
|---|---|---|
| `name` | ✓ | Slash command name |
| `prompt` | ✓ | Use `{content}` or `{{text}}` as the context placeholder |
| `output` | ✓ | `insert` · `replace` · `append` · `property` |
| `system` | — | System prompt. Defaults to generic helpful assistant |
| `model` | — | Overrides global model for this command |
| `context` | — | `block` *(default)* · `page` · `section-above` |
| `outputMode` | — | `inline` *(default)* · `side-page` |
| `sibling` | — | `false` *(child block, default)* · `true` *(peer block)* |
| `multiBlock` | — | `false` *(default)* · `true` — one block per line, disables streaming |
| `usePdf` | — | `false` *(default)* · `true` — force PDF context regardless of autoPdf setting |
| `pdfPageRange` | — | `[first, last]` 1-based inclusive, e.g. `[10, 50]` |
| `streaming` | — | Overrides global streaming setting for this command |
| `includeSourcePage` | — | `true` — prepend source page notes when running from an `AI/` chat page |

## Building from source

```bash
git clone https://github.com/Leg1t/logseq-fluid-ai
cd logseq-fluid-ai
pnpm install
pnpm build
```

Load in Logseq: **Settings → Advanced → Developer mode → Plugins → Load unpacked plugin** → select the repo folder.
