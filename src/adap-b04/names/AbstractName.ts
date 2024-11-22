import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.assertIsNotNullOrUndefined(delimiter);
        this.assertIsValidDelimiter(delimiter);

        this.delimiter = delimiter;
    }

    public clone(): Name {
        return Object.create(this);
    }

    public asString(delimiter: string = this.delimiter): string {
        this.assertIsNotNullOrUndefined(delimiter);
        this.assertIsValidDelimiter(delimiter);

        //remove escape chars
        let result = "";
        for(let i=0; i<this.getNoComponents(); i++){
            result += this.removeEscapeCharactersBeforeDelimiters(this.getComponent(i), this.delimiter);
            if(i < this.getNoComponents() - 1){
                result += delimiter;
            }
        }
        return result;
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        let components: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            components.push(this.getComponent(i));
        }
        return components.join(this.delimiter);
    }

    public isEqual(other: Name): boolean {
        this.assertIsNotNullOrUndefined(other);

        if(this.getHashCode() !== other.getHashCode() || this.getNoComponents() !== other.getNoComponents() || this.getDelimiterCharacter() !== other.getDelimiterCharacter()){
            return false;
        }
        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }

        return this.asDataString() === other.asDataString();
    }

    public getHashCode(): number {
        let hashCode: number = 0;
        const s: string = this.asDataString();
        for (let i: number = 0; i < s.length; i++) {
            let c: number = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }
        return hashCode;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public concat(other: Name): void {
        this.assertIsNotNullOrUndefined(other);

        if(other.getDelimiterCharacter() !== this.getDelimiterCharacter()){
            throw new Error("Delimiters differ");
        }
        for(let i=0; i<other.getNoComponents(); i++){
            this.append(other.getComponent(i));
        }
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;


    //helper methods
    protected removeEscapeCharactersBeforeDelimiters(s: string, delimiter: string): string {
        for(let i=0; i<s.length-1; i++){
            if(s[i] === ESCAPE_CHARACTER && s[i+1] === delimiter){
                s = s.substring(0, i) + s.substring(i+1);
            }
        }
        return s;
    }

    protected isIndexOutOfBounds(i: number): boolean {
        return i < 0 || i >= this.getNoComponents();
    }


    //assertion methods
    protected assertIsNotNullOrUndefined(other: Object): void {
        let condition: boolean = !IllegalArgumentException.isNullOrUndefined(other);
        IllegalArgumentException.assertCondition(condition, "null or undefined argument");        
    }

    protected assertIsValidDelimiter(delimiter: string): void {
        let condition: boolean = delimiter.length === 1 && delimiter !== ESCAPE_CHARACTER;
        IllegalArgumentException.assertCondition(condition, "Delimiter must be a single character and not the escape character");
    }

    //checks one single component
    protected assertIsValidComponent(c: string): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(c, "Component is null or undefined");
        for(let i=0; i<c.length; i++){
            let char: string = c[i];
            let condition: boolean = (char === this.delimiter && (i===0 || c[i-1] !== ESCAPE_CHARACTER));
            IllegalArgumentException.assertCondition(!condition, "Delimiter without preceding escape char is not allowed in component");
        }
    }

    protected assertIsValidIndex(i: number): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(i, "Index is null or undefined");
        let condition: boolean = !this.isIndexOutOfBounds(i);
        IllegalArgumentException.assertCondition(condition, "Index out of bounds");
    }
}