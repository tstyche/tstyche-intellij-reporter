# tstyche-intellij-reporter

The TSTyche reporter for IntelliJ IDEA, WebStorm and other JetBrains IDEs.

---

This reporter will be used by the `intellij-tstyche` plugin (work in progress).

## Usage

You can help to test the reporter before the plugin is released.

### Requirements

The reporter expects TSTyche version `3.5` or above to be installed. The minimum required Node.js version is `20.9`.

### Setup

Install the package:

```shell
npm add -D tstyche-intellij-reporter
```

Create a new Run Configuration:

<!-- TODO add image -->

Run your type tests:

<!-- TODO add image -->

### Limitations

The reporter is responsible to output the results of test runs. It cannot provide plugin specific features. Therefor:

- gutter run icons are not supported,
- rerun failed tests action does not work,
- the command line options are ignored (except `--watch`).

## License

[MIT][license-url] © TSTyche

[license-url]: https://github.com/tstyche/tstyche-intellij-reporter/blob/main/LICENSE.md
