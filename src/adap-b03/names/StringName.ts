import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected length: number = 0;
    protected indices: number[] = []; //indices of delimiter characters

    constructor(source: string, delimiter?: string) {
        super();
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
        if(this.getNoComponents() === 0){
            this.name = c;
            this.indices.push(-1);
            this.length++;
            return;
        }
        this.indices.push(this.name.length);
        this.name += this.delimiter + c;
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

    public getIndices(): number[] {
        return this.indices;
    }
}