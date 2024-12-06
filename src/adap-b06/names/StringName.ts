import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(other: string, delimiter?: string) {
        super(delimiter);
        this.assertHasValidParameter(other, "other cannot be null or undefined");
        this.init(other)
        this.assertIsValidNameState(other);
    }

    public createOrigin(): Name {
        return new StringName("", DEFAULT_DELIMITER);
    }
    
    public init(other: string): void {
        this.name = other;
        this.noComponents = this.getNoComponents();
    }

    public reset(original: string, noComponents: number): void {
        this.name = original;
        this.noComponents = noComponents;
    }

    // methods for assertions (class invariants)
    protected assertStringNameIsValid(): void {
        super.assertAbstractNameIsValid();
        InvalidStateException.assert(this.isNotNullOrUndefined(this.name), "Name cannot be null or undefined");
        InvalidStateException.assert(this.isNotNullOrUndefined(this.noComponents), "noComponents cannot be null or undefined");
        InvalidStateException.assert(this.noComponents === this.getNoComponents(), "noComponents is not === to the noComponents in Name");
    }

    public getNoComponents(): number {
        return this.asStringArrayName().length;
    }

    public getComponent(i: number): string {
        this.assertHasValidIndex(i);
        const component = this.asStringArrayName()[i];
        return component;
    }

    public setComponent(i: number, c: string): Name {
        this.assertHasValidIndex(i);
        this.assertHasValidParameter(c);

        let deepCopy = structuredClone(this);
        let deepCopyComponents = deepCopy.asStringArrayName();
        deepCopyComponents[i] = c;
        deepCopy.name = deepCopy.asStringName(deepCopyComponents); 

        deepCopy.assertIsValidComponent("set", c, i, this.name, this.getNoComponents());
        return deepCopy;
    }

    public insert(i: number, c: string): Name {
        this.assertHasValidIndex(i);
        this.assertHasValidParameter(c);

        let deepCopy = structuredClone(this);
        let deepCopyComponents = deepCopy.asStringArrayName();
        deepCopyComponents.splice(i, 0, c);
        deepCopy.name = this.asStringName(deepCopyComponents);
        deepCopy.noComponents += 1;

        deepCopy.assertIsValidComponent("insert", c, i, this.name, this.getNoComponents());
        return deepCopy;
    }

    public append(c: string): Name {
        this.assertHasValidParameter(c);
        
        let deepCopyString = structuredClone(this.name);
        deepCopyString += this.getDelimiterCharacter() + c;
        let result = new StringName(deepCopyString, this.getDelimiterCharacter());

        result.assertIsValidComponent("append", c, null, this.name, this.getNoComponents());
        return result;
    }

    public remove(i: number):Name {
        this.assertHasValidIndex(i);

        let deepCopyString = structuredClone(this.name);
        let deepCopyComponents = this.asStringArrayName(deepCopyString);
        deepCopyComponents.splice(i, 1);
        let result = new StringName(this.asStringName(deepCopyComponents), this.getDelimiterCharacter());
        
        result.assertIsValidComponent("remove", null, i, this.name, this.getNoComponents());
        return result;
    }

    protected splitComponents(str: string, delimiter: string = this.getDelimiterCharacter()): string[] {
        const regex = this.createRegexForDelimiter(delimiter);
        return str.split(regex);
    }

    protected createRegexForDelimiter(delimiter: string): RegExp {
        const regexEscapedDelimiter = delimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp(`(?<!\\${ESCAPE_CHARACTER})${regexEscapedDelimiter}`, "g");
    }

    protected asStringArrayName(str: string = this.name): string[] {
        return this.splitComponents(str, this.getDelimiterCharacter());
    }

    protected asStringName(stringArrayName: string[], delimiter: string = this.getDelimiterCharacter()): string {
        return stringArrayName.join(delimiter);
    }

    // methods for assertions (preconditions)
    protected assertHasValidIndex(i: number): void {
        IllegalArgumentException.assert(this.isNotNullOrUndefined(i));
        IllegalArgumentException.assert((i >= 0 && i < this.getNoComponents()), "Index is out of bounds");
    }

    // methods for assertions (post-conditions)
    protected assertIsValidNameState(name: string): void {
        MethodFailedException.assert(this.name === name, "StringName validation failed");
    }

    protected assertIsValidComponent(
        operationType: "set" | "insert" | "append" | "remove",
        component: string | null,
        index: number | null,
        original: string,
        originalNoComponents: number
    ): void {
        const expectedNoComponents =
            operationType === "set" ? originalNoComponents :
            operationType === "insert" || operationType === "append" ? originalNoComponents + 1 :
            operationType === "remove" ? originalNoComponents - 1 :
            originalNoComponents;
    
        const stringArrayName = this.asStringArrayName();
        const origArrayName = this.asStringArrayName(original);

        if (this.noComponents !== expectedNoComponents) {
            //this.reset(original, originalNoComponents);
            MethodFailedException.assert(false, "Component validation failed");
        }

        for (let i_orig = 0, i_new = 0; i_orig < originalNoComponents; i_orig++, i_new++) {
            if (operationType === "insert" && i_orig === index) {
                if (stringArrayName[i_new] !== component) {
                    //this.reset(original, originalNoComponents);
                    MethodFailedException.assert(false, "Insert component validation failed");
                }
                i_new++; // Springe in der neuen Liste weiter
            } else if (operationType === "remove" && i_orig === index) {
                i_orig++; // Überspringe den removed Index in der alten Liste
            } else if (operationType === "set" && i_orig === index) {
                if (stringArrayName[i_new] !== component) {
                    //this.reset(original, originalNoComponents);
                    MethodFailedException.assert(false, "Set component validation failed");
                }
            } else if (stringArrayName[i_new] !== origArrayName[i_orig]) {
                //this.reset(original, originalNoComponents);
                MethodFailedException.assert(false, `Component mismatch after ${operationType}`);
            }
        }

        if (operationType === "append" && stringArrayName[originalNoComponents] !== component) {
            //this.reset(original, originalNoComponents);
            MethodFailedException.assert(false, "Append component validation failed");
        }
    }
    
}