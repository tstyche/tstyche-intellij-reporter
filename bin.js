#!/usr/bin/env node
import process from "node:process";
import { Cli } from "tstyche/tstyche";

const intellijReporter = new URL("./lib/IntellijReporter.js", import.meta.url).toString();

const commandLine = ["--reporters", intellijReporter];

if (process.argv.includes("--watch")) {
  commandLine.push("--watch");
}

const cli = new Cli();

await cli.run(commandLine);
