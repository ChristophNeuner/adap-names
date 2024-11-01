import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";

export class StringArrayName implements Name {

    protected components: string[] = [];
    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(other: string[], delimiter?: string) {
        this.components = other;
        if (delimiter !== undefined && delimiter !== null) {
            this.delimiter = delimiter;
        }
    }

    /**
     * Returns a human-readable representation of the Name instance using user-set control characters
     * Control characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     */
    public asString(delimiter: string = this.delimiter): string {
        return this.components.join(delimiter);
    }

    /** 
     * Returns a machine-readable representation of Name instance using default control characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The control characters in the data string are the default characters
     */
    public asDataString(): string {
        return this.components
            .map(component => component.replace(new RegExp(`\\${this.delimiter}`, 'g'), ESCAPE_CHARACTER + this.delimiter))
            .join(this.delimiter);
    }

    public isEmpty(): boolean {
        return this.components.length === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    /** Returns number of components in Name instance */
    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        if(this.isIndexOutOfBounds(i)) {
            throw new Error("Index out of bounds");
        }
        return this.components[i];
    }

    /** Assumes that new Name component c is properly masked */
    public setComponent(i: number, c: string): void {
        if(this.isIndexOutOfBounds(i)) {
            throw new Error("Index out of bounds");
        }
        this.components[i] = this.removeEscapeCharactersBeforeDelimiters(c, this.delimiter);
    }

    /** Assumes that new Name component c is properly masked */
    public insert(i: number, c: string): void {
        if(this.isIndexOutOfBounds(i)) {
            throw new Error("Index out of bounds");
        }
        this.components.splice(i, 0, this.removeEscapeCharactersBeforeDelimiters(c, this.delimiter));
    }

    /** Assumes that new Name component c is properly masked */
    public append(c: string): void {
        this.components.push(this.removeEscapeCharactersBeforeDelimiters(c, this.delimiter));
    }

    public remove(i: number): void {
        if(this.isIndexOutOfBounds(i)) {
            throw new Error("Index out of bounds");
        }
        this.components.splice(i, 1);
    }

    //TODO: implement
    public concat(other: Name): void {
        throw new Error("needs implementation");
    }

    private isIndexOutOfBounds(i: number): boolean {
        return i < 0 || i >= this.getNoComponents();
    }

    private removeEscapeCharactersBeforeDelimiters(s: string, delimiter:string): string {
        return s.replace(new RegExp(`${ESCAPE_CHARACTER}(?=${delimiter})`, 'g'),'');
    }
}