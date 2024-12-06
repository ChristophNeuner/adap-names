import { Name } from "../names/Name";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { RootNode } from "./RootNode";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        this.assertIsNotNullOrUndefined(bn);
        this.assertIsNotNullOrUndefined(pn);
        this.assertIsValidName(bn);

        this.doSetBaseName(bn);
        this.parentNode = pn; // why oh why do I have to set this
        this.initialize(pn);
    }

    protected initialize(pn: Directory): void {
        this.parentNode = pn;
        this.parentNode.addChildNode(this);
    }

    public move(to: Directory): void {
        this.assertIsNotNullOrUndefined(to);

        this.parentNode.remove(this);
        to.add(this);
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
        this.assertIsNotNullOrUndefined(bn);
        this.assertIsValidName(bn);

        this.doSetBaseName(bn);
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        return this.parentNode;
    }

    //assertion methods
    protected assertIsNotNullOrUndefined(other: Object): void {
        let condition: boolean = !IllegalArgumentException.isNullOrUndefined(other);
        IllegalArgumentException.assertCondition(condition, "null or undefined argument");        
    }

    protected assertIsValidName(name: string): void {
        let condition: boolean = true;
        const disallowedPattern = /[\/\0]/; // Matches '/' or null character '\0'

        if (this instanceof RootNode) {
            // Only the RootNode is allowed to have an empty base name
            if(name === ""){
                return;
            }else{
                condition = false;
            }
        }

        if(name.length === 0){
            condition = false;
        }
        // Check for empty or whitespace-only string
        if (!name || name.trim() === '') {
            condition = false;
        }
        // Check for disallowed characters
        if (disallowedPattern.test(name)) {
            condition = false;
        }
        IllegalArgumentException.assertCondition(condition, "invalid name");
    }
}
