export class TokenCounter {
  /**
   * Approximate token count (Simple heuristic: 1 token ≈ 4 characters for English).
   */
  static estimateTokens(text: string): number {
    if (!text) return 0;
    // Standard heuristic: characters / 4
    return Math.ceil(text.trim().length / 4);
  }

  /**
   * Character count excluding HTML tags.
   */
  static countCharacters(text: string): number {
    return text.length;
  }
}
