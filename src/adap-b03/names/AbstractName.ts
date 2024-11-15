import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }

    /**
     * Returns a human-readable representation of the Name instance using user-set control characters
     * Control characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     */
    public asString(delimiter: string = this.delimiter): string {
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

    /** 
     * Returns a machine-readable representation of Name instance using default control characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The control characters in the data string are the default characters
     */
    public asDataString(): string {
        let components: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            components.push(this.getComponent(i));
        }
        return components.join(DEFAULT_DELIMITER);
    }

    public isEqual(other: Name): boolean {
        return this.asDataString() === other.asDataString();
    }

    public getHashCode(): number {
        let hashCode: number = 0;
        const s: string = this.asDataString();
        for (let i = 0; i < s.length; i++) {
            let c = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }
        return hashCode;
    }

    public clone(): Name {
        const ClonedClass = this.constructor as { new (...args: any[]): AbstractName };
        const clone = new ClonedClass(this.delimiter);
        
        for (let i = 0; i < this.getNoComponents(); i++) {
            clone.append(this.getComponent(i));
        }
    
        return clone;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    // if the delimiters differ, concat shall return an error (siehe Studonkurs: 
    // https://www.studon.fau.de/studon/ilias.php?ref_id=4447999&cmdClass=ilobjforumgui&thr_pk=385173&page=0&cmd=viewThread&cmdNode=13z:tp&baseClass=ilRepositoryGUI)
    public concat(other: Name): void {
        if(other.getDelimiterCharacter() !== this.getDelimiterCharacter()){
            throw new Error("Delimiters differ");
        }
        for(let i=0; i<other.getNoComponents(); i++){
            this.append(other.getComponent(i));
        }
    }

    protected removeEscapeCharactersBeforeDelimiters(s: string, delimiter: string): string {
        for(let i=0; i<s.length-1; i++){
            if(s[i] === ESCAPE_CHARACTER && s[i+1] === delimiter){
                s = s.substring(0, i) + s.substring(i+1);
            }
        }
        return s;
    }
}