import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    protected name: string = "";
    protected length: number = 0; //number of components in Name instance
    protected indices: number[] = []; //indices of delimiter characters

    constructor(other: string, delimiter?: string) {
        if (delimiter !== undefined && delimiter !== null) {
            this.delimiter = delimiter;
        }

        this.name = other; //name might contain escape characters
        
        // set length
        if(other === ""){
            this.length = 0;
            return;
        }
        for(let i=0;i<this.name.length;i++) {
            if(this.name[i] === ESCAPE_CHARACTER) {
                i++; // skip escape character
            }else if(this.name[i] === this.delimiter) {
                this.length++;
            }
        }
        this.length++; //last component is not followed by delimiter

        // set indices
        this.indices.push(-1); //first component starts at index 0
        for(let i=0;i<this.name.length;i++) {
            if(this.name[i] === ESCAPE_CHARACTER) {
                i++; // skip escape character
            }else if(this.name[i] === this.delimiter) {
                this.indices.push(i);
            }
        }
    }

    /**
     * Returns a human-readable representation of the Name instance using user-set control characters
     * Control characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     */
    public asString(delimiter: string = this.delimiter): string {
        let result = "";
        for(let i=0;i<this.name.length;i++) {
            if(this.name[i] === ESCAPE_CHARACTER) {
                i++; // skip escape character
                result += this.name[i]; //append character after escape character to result
            }else if(this.name[i] === this.delimiter) {
                if(this.delimiter === delimiter){
                    result += this.delimiter;
                }else{
                    result += delimiter; //replace delimiter with the delimiter that is passed as parameter
                }
            }else{
                result += this.name[i];
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
        let result = "";
        for(let i=0;i<this.name.length;i++) {
            if(this.name[i] === this.delimiter && this.name[i-1] !== ESCAPE_CHARACTER) {
                //if delimiter is not escaped, append default delimiter
                result += DEFAULT_DELIMITER;
            }else{
                result += this.name[i];
            }
        }
        return result;
    }

    public isEmpty(): boolean {
        return this.length === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public getNoComponents(): number {
        return this.length;
    }

    public getComponent(x: number): string {
        let start = this.indices[x] + 1;
        let end = (x === this.length - 1) ? this.name.length : this.indices[x + 1];
        return this.name.substring(start, end);
    }

    /** Assumes that new Name component c is properly masked */
    public setComponent(n: number, c: string): void {
        let oldComponent = this.getComponent(n);
        let start = this.indices[n] + 1;
        let end = (n === this.length - 1) ? this.name.length : this.indices[n + 1];
        this.name = this.name.substring(0, start) + c + this.name.substring(end);
        //update indices
        if(oldComponent.length === c.length){
            return;
        }
        let diff = c.length - oldComponent.length;
        for(let i=n+1;i<this.indices.length;i++){
            this.indices[i] += diff;
        }
    }

    /** Assumes that new Name component c is properly masked */
    public insert(n: number, c: string): void {
        if(n < 0 || n > this.getNoComponents()){
            throw new Error("Index out of bounds");
        }
        else if(n === this.getNoComponents()){
            this.append(c);
        }else{
            let start = this.indices[n];
            this.name = this.name.substring(0, start+1) + c + this.delimiter + this.name.substring(start+1);
            //insert index for new component
            let numberToInsert = this.indices[n];
            let indexToInsert = n;
            this.indices.splice(indexToInsert, 0, numberToInsert);
            for(let i=n+1;i<this.indices.length;i++){
                this.indices[i] += c.length + 1;
            }
            this.length++;
        }
    }

    /** Assumes that new Name component c is properly masked */
    public append(c: string): void {
        this.name += this.delimiter + c;
        this.indices.push(this.name.length- c.length - 1);
        this.length++;
    }

    public remove(n: number): void {
        if(n < 0 || n >= this.length){
            throw new Error("Index out of bounds");
        }
        let start = (n === this.length - 1) ? this.indices[n] : this.indices[n]+1;
        let end = (n === this.length - 1) ? this.name.length : this.indices[n + 1];
        this.name = this.name.substring(0, start) + this.name.substring(end+1);

        //update indices
        this.indices.splice(n, 1);
        for(let i=n;i<this.indices.length;i++){
            this.indices[i] -= end+1 - start;
        }
        this.length--;
    }

    //TODO: implement
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

    public getIndices(): number[] {
        return this.indices;
    }
}