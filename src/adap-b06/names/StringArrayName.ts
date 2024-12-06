import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringArrayName extends AbstractName {
  protected components: string[] = [];

  constructor(other: string[], delimiter?: string) {
    super(delimiter);
    this.assertHasValidParameter(other, "other cannot be null or undefined");
    this.init(other);
    this.assertIsValidStringArrayNameState(other);
  }

  public createOrigin(): Name {
    return new StringArrayName([""], DEFAULT_DELIMITER);
  }

  public init(other: string[]) {
    this.components = [...other];
  }

  // methods for assertions (class invariants)
  protected assertStringArrayNameisValid() {
    super.assertAbstractNameIsValid();
    InvalidStateException.assert(
      this.isNotNullOrUndefined(this.components),
      "Components cannot be null or undefined"
    );

    this.components.forEach((c) => {
      InvalidStateException.assert(
        this.isNotNullOrUndefined(c),
        "A component in components is null or undefined"
      );
    });
  }

  public getNoComponents(): number {
    return this.components.length;
  }

  public getComponent(i: number): string {
    this.assertHasValidIndex(i);
    return this.components[i];
  }

  public setComponent(i: number, c: string): Name {
    this.assertHasValidIndex(i);
    this.assertHasValidParameter(c);

    let deepCopiedComponents = structuredClone(this.components);
    deepCopiedComponents[i] = c;
    let result = new StringArrayName(deepCopiedComponents, this.getDelimiterCharacter());

    result.assertIsValidComponent("set", c, i, this.components, this.getNoComponents());
    return result;
  }

  public insert(i: number, c: string): Name {
    this.assertHasValidIndexForInsert(i);
    this.assertHasValidParameter(c);

    let deepCopiedComponents = structuredClone(this.components);
    deepCopiedComponents.splice(i, 0, c);
    let result = new StringArrayName(deepCopiedComponents, this.getDelimiterCharacter());

    result.assertIsValidComponent("insert", c, i, this.components, this.getNoComponents());
    return result;
  }

  public append(c: string) {
    this.assertHasValidParameter(c);

    let deepCopiedComponents = structuredClone(this.components);
    deepCopiedComponents.push(c);
    let result = new StringArrayName(deepCopiedComponents, this.getDelimiterCharacter());

    result.assertIsValidComponent("append", c, null, this.components, this.getNoComponents());
    return result;
  }

  public remove(i: number) {
    this.assertHasValidIndex(i);

    let deepCopiedComponents = structuredClone(this.components);
    deepCopiedComponents.splice(i, 1);
    let result = new StringArrayName(deepCopiedComponents, this.getDelimiterCharacter());

    result.assertIsValidComponent("remove", null, i, this.components, this.getNoComponents());
    return result;
  }

  // methods for assertions (preconditions)
  protected assertHasValidIndex(i: number): void {
    IllegalArgumentException.assert(this.isNotNullOrUndefined(i));
    IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents(), "Index is out of bounds");
  }

  protected assertHasValidIndexForInsert(i: number): void {
    IllegalArgumentException.assert(this.isNotNullOrUndefined(i));
    IllegalArgumentException.assert(i >= 0 && i <= this.getNoComponents(),"Index is out of bounds for insertion");
  }

  // methods for assertions (post-conditions)
  protected assertIsValidStringArrayNameState(components: String[]): void {
    const cond = components.every((comp, index) => comp === this.components[index]);
    MethodFailedException.assert(cond, "StringArrayName validation failed");
  }

  protected assertIsValidComponent(
    operationType: "set" | "insert" | "append" | "remove",
    component: string | null,
    index: number | null,
    originalComponents: string[],
    originalNoComponents: number
  ): void {
    const expectedNoComponents =
      operationType === "set"
        ? originalNoComponents
        : operationType === "insert" || operationType === "append"
        ? originalNoComponents + 1
        : operationType === "remove"
        ? originalNoComponents - 1
        : originalNoComponents;

    if (this.getNoComponents() !== expectedNoComponents) {
      //this.components = [...originalComponents];
      MethodFailedException.assert(false, `Component operation "${operationType}" failed: Invalid component count`);
    }

    for (let i_orig = 0, i_new = 0; i_orig < originalNoComponents; i_orig++, i_new++) {
      if (operationType === "insert" && i_orig === index) {
        if (this.components[i_new] !== component) {
          //this.components = [...originalComponents];
          MethodFailedException.assert(false, "Insert validation failed");
        }
        i_new++; // Springe in der neuen Liste weiter
      } else if (operationType === "remove" && i_orig === index) {
        i_orig++; // Überspringe den removed Index in der alten Liste
      } else if (operationType === "set" && i_orig === index) {
        if (this.components[i_new] !== component) {
            //this.components = [...originalComponents];
            MethodFailedException.assert(false, "Set validation failed");
        }
      } else if (this.components[i_new] !== originalComponents[i_orig]) {
        //this.components = [...originalComponents];
        MethodFailedException.assert(false, `Component operation "${operationType}" failed: Component mismatch`);
      }
    }

    if (operationType === "append" && this.components[originalNoComponents] !== component) {
      //this.components = [...originalComponents];
      MethodFailedException.assert(false, "Append validation failed");
    }
  }
}