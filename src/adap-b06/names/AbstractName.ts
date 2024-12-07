import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {
  protected delimiter: string = DEFAULT_DELIMITER;

  constructor(delimiter: string = DEFAULT_DELIMITER) {
    this.assertHasValidDelimiter(delimiter);
    if (delimiter !== undefined) {
      this.delimiter = delimiter;
    } else {
      this.delimiter = DEFAULT_DELIMITER;
    }
    this.assertIsValidDelimiter(delimiter);
  }

  public clone(): Name {
    let clone = Object.create(this);

    this.assertIsValidCloned(clone);
    return clone;
  }

  public asString(delimiter?: string): string {
    delimiter = delimiter ?? this.delimiter;
    this.assertHasValidDelimiter(delimiter);

    const components: string[] = [];

    for (let i = 0; i < this.getNoComponents(); i++) {
        const component = this.getComponent(i);   
        components.push(component.replaceAll(`${ESCAPE_CHARACTER}${this.getDelimiterCharacter()}`, this.getDelimiterCharacter()));
    }

    return components.join(delimiter);
}
  
  public toString(): string {
    return this.asDataString();
  }

  public asDataString(): string {
    let components: string[] = [];
    const escapeWithDelimiter = ESCAPE_CHARACTER + this.getDelimiterCharacter();

    for (let i = 0; i < this.getNoComponents(); i++) {
      const component = this.getComponent(i)
        .replaceAll(this.getDelimiterCharacter(), escapeWithDelimiter);
      components.push(component);
    }

    const name = components.join(this.getDelimiterCharacter());

    // Return a JSON-encoded object
    const data = {
      dataString: name,
      delimiter: this.getDelimiterCharacter(),
    };

    return JSON.stringify(data); // To ensure it's a machine-readable JSON string
  }

  public isEqual(other: Name): boolean {
    this.assertHasValidParameter(other, "other cannot be null or undefined");
    if (this.getNoComponents() !== other.getNoComponents()) return false;
    for (let i = 0; i < this.getNoComponents(); i++) {
      if (this.getComponent(i) !== other.getComponent(i)) return false;
    }
    this.assertIsValidHashCode(other);
    return true;
  }

  public getHashCode(): number {
    let hashCode: number = 0;
    const s: string = this.asDataString();
    for (let i = 0; i < s.length; i++) {
      let c = s.charCodeAt(i);
      hashCode = (hashCode << 5) - hashCode + c;
      hashCode |= 0;
    }
    return hashCode;
  }

  public isEmpty(): boolean {
    return this.getNoComponents() === 0;
  }

  public getDelimiterCharacter(): string {
    return this.delimiter;
  }

  abstract getNoComponents(): number;

  abstract getComponent(i: number): string;
  abstract setComponent(i: number, c: string): Name;

  abstract insert(i: number, c: string): Name;
  abstract append(c: string): Name;
  abstract remove(i: number): Name;
  abstract concat(other: Name): Name;

  // methods for assertions (preconditions)
  protected isNotNullOrUndefined(o: Object | null): boolean {
    return !(o === null || o === undefined);
  }

  protected assertAbstractNameIsValid() {
    InvalidStateException.assert(this.isNotNullOrUndefined(this.delimiter), "delimiter cannot be null or undefined");
    this.assertIsValidDelimiter(this.delimiter);
  }

  protected assertHasValidDelimiter(delimiter: string): void {
    InvalidStateException.assert(
      this.isNotNullOrUndefined(delimiter),
      "delimiter cannot be null or undefined"
    );
    const cond = delimiter.length === 1 && delimiter !== ESCAPE_CHARACTER;
    InvalidStateException.assert(
      cond,
      "delimiter must be a single char and cannot be the escape character"
    );
  }

  protected assertHasValidParameter(o: Object | null, msg: string = "null or undefined"): void {
    InvalidStateException.assert(this.isNotNullOrUndefined(o), msg);
  }

  // methods for assertions (post-conditions)
  protected assertIsValidDelimiter(delimiter: string | undefined): void {
    const cond = (delimiter ? delimiter : DEFAULT_DELIMITER) === this.delimiter;
    MethodFailedException.assert(cond, "Name validation failed");
  }

  protected assertIsValidCloned(cloned: Name): void {
    MethodFailedException.assert(this.isNotNullOrUndefined(cloned), "clone is null or undefined");
    const cond = this.isEqual(cloned) && this !== cloned;
    MethodFailedException.assert(cond, "Clone validation failed");
  }

  protected assertIsValidHashCode(other: Name): void {
    const cond = other.getHashCode() === this.getHashCode();
    MethodFailedException.assert(cond, "HashCode validation failed");
  }

  protected assertIsValidConcatComponent(original: Name, other: Name): void {
    console.log('original.asString():', original.asString());
    console.log('original.getNoComponents():', original.getNoComponents());
    console.log('other.asString():', other.asString());
    console.log('other.getNoComponents():', other.getNoComponents());
    console.log('this.asString():', this.asString());
    console.log('this.getNoComponents():', this.getNoComponents());
    MethodFailedException.assert(
      this.getNoComponents() === original.getNoComponents() + other.getNoComponents(),
      "Concat Components validation failed"
    );
  }
}