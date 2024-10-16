export class Name {

    public readonly DEFAULT_DELIMITER: string = '.';
    private readonly ESCAPE_CHARACTER = '\\';

    private components: string[] = [];
    private delimiter: string = this.DEFAULT_DELIMITER;

    constructor(other: string[], delimiter?: string) {
        this.components = other;
        if (delimiter != undefined) {
            this.delimiter = delimiter;
        }
    }

    public asNameString(delimiter: string = this.delimiter): string {
        let result: string = "";
        for (let i = 0; i < this.components.length; i++) {
            if (i > 0 && i < this.components.length) {
                result += delimiter;
            }
            result += this.components[i];
        }
        return result;
    }

    public getComponent(i: number): string {
        if(i < 0 || i >= this.components.length) {
            throw new Error("Index out of bounds");
        }
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        if(i < 0 || i >= this.components.length) {
            throw new Error("Index out of bounds");
        }
        this.components[i] = c;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public insert(i: number, c: string): void {
        if(i < 0 || i >= this.components.length) {
            throw new Error("Index out of bounds");
        }
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        this.components.push(c);
    }

    public remove(i: number): void {
        if(i < 0 || i >= this.components.length) {
            throw new Error("Index out of bounds");
        }
        this.components.splice(i, 1);
    }

}