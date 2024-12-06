import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super();
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
}