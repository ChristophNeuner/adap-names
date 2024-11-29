import { Node } from "./Node";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
//Test
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