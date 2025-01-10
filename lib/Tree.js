import path from "node:path";
import { Node } from "./Node.js";

export class Tree {
  /** @type {string | undefined} */
  #currentFilePath = undefined;
  /** @type {Node | undefined} */
  #currentNode = undefined;
  #idCount = 0;
  /** @type {Map<number, Node>} */
  #nodes = new Map();

  /**
   * @param {import("tstyche/tstyche").TestMember} testMember
   * @param {string} nodeType
   */
  add(testMember, nodeType) {
    return this.#createNode(testMember.name, nodeType, testMember);
  }

  /**
   * @param {string} filePath
   */
  addFile(filePath) {
    this.#currentFilePath = filePath;

    return this.#createNode(path.basename(filePath), "file", /* testMember */ undefined);
  }

  #createId() {
    return ++this.#idCount;
  }

  /**
   * @param {string} name
   * @param {string} nodeType
   * @param {import("tstyche/tstyche").TestMember | undefined} testMember
   */
  #createNode(name, nodeType, testMember) {
    const locationPath = this.#getLocationPath(testMember);

    const node = new Node(this.#createId(), name, nodeType, locationPath, this.#currentNode);
    this.#currentNode = node;
    this.#nodes.set(node.nodeId, node);

    return node;
  }

  /**
   * @param {import("tstyche/tstyche").TestMember | import("tstyche/tstyche").TestTree | undefined} testMember
   */
  #getLocationPath(testMember) {
    /** @type {Array<string>} */
    const text = [];

    while (testMember != null && "name" in testMember) {
      text.push(testMember.name);
      testMember = testMember.parent;
    }

    if (this.#currentFilePath != null) {
      text.push(this.#currentFilePath);
    }

    return text
      .map((element) => element.replace(/\./g, "\\."))
      .reverse()
      .join(".");
  }

  remove() {
    const nodeId = this.#currentNode?.nodeId;

    if (nodeId != null) {
      this.#currentNode = this.#currentNode && this.#nodes.get(this.#currentNode.parentNodeId);
      this.#nodes.delete(nodeId);
    }

    return { nodeId };
  }

  removeFile() {
    this.#currentFilePath = undefined;

    return this.remove();
  }
}
