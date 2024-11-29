import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        super(delimiter); //this checks and sets the delimiter
        this.assertComponentsAreValid(other);

        this.components = [...other]; //components might contain escape characters

        this.assertConstructor(other);
        this.assertClassInvariants();
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.assertIsValidIndex(i);

        return this.components[i];
    }

    public setComponent(i: number, c: string) {
        this.assertIsValidIndex(i);
        this.assertIsValidComponent(c);

        const originalComponents = [...this.components]; //for post-conditions
        this.components[i] = c; //component might contain escape characters

        MethodFailedException.assertIsNotNullOrUndefined(this.components[i], "Component not correctly set");
        this.assertSet(i, c, originalComponents);
        this.assertClassInvariants();
    }

    public insert(i: number, c: string) {
        this.assertIsValidIndexForInsert(i);
        this.assertIsValidComponent(c);

        if(i === this.getNoComponents()){
            this.append(c);
            return;
        }

        const originalComponents = [...this.components]; //for post-conditions
        this.components.splice(i, 0, c); //component might contain escape characters

        MethodFailedException.assertIsNotNullOrUndefined(this.components[i], "Component not correctly inserted");
        this.assertInsert(i, c, originalComponents);
        this.assertClassInvariants();
    }

    public append(c: string) {
        this.assertIsValidComponent(c);

        const originalComponents = [...this.components]; //for post-conditions
        this.components.push(c); //component might contain escape characters

        MethodFailedException.assertIsNotNullOrUndefined(this.components[this.getNoComponents()-1], "Component not correctly appended");
        this.assertAppend(c, originalComponents);
        this.assertClassInvariants();
    }

    public remove(i: number) {
        this.assertIsValidIndex(i);

        const originalComponents = [...this.components]; //for post-conditions
        this.components.splice(i, 1);

        this.assertRemove(i, this.components[i], originalComponents);
        this.assertClassInvariants();
    }

    public concat(other: Name): void {
        this.assertOtherNameIsValid(other);
        const originalComponents = [...this.components]; //for post-conditions

        for(let i=0; i<other.getNoComponents(); i++){
            this.append(other.getComponent(i));
        }

        this.assertConcat(originalComponents, other);
        this.assertClassInvariants();
    }



    // pre-conditions
    protected assertComponentsAreValid(components: string[]): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(components, "Components array is null or undefined");

        for(let i=0; i<components.length; i++){
            this.assertIsValidComponent(components[i]);
        }
    }

    // post-conditions
    private restore(original: string[]) {
        this.components = original;
    }

    protected assertConstructor(components: string[]): void {
        let condition = true;
        for(let i=0; i<components.length; i++){
            condition = components[i] === this.getComponent(i);
        }
        MethodFailedException.assertCondition(condition, "Components not correctly set");
    }

    protected assertSet(i: number, c: string, original: string[]): void {
        let condition = true;
        condition = this.getNoComponents() === original.length;
        for(let j=0; j<i; j++){
            condition = this.getComponent(j) === original[j];
        }
        for(let j=i+1; j<this.getNoComponents(); j++){
            condition = this.getComponent(j) === original[j];
        }
        condition = this.getComponent(i) === c;

        if(!condition){this.restore(original);}
        MethodFailedException.assertCondition(condition, "Component not correctly set");
    }

    protected assertInsert(i: number, c: string, original: string[]): void {
        let condition = true;
        condition = this.getNoComponents() === original.length + 1;
        for(let j=0; j<i; j++){
            condition = this.getComponent(j) === original[j];
        }
        condition = this.getComponent(i) === c;
        for(let j=i+1; j<this.getNoComponents(); j++){
            condition = this.getComponent(j) === original[j-1];
        }
        if(!condition){this.restore(original);}
        MethodFailedException.assertCondition(condition, "Component not correctly inserted");
    }

    protected assertAppend(c: string, original: string[]): void {
        let condition = true;
        condition = this.getNoComponents() === original.length + 1;
        for(let j=0; j<this.getNoComponents()-1; j++){
            condition = this.getComponent(j) === original[j];
        }
        condition = this.getComponent(this.getNoComponents()-1) === c;
        if(!condition){this.restore(original);}
        MethodFailedException.assertCondition(condition, "Component not correctly appended");
    }

    protected assertRemove(i: number, c: string, original: string[]): void {
        let condition = true;
        condition = this.getNoComponents() === original.length - 1;
        for(let j=0; j<i; j++){
            condition = this.getComponent(j) === original[j];
        }
        for(let j=i; j<this.getNoComponents(); j++){
            condition = this.getComponent(j) === original[j+1];
        }
        if(!condition){this.restore(original);}
        MethodFailedException.assertCondition(condition, "Component not correctly removed");
    }

    protected assertConcat(original: string[], other:Name): void {
        let condition = true;
        for(let i=0; i<original.length; i++){
            condition = this.getComponent(i) === original[i];
        }
        for(let i=0; i<other.getNoComponents(); i++){
            condition = this.getComponent(i+original.length) === other.getComponent(i);
        }
        if(!condition){this.restore(original);}
        MethodFailedException.assertCondition(condition, "Components not correctly concatenated");
    }

    // class invariants
    protected assertClassInvariants(){
        super.assertClassInvariants();

        //TODO
    }
}