import { InvalidStateException } from "../common/InvalidStateException";
import { ServiceFailureException } from "../common/ServiceFailureException";
import { Exception } from "../common/Exception";
import { Node } from "./Node";
import { RootNode } from "./RootNode";
import { AssertionDispatcher, ExceptionType } from "../common/AssertionDispatcher";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public add(cn: Node): void {
        //this.assertIsNotNullOrUndefined(cn);
        //this.assertChildNodeNotAlreadyPresent(cn);
        this.childNodes.add(cn);
    }

    public remove(cn: Node): void {
        //this.assertIsNotNullOrUndefined(cn);
        //this.assertChildNodeAlreadyPresent(cn);
        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }

    public override findNodes(bn: string): Set<Node> {
        console.log(`Directory.findNodes(${bn})`);
        const result: Set<Node> = new Set();
    
        try {
            if(this.getBaseName() === bn) {
                result.add(this);
            }
            // Check child nodes recursively
            for (const child of this.childNodes) {
                child.findNodes(bn).forEach(node => result.add(node));
            }
            this.assertClassInvariants();
    
        } catch (e: any) {
            console.log(`Exception caught in Directory.findNodes: ${e}`);
            if(e instanceof ServiceFailureException) {
                throw e;
            }
            ServiceFailureException.assertCondition(false, "findNodes failed in Directory", e);
        }
    
        return result;
    }

    //assertion methods
    /* protected assertChildNodeNotAlreadyPresent(cn: Node): void {
        let condition: boolean = !this.childNodes.has(cn);
        IllegalArgumentException.assertCondition(condition, "child node already present");
    } */

    /* protected assertChildNodeAlreadyPresent(cn: Node): void {
        let condition: boolean = this.childNodes.has(cn);
        IllegalArgumentException.assertCondition(condition, "child node not present");
    } */
}