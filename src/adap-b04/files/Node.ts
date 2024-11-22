import { Name } from "../names/Name";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        this.assertIsNotNullOrUndefined(bn);
        this.assertIsNotNullOrUndefined(pn);
        this.assertIsValidName(bn);

        this.doSetBaseName(bn);
        this.parentNode = pn;
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

    public getParentNode(): Node {
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

        //only the root directory can have an empty name
        //TODO: find a way to identify the root directory, but do not allow other nodes to have an empty name
        if(name === ""){
            return;
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
