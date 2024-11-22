import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;
    protected indices: number[] = []; //indices of delimiter characters

    constructor(other: string, delimiter?: string) {
        super();
        if (delimiter !== undefined && delimiter !== null) {
            this.delimiter = delimiter;
        }

        this.name = other; //name might contain escape characters
        
        // set length
        if(other === ""){
            this.noComponents = 0;
            return;
        }
        for(let i=0;i<this.name.length;i++) {
            if(this.name[i] === ESCAPE_CHARACTER) {
                i++; // skip escape character
            }else if(this.name[i] === this.delimiter) {
                this.noComponents++;
            }
        }
        this.noComponents++; //last component is not followed by delimiter

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
        return this.noComponents;
    }

    public getComponent(i: number): string {
        let start = this.indices[i] + 1;
        let end = (i === this.noComponents - 1) ? this.name.length : this.indices[i + 1];
        return this.name.substring(start, end);
    }

    public setComponent(i: number, c: string) {
        let oldComponent = this.getComponent(i);
        let start = this.indices[i] + 1;
        let end = (i === this.noComponents - 1) ? this.name.length : this.indices[i + 1];
        this.name = this.name.substring(0, start) + c + this.name.substring(end);
        //update indices
        if(oldComponent.length === c.length){
            return;
        }
        let diff = c.length - oldComponent.length;
        for(let j=i+1;j<this.indices.length;j++){
            this.indices[j] += diff;
        }
    }

    public insert(i: number, c: string) {
        if(i < 0 || i > this.getNoComponents()){
            throw new Error("Index out of bounds");
        }
        else if(i === this.getNoComponents()){
            this.append(c);
        }else{
            let start = this.indices[i];
            this.name = this.name.substring(0, start+1) + c + this.delimiter + this.name.substring(start+1);
            //insert index for new component
            let numberToInsert = this.indices[i];
            let indexToInsert = i;
            this.indices.splice(indexToInsert, 0, numberToInsert);
            for(let j=i+1;j<this.indices.length;j++){
                this.indices[j] += c.length + 1;
            }
            this.noComponents++;
        }
    }

    public append(c: string) {
        if(this.getNoComponents() === 0){
            this.name = c;
            this.indices.push(-1);
            this.noComponents++;
            return;
        }
        this.indices.push(this.name.length);
        this.name += this.delimiter + c;
        this.noComponents++;
    }

    public remove(i: number) {
        if(i < 0 || i >= this.noComponents){
            throw new Error("Index out of bounds");
        }
        let start = (i === this.noComponents - 1) ? this.indices[i] : this.indices[i]+1;
        let end = (i === this.noComponents - 1) ? this.name.length : this.indices[i + 1];
        this.name = this.name.substring(0, start) + this.name.substring(end+1);

        //update indices
        this.indices.splice(i, 1);
        for(let j=i;j<this.indices.length;j++){
            this.indices[j] -= end+1 - start;
        }
        this.noComponents--;
    }

    public getIndices(): number[] {
        return this.indices;
    }
}