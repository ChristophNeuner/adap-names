import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        super(delimiter); //this checks and sets the delimiter
        this.assertComponentsAreValid(other);
        this.components = other; //components might contain escape characters
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

        this.components[i] = c; //component might contain escape characters
    }

    public insert(i: number, c: string) {
        this.assertIsValidIndex(i);
        this.assertIsValidComponent(c);
        this.components.splice(i, 0, c); //component might contain escape characters
    }

    public append(c: string) {
        this.assertIsValidComponent(c);
        this.components.push(c); //component might contain escape characters
    }

    public remove(i: number) {
        this.assertIsValidIndex(i);
        this.components.splice(i, 1);
    }

    // assertion methods
    protected assertComponentsAreValid(components: string[]): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(components, "Components array is null or undefined");

        for(let i=0; i<components.length; i++){
            this.assertIsValidComponent(components[i]);
        }
    }
}