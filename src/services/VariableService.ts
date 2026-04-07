export class VariableService {
  /**
   * Extracts unique variables from a string (e.g., {{name}}).
   */
  static extractVariables(content: string): string[] {
    const regex = /\{\{(.*?)\}\}/g;
    const matches = Array.from(content.matchAll(regex));
    const variables = matches.map((match) => match[1].trim());
    return [...new Set(variables)];
  }

  /**
   * Replaces placeholders in content with their provided values.
   */
  static applyVariables(content: string, variables: Record<string, string>): string {
    let result = content;
    Object.entries(variables).forEach(([name, value]) => {
      const regex = new RegExp(`\\{\\{\\s*${name}\\s*\\}\\}`, 'g');
      result = result.replace(regex, value);
    });
    return result;
  }
}
