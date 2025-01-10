export class Node {
  /** @type {number} */
  nodeId;
  /** @type {string} */
  name;
  /** @type {number} */
  parentNodeId;
  /** @type {string} */
  nodeType;
  /** @type {string} */
  locationHint;

  /**
   * @param {number} nodeId
   * @param {string} name
   * @param {string} nodeType
   * @param {string} locationPath
   * @param {Node} [parent]
   */
  constructor(nodeId, name, nodeType, locationPath, parent) {
    this.nodeId = nodeId;
    this.name = name;
    this.parentNodeId = parent?.nodeId ?? 0;
    this.nodeType = nodeType;
    this.locationHint = `${nodeType}://${locationPath}`;
  }
}
