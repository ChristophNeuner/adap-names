import { Node } from "./Node";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public add(cn: Node): void {
        this.assertIsNotNullOrUndefined(cn);
        this.assertChildNodeNotAlreadyPresent(cn);
        this.childNodes.add(cn);
    }

    public remove(cn: Node): void {
        this.assertIsNotNullOrUndefined(cn);
        this.assertChildNodeAlreadyPresent(cn);
        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }

    /**
     * Returns all nodes in the tree that match bn
     * @param bn basename of node being searched for
     */
    public override findNodes(bn: string): Set<Node> {
        const result: Set<Node> = super.findNodes(bn);
        for (const child of this.childNodes) {
            child.findNodes(bn).forEach(node => result.add(node));
        }
        return result;
    }

    //assertion methods
    protected assertChildNodeNotAlreadyPresent(cn: Node): void {
        let condition: boolean = !this.childNodes.has(cn);
        IllegalArgumentException.assertCondition(condition, "child node already present");
    }

    protected assertChildNodeAlreadyPresent(cn: Node): void {
        let condition: boolean = this.childNodes.has(cn);
        IllegalArgumentException.assertCondition(condition, "child node not present");
    }
}