import { describe, it, expect } from "vitest";
import { Name } from "../../../src/adap-b01/names/Name";

describe("Basic initialization tests", () => {
  it("test construction 1", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    expect(n.asNameString()).toBe("oss.cs.fau.de");
  });
});

describe("Basic function tests", () => {
  it("test functions", () => {
    let n: Name = new Name(["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asNameString()).toBe("oss.cs.fau.de");

    n.remove(1);
    expect(n.asNameString()).toBe("oss.fau.de");

    n.append("people");
    expect(n.asNameString()).toBe("oss.fau.de.people");

    n.setComponent(1, "cs");
    expect(n.asNameString()).toBe("oss.cs.de.people");

    expect(n.getComponent(1)).toBe("cs");

    expect(n.getNoComponents()).toBe(4);
  });
});

describe("Delimiter function tests", () => {
  it("test other delimiter", () => {
    let n: Name = new Name(["oss", "fau", "de"], '#');
    n.insert(1, "cs");
    expect(n.asNameString()).toBe("oss#cs#fau#de");
  });
});

describe("Delimiter undefined", () => {
  it("test undefined delimiter", () => {
    let n: Name = new Name(["oss", "fau", "de"], undefined);
    n.insert(1, "cs");
    expect(n.asNameString()).toBe("oss.cs.fau.de");
  });
});

describe("Escape character extravaganza", () => {
  it("test escape and delimiter boundary conditions", () => {
    // Original name string = "oss.cs.fau.de"
    let n: Name = new Name(["oss.cs.fau.de"], '#');
    expect(n.asNameString()).toBe("oss.cs.fau.de");
    n.append("people");
    expect(n.asNameString()).toBe("oss.cs.fau.de#people");
  });
});

describe("input checking", () => {
  it("error handling", () => {
    let n: Name = new Name(["oss", "fau", "de"]);
    expect(() => n.getComponent(-1)).toThrow("Index out of bounds");
    expect(() => n.getComponent(3)).toThrow("Index out of bounds");
    expect(() => n.setComponent(-1, "cs")).toThrow("Index out of bounds");
    expect(() => n.setComponent(3, "cs")).toThrow("Index out of bounds");
    expect(() => n.insert(-1, "cs")).toThrow("Index out of bounds");
    expect(() => n.insert(3, "cs")).toThrow("Index out of bounds");
    expect(() => n.remove(-1)).toThrow("Index out of bounds");
    expect(() => n.remove(3)).toThrow("Index out of bounds");
  });
});