import process from "node:process";

export class Output {
  /**
   * @param {string | number | boolean | undefined} value
   */
  #escape(value) {
    if (typeof value !== "string") {
      return value;
    }

    return value
      .replace(/\|/g, "||")
      .replace(/'/g, "|'")
      .replace(/\n/g, "|n")
      .replace(/\r/g, "|r")
      .replace(/\[/g, "[|")
      .replace(/]/g, "]|");
  }

  /**
   * @param {string} message
   * @param {Record<string, string | number | boolean | undefined>} attributes
   */
  message(message, attributes = {}) {
    const text = ["##teamcity", "[", message];

    for (const [key, value] of Object.entries(attributes)) {
      text.push(" ", key, "=", `'${this.#escape(value)}'`);
    }

    text.push("]", "\n");

    process.stdout.write(text.join(""));
  }
}
