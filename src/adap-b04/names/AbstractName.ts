import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailureException } from "../common/MethodFailureException";
import { StringName } from "./StringName";
import { StringArrayName } from "./StringArrayName";
import { InvalidStateException } from "../common/InvalidStateException";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        
        this.assertIsNotNullOrUndefined(delimiter);
        this.assertIsValidDelimiter(delimiter);

        this.delimiter = delimiter;


        this.assertCorrectDelimiter(delimiter);
        this.assertClassInvariants();
    }

    public clone(): Name {
        let clone = Object.create(this);

        this.assertCorrectClone(clone);
        this.assertClassInvariants();
        return clone;
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


        this.assertIsNotNullOrUndefined(result);
        this.assertNotContainsEscapeChar(result);
        this.assertClassInvariants();

        return result;
    }

    public toString(): string {
        let dataString = this.asDataString();
        this.assertIsNotNullOrUndefined(dataString);
        this.assertClassInvariants();
        return dataString;
    }

    public asDataString(): string {
        let components: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            components.push(this.getComponent(i));
        }
        let result = components.join(this.delimiter);


        this.assertIsNotNullOrUndefined(result);
        this.assertClassInvariants();
        return result;
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

        this.assertClassInvariants();
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


        this.assertIsNotNullOrUndefined(hashCode);
        this.assertClassInvariants();
        return hashCode;
    }

    public isEmpty(): boolean {
        this.assertClassInvariants();
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        this.assertClassInvariants();
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;
    abstract concat(other: Name): void;


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


    //pre-conditions
    protected assertIsNotNullOrUndefined(other: Object): void {
        let condition: boolean = !IllegalArgumentException.isNullOrUndefined(other);
        IllegalArgumentException.assertCondition(condition, "null or undefined argument");        
    }

    protected assertIsValidDelimiter(delimiter: string): void {
        let condition: boolean = delimiter.length === 1 && delimiter !== ESCAPE_CHARACTER;
        IllegalArgumentException.assertCondition(condition, "Delimiter must be a single character and not the escape character");
    }

    protected assertOtherNameIsValid(other: Name): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(other, "Other name is null or undefined");
        IllegalArgumentException.assertCondition(other.getDelimiterCharacter() === this.delimiter, "Delimiters do not match");
        for(let i=0; i<other.getNoComponents(); i++){
            this.assertIsValidComponent(other.getComponent(i));
        }
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


    // post-conditions
    protected assertCorrectDelimiter(delimiter: string){
        let condition: boolean = this.delimiter === delimiter;
        MethodFailureException.assertCondition(condition, "Delimiter not set correctly");
    }

    protected assertCorrectClone(clone: Name){
        let condition: boolean = this.asDataString() === clone.asDataString();
        MethodFailureException.assertCondition(condition, "Clone not equal to original");
    }

    protected assertNotContainsEscapeChar(s: string){
        let condition: boolean = s.indexOf(ESCAPE_CHARACTER) === -1;
        MethodFailureException.assertCondition(condition, "String contains delimiter");
    }

    protected assertCorrectDataString(dataString: string){
        // from a data string, the original name can be reconstructed
        let condition: boolean = true;
        if(this instanceof StringName){
            let name: StringName = new StringName(dataString, this.delimiter);
            let condition: boolean = name.asDataString() === dataString;        
        }else if(this instanceof StringArrayName){
            let comps: string[] = [];
            for(let i=0; i<this.getNoComponents(); i++){
                comps.push(this.getComponent(i));
            }
            let name: StringArrayName = new StringArrayName(comps, this.delimiter);
            let condition: boolean = name.asDataString() === dataString;        
        }
        MethodFailureException.assertCondition(condition, "Data string not equal to asDataString");
    }
    
    // class invariants
    protected assertClassInvariants(){
        InvalidStateException.assertIsNotNullOrUndefined(this.delimiter, "Delimiter null or undefined");

        let condition: boolean = true;
        condition = this.delimiter.length === 1;
        condition = this.delimiter !== ESCAPE_CHARACTER;
        InvalidStateException.assertCondition(condition, "Delimiter not correctly set");
    }
}