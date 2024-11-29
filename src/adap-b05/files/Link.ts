import { Node } from "./Node";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { ExceptionType } from "../common/AssertionDispatcher";

export class Link extends Node {

    protected targetNode: Node | null = null;

    constructor(bn: string, pn: Directory, tn?: Node) {
        super(bn, pn);

        if (tn != undefined) {
            this.targetNode = tn;
        }
    }

    public getTargetNode(): Node | null {
        return this.targetNode;
    }

    public setTargetNode(target: Node): void {
        this.assertIsNotUndefined(target);
        this.targetNode = target;
    }

    public getBaseName(): string {
        const target = this.ensureTargetNode(this.targetNode);
        return target.getBaseName();
    }

    public rename(bn: string): void {
        this.assertIsValidBaseName(bn, ExceptionType.PRECONDITION);

        const target = this.ensureTargetNode(this.targetNode);
        target.rename(bn);

        this.assertClassInvariants();
    }

    protected ensureTargetNode(target: Node | null): Node {
        this.assertIsNotUndefined(target);

        const result: Node = this.targetNode as Node;
        return result;
    }

    //assertion methods
    protected assertIsNotUndefined(node: Node | null): void {
        let condition: boolean = (node !== undefined);
        IllegalArgumentException.assertCondition(condition, "undefined argument");
    }
}