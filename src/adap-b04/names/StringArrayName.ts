import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailureException } from "../common/MethodFailureException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        super(delimiter); //this checks and sets the delimiter
        this.assertComponentsAreValid(other);

        this.components = [...other]; //components might contain escape characters

        this.assertConstructor(other);
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

        MethodFailureException.assertIsNotNullOrUndefined(this.components[i], "Component not correctly set");
        this.assertSet(i, c, originalComponents);
    }

    public insert(i: number, c: string) {
        this.assertIsValidIndex(i);
        this.assertIsValidComponent(c);

        const originalComponents = [...this.components]; //for post-conditions
        this.components.splice(i, 0, c); //component might contain escape characters

        MethodFailureException.assertIsNotNullOrUndefined(this.components[i], "Component not correctly inserted");
        this.assertInsert(i, c, originalComponents);
    }

    public append(c: string) {
        this.assertIsValidComponent(c);

        const originalComponents = [...this.components]; //for post-conditions
        this.components.push(c); //component might contain escape characters

        MethodFailureException.assertIsNotNullOrUndefined(this.components[this.getNoComponents()-1], "Component not correctly appended");
        this.assertAppend(c, originalComponents);
    }

    public remove(i: number) {
        this.assertIsValidIndex(i);

        const originalComponents = [...this.components]; //for post-conditions
        this.components.splice(i, 1);

        this.assertRemove(i, this.components[i], originalComponents);
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
        MethodFailureException.assertCondition(condition, "Components not correctly set");
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
        MethodFailureException.assertCondition(condition, "Component not correctly set");
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
        MethodFailureException.assertCondition(condition, "Component not correctly inserted");
    }

    protected assertAppend(c: string, original: string[]): void {
        let condition = true;
        condition = this.getNoComponents() === original.length + 1;
        for(let j=0; j<this.getNoComponents()-1; j++){
            condition = this.getComponent(j) === original[j];
        }
        condition = this.getComponent(this.getNoComponents()-1) === c;
        if(!condition){this.restore(original);}
        MethodFailureException.assertCondition(condition, "Component not correctly appended");
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
        MethodFailureException.assertCondition(condition, "Component not correctly removed");
    }
}