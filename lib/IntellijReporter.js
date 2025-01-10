import { Scribbler, diagnosticText } from "tstyche/tstyche";
import { Output } from "./Output.js";
import { Tree } from "./Tree.js";

export default class IntellijReporter {
  /** @type {Array<string>} */
  #messages = [];
  #output = new Output();
  #scribbler = new Scribbler({ noColor: true });
  #tree = new Tree();

  /**
   * @param {Array<import("tstyche/tstyche").Diagnostic>} diagnostics
   */
  #addMessages(diagnostics) {
    for (const diagnostic of diagnostics) {
      this.#messages.push(
        this.#scribbler.render(diagnosticText(diagnostic, { linesAbove: 0, linesBelow: 0, showBreadcrumbs: false })),
      );
    }
  }

  #getMessage() {
    const message = this.#messages.join("\n");
    this.#messages = [];

    return message;
  }

  /**
   * @param {import("tstyche/tstyche").ReporterEvent} reporterEvent
   */
  on([event, payload]) {
    switch (event) {
      case "deprecation:info":
        this.#addMessages(payload.diagnostics);

        this.#output.message("testStdOut", {
          nodeId: 0,
          out: this.#getMessage(),
        });

        break;

      case "run:start":
        this.#output.message("testingStarted");
        break;

      case "run:end":
        this.#output.message("testingFinished");
        break;

      case "task:start":
        this.#output.message("testSuiteStarted", {
          ...this.#tree.addFile(payload.result.task.filePath),
          running: true,
        });

        break;

      case "store:error":
      case "project:error":
      case "task:error":
      case "watch:error":
        this.#addMessages(payload.diagnostics);

        this.#output.message("testStdErr", {
          nodeId: 0,
          out: this.#getMessage(),
        });
        break;

      case "task:end":
        this.#output.message("testSuiteFinished", {
          ...this.#tree.removeFile(),
          duration: payload.result.timing.duration,
        });
        break;

      case "describe:start":
        this.#output.message("testSuiteStarted", {
          ...this.#tree.add(payload.result.describe, "suite"),
          running: true,
        });
        break;

      case "describe:end":
        this.#output.message("testSuiteFinished", {
          ...this.#tree.remove(),
          duration: payload.result.timing.duration,
        });
        break;

      case "test:start":
        this.#output.message("testStarted", {
          ...this.#tree.add(payload.result.test, "test"),
          running: true,
        });
        break;

      case "test:pass":
        this.#output.message("testFinished", {
          ...this.#tree.remove(),
          duration: payload.result.timing.duration,
        });
        break;

      case "test:skip":
        this.#output.message("testIgnored", {
          ...this.#tree.remove(),
          message: `skip '${payload.result.test.name}'`,
          duration: payload.result.timing.duration,
        });
        break;

      case "test:todo":
        this.#output.message("testIgnored", {
          ...this.#tree.remove(),
          message: `todo '${payload.result.test.name}'`,
          duration: payload.result.timing.duration,
        });
        break;

      case "test:error":
        this.#addMessages(payload.diagnostics);

        this.#output.message("testFailed", {
          ...this.#tree.remove(),
          message: this.#getMessage(),
          duration: payload.result.timing.duration,
        });
        break;

      case "test:fail":
        this.#output.message("testFailed", {
          ...this.#tree.remove(),
          message: this.#getMessage(),
          duration: payload.result.timing.duration,
        });
        break;

      case "expect:error":
      case "expect:fail":
        this.#addMessages(payload.diagnostics);
        break;
    }
  }
}
