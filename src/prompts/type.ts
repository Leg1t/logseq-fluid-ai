export enum PromptOutputType {
  property = 'property',
  insert = 'insert',
  replace = 'replace',
  append = 'append',
}

export enum ContextType {
  block = 'block',
  page = 'page',
  sectionAbove = 'section-above',
}

export enum OutputMode {
  inline = 'inline',
  sidePage = 'side-page',
}

export interface IPrompt {
  name: string;
  system?: string;
  prompt: string;
  output: PromptOutputType;
  format?: string[] | { [key: string]: string };
  model?: string;

  context?: ContextType;
  outputMode?: OutputMode;

  /**
   * Explicitly request PDF context for this prompt.
   * When settings.autoPdf is true, annotation pages already include
   * the PDF automatically — usePdf is only needed to force it on other pages.
   */
  usePdf?: boolean;

  /**
   * Limit PDF extraction to a page range, e.g. [1, 50].
   * Useful when you only care about a chapter.
   * Defaults to the full document (up to the MAX_CHARS ceiling).
   */
  pdfPageRange?: [number, number];

  /**
   * Split the response on newlines and insert one sibling block per line.
   * Overrides streaming for that run (full response needed before splitting).
   */
  multiBlock?: boolean;

  /**
   * Override the global streaming setting for this specific prompt.
   * Streaming is ignored when multiBlock is true or a format parser is set.
   */
  streaming?: boolean;
  /** Insert response as a sibling block instead of a child. */
  sibling?: boolean;
  skipModel?: boolean;
  /** When used with skipModel, creates a new uniquely named chat page instead of reusing the existing one. */
  newChat?: boolean;
  includeSourcePage?: boolean;
}
