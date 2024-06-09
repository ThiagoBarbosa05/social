export class Username {
  public value: string

  private constructor(value: string) {
    this.value = value
  }

  /**
   * Receives a string and normalize it as a username.
   *
   * Example: "An example username" => "an-example-username"
   *
   * @param text {string}
   */
  static create(value: string): Username {
    const usernameNormalized = value
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/g, '')

    return new Username(usernameNormalized)
  }
}
