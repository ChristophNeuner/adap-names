import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";

export class StringArrayName implements Name {

    protected components: string[] = [];
    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(other: string[], delimiter?: string) {
        //Prof. Riehle: Ich denke, eine leeres string array zu uebergeben sollte nicht erlaubt sein (im Constructor).
        //https://www.studon.fau.de/studon/ilias.php?ref_id=4447999&cmdClass=ilobjforumgui&thr_pk=385940&page=0&cmd=viewThread&cmdNode=13z:tp&baseClass=ilrepositorygui
        if(other === undefined || other === null || other.length === 0) {
            throw new Error("Name must not be undefined, null or empty");
        }
        if (delimiter !== undefined && delimiter !== null) {
            this.delimiter = delimiter;
        }
        this.components = other; //components might contain escape characters
    }

    /**
     * Returns a human-readable representation of the Name instance using user-set control characters
     * Control characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     */
    public asString(delimiter: string = this.delimiter): string {
        //remove escape chars
        let result = "";
        for(let i=0; i<this.components.length; i++){
            result += this.removeEscapeCharactersBeforeDelimiters(this.components[i], this.delimiter);
            if(i < this.components.length - 1){
                result += delimiter;
            }
        }
        return result;
    }

    /** 
     * Returns a machine-readable representation of Name instance using default control characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The control characters in the data string are the default characters
     */
    public asDataString(): string {
        return this.components.join(DEFAULT_DELIMITER);
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
        this.components[i] = c; //component might contain escape characters
    }

    /** Assumes that new Name component c is properly masked */
    public insert(i: number, c: string): void {
        //https://www.studon.fau.de/studon/ilias.php?ref_id=4447999&cmdClass=ilobjforumgui&thr_pk=385950&page=0&cmd=viewThread&cmdNode=13z:tp&baseClass=ilrepositorygui
        if(i<0 || i>this.getNoComponents()) {
            throw new Error("Index out of bounds");
        }else if(i === this.getNoComponents()){
            this.append(c);
            return;
        }
        this.components.splice(i, 0, c); //component might contain escape characters
    }

    /** Assumes that new Name component c is properly masked */
    public append(c: string): void {
        this.components.push(c); //component might contain escape characters
    }

    public remove(i: number): void {
        if(this.isIndexOutOfBounds(i)) {
            throw new Error("Index out of bounds");
        }
        this.components.splice(i, 1);
    }

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

    private isIndexOutOfBounds(i: number): boolean {
        return i < 0 || i >= this.getNoComponents();
    }

    private removeEscapeCharactersBeforeDelimiters(s: string, delimiter: string): string {
        for(let i=0; i<s.length-1; i++){
            if(s[i] === ESCAPE_CHARACTER && s[i+1] === delimiter){
                s = s.substring(0, i) + s.substring(i+1);
            }
        }
        return s;
    }
}