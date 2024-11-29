import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;
    protected indices: number[] = []; //indices of delimiter characters

    constructor(other: string, delimiter?: string) {
        super(delimiter); //this checks and sets the delimiter
        this.assertIsNotNullOrUndefined(other);
        //TODO: maybe check single components for validity, but this is probably not necessary, since methods expect properly masked components

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

        MethodFailedException.assertIsNotNullOrUndefined(this.name, "Components not correctly set");
        this.assertClassInvariants();
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        this.assertIsValidIndex(i);

        let start = this.indices[i] + 1;
        let end = (i === this.noComponents - 1) ? this.name.length : this.indices[i + 1];
        this.assertClassInvariants();
        return this.name.substring(start, end);
    }

    public setComponent(i: number, c: string) {
        this.assertIsValidIndex(i);
        this.assertIsValidComponent(c);

        const original = new StringName(this.name, this.delimiter);

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

        MethodFailedException.assertIsNotNullOrUndefined(this.getComponent(i), "Component not correctly set");
        this.assertSet(i, c, original);
        this.assertClassInvariants();
    }

    public insert(i: number, c: string) {
        this.assertIsValidIndexForInsert(i);
        this.assertIsValidComponent(c);

        if(i === this.getNoComponents()){
            this.append(c);
            return;
        }

        const original = new StringName(this.name, this.delimiter);

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

        MethodFailedException.assertIsNotNullOrUndefined(this.getComponent(i), "Component not correctly inserted");
        this.assertInsert(i, c, original);
        this.assertClassInvariants();
    }

    public append(c: string) {
        this.assertIsValidComponent(c);

        const original = new StringName(this.name, this.delimiter);

        if(this.getNoComponents() === 0){
            this.name = c;
            this.indices.push(-1);
            this.noComponents++;
            return;
        }
        this.indices.push(this.name.length);
        this.name += this.delimiter + c;
        this.noComponents++;

        MethodFailedException.assertIsNotNullOrUndefined(this.getComponent(this.getNoComponents()-1), "Component not correctly appended");
        this.assertAppend(c, original);
        this.assertClassInvariants();
    }

    public remove(i: number) {
        this.assertIsValidIndex(i);
        
        const original = new StringName(this.name, this.delimiter);
        const removedComponent = this.getComponent(i);

        let start = (i === this.noComponents - 1) ? this.indices[i] : this.indices[i]+1;
        let end = (i === this.noComponents - 1) ? this.name.length : this.indices[i + 1];
        this.name = this.name.substring(0, start) + this.name.substring(end+1);

        //update indices
        this.indices.splice(i, 1);
        for(let j=i;j<this.indices.length;j++){
            this.indices[j] -= end+1 - start;
        }
        this.noComponents--;

        this.assertRemove(i, removedComponent, original);
        this.assertClassInvariants();
    }

    public concat(other: Name): void {
        this.assertOtherNameIsValid(other);

        const original = new StringName(this.name, this.delimiter);

        for(let i=0; i<other.getNoComponents(); i++){
            this.append(other.getComponent(i));
        }

        this.assertConcat(original, other);
        this.assertClassInvariants();
    }

    public getIndices(): number[] {
        return this.indices;
    }



    // post-conditions
    private restore(original: StringName) {
        this.name = original.name;
        this.indices = original.indices;
        this.noComponents = original.noComponents;
    }

    protected assertConstructor(): void {
        let condition = true;
        
        //TODO

        MethodFailedException.assertCondition(condition, "Components not correctly set");
    }

    protected assertSet(i: number, c: string, original: StringName): void {
        let condition = true;
        condition = this.getNoComponents() === original.getNoComponents();
        for(let j=0; j<i; j++){
            condition = this.getComponent(j) === original.getComponent(j);
        }
        for(let j=i+1; j<this.getNoComponents(); j++){
            condition = this.getComponent(j) === original.getComponent(j);
        }
        condition = this.getComponent(i) === c;

        if(!condition){this.restore(original);}
        MethodFailedException.assertCondition(condition, "Component not correctly set");
    }

    protected assertInsert(i: number, c: string, original: StringName): void {
        let condition = true;
        condition = this.getNoComponents() === original.getNoComponents() + 1;
        for(let j=0; j<i; j++){
            condition = this.getComponent(j) === original.getComponent(j);
        }
        condition = this.getComponent(i) === c;
        for(let j=i+1; j<this.getNoComponents(); j++){
            condition = this.getComponent(j) === original.getComponent(j-1);
        }
        if(!condition){this.restore(original);}
        MethodFailedException.assertCondition(condition, "Component not correctly inserted");
    }

    protected assertAppend(c: string, original: StringName): void {
        let condition = true;
        condition = this.getNoComponents() === original.getNoComponents() + 1;
        for(let j=0; j<this.getNoComponents()-1; j++){
            condition = this.getComponent(j) === original.getComponent(j);
        }
        condition = this.getComponent(this.getNoComponents()-1) === c;
        if(!condition){this.restore(original);}
        MethodFailedException.assertCondition(condition, "Component not correctly appended");
    }

    protected assertRemove(i: number, c: string, original: StringName): void {
        let condition = true;
        condition = this.getNoComponents() === original.getNoComponents() - 1;
        for(let j=0; j<i; j++){
            condition = this.getComponent(j) === original.getComponent(j);
        }
        for(let j=i; j<this.getNoComponents(); j++){
            condition = this.getComponent(j) === original.getComponent(j+1);
        }
        if(!condition){this.restore(original);}
        MethodFailedException.assertCondition(condition, "Component not correctly removed");
    }

    protected assertConcat(original: StringName, other:Name): void {
        let condition = true;
        for(let i=0; i<original.getNoComponents(); i++){
            condition = this.getComponent(i) === original.getComponent(i);
        }
        for(let i=0; i<other.getNoComponents(); i++){
            condition = this.getComponent(i+original.getNoComponents()) === other.getComponent(i);
        }
        if(!condition){this.restore(original);}
        MethodFailedException.assertCondition(condition, "Components not correctly concatenated");
    }

    // class invariants
    protected assertClassInvariants(){
        super.assertClassInvariants();

        //TODO
    }
}