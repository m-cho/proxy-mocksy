export class ResponseBodyParser {
  constructor(
    private readonly params: Record<string, string>,
    private readonly query: Record<string, string | string[] | undefined>,
    private readonly body: Record<string, unknown>,
    private readonly responseBody: string,
  ) {}

  public parse(): string {
    if (!this.responseBody) {
      return this.responseBody;
    }

    let parsedBody = JSON.stringify(this.responseBody);

    const replacements = {
      params: this.params,
      query: this.query,
      body: this.body
    };

    for (const [prefix, data] of Object.entries(replacements)) {
      for (const [key, value] of Object.entries(data)) {
        parsedBody = parsedBody.replaceAll(new RegExp(`{{\\s*${prefix}\\.${key}\\s*}}`, 'g'), String(value));
      }
    }

    return JSON.parse(parsedBody);
  }
}