import { Name } from "../names/Name";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { RootNode } from "./RootNode";
import { ExceptionType, AssertionDispatcher } from "../common/AssertionDispatcher";
import { ServiceFailureException } from "../common/ServiceFailureException";
import { Exception } from "../common/Exception";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        //this.assertIsValidBaseName(bn, ExceptionType.PRECONDITION);

        this.doSetBaseName(bn);
        this.parentNode = pn; // why oh why do I have to set this
        this.initialize(pn);

        //this.assertClassInvariants();
    }

    protected initialize(pn: Directory): void {
        this.parentNode = pn;
        this.parentNode.add(this);
    }

    public move(to: Directory): void {
        this.parentNode.remove(this);
        to.add(this);
        this.parentNode = to;

        this.assertClassInvariants();
    }

    public getFullName(): Name {
        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        return result;
    }

    public getBaseName(): string {
        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        this.assertIsValidBaseName(bn, ExceptionType.PRECONDITION);

        this.doSetBaseName(bn);

        this.assertClassInvariants();
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Node {
        return this.parentNode;
    }

    /**
     * Returns all nodes in the tree that match bn
     * @param bn basename of node being searched for
     */
    public findNodes(bn: string): Set<Node> {
        console.log(`Searching in current node: bn = ${this.getBaseName()}, full name = ${this.getFullName()}`);
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, bn !== "" && bn !== null, "Invalid base name");
        const result: Set<Node> = new Set<Node>();
    
        try {
            // Check if current node's base name matches the search
            if (this.getBaseName() === bn) {
                result.add(this);
            }
    
            // Assert the class invariants after the operation
            this.assertClassInvariants(); 
    
        } catch (e: any) {
            console.log(`Exception caught in Node.findNodes: ${e}`);
            if(e instanceof ServiceFailureException) {
                throw e;
            }
            // Wrap caught exception into a ServiceFailureException
            ServiceFailureException.assertCondition(false, "findNodes failed in Node", e);
        }
    
        return result;
    }

    protected assertClassInvariants(): void {
        const bn: string = this.doGetBaseName();
        this.assertIsValidBaseName(bn, ExceptionType.CLASS_INVARIANT);
    }

    protected assertIsValidBaseName(bn: string, et: ExceptionType): void {
        const condition: boolean = (bn != "");
        AssertionDispatcher.dispatch(et, condition, "invalid base name");
    }
}
