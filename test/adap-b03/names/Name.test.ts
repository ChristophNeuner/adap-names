import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b03/names/Name";
import { StringName } from "../../../src/adap-b03/names/StringName";
import { StringArrayName } from "../../../src/adap-b03/names/StringArrayName";
import exp from "constants";
import { AbstractName } from "./AbstractName";

describe("Basic StringName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss.fau.de");
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringName("oss.cs.fau");
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringName("reluxbla.oss.cs.balu.fau.de.totom");
    n.remove(0);
    expect(n.asString()).toBe("oss.cs.balu.fau.de.totom");
    n.remove(4);
    expect(n.asString()).toBe("oss.cs.balu.fau.totom");
    n.remove(4);
    expect(n.asString()).toBe("oss.cs.balu.fau");
  });
  it("test asString", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    expect(n.asString("#")).toBe("oss#cs#fau#de");
  });
  it("test asString with escaped delimiter char", () => {
    let n: Name = new StringName("oss\\.cs.fau.de");
    expect(n.asString("#")).toBe("oss.cs#fau#de");
  });
  it("test getNoComponents", () => {
    let n: Name = new StringName("oss\\.cs.fau.de");
    expect(n.getNoComponents()).toBe(3);
  });
  it("test getIndices", () => {
    let n: StringName = new StringName("o\\.c.f.d");
    expect(n.getIndices()).toEqual([-1, 4, 6]);
  });
  it("test getComponent", () => {
    let n: StringName = new StringName("o\\.c.f.d");
    expect(n.getComponent(0)).toBe("o\\.c");
    expect(n.getComponent(1)).toBe("f");
    expect(n.getComponent(2)).toBe("d");
  });
  it("test setComponent", () => {
    let n: Name = new StringName("oss\\.cs.fau.de");
    n.setComponent(0, "foo");
    expect(n.asString()).toBe("foo.fau.de");
    n.setComponent(1, "barolo");
    expect(n.asString()).toBe("foo.barolo.de");
  });
  it("test insert", () => {
    let n: StringName = new StringName("a.b.c");
    expect(n.getNoComponents()).toEqual(3);
    n.insert(0, "x");
    expect(n.getNoComponents()).toEqual(4);
    expect(n.asString()).toBe("x.a.b.c");
    expect(n.getIndices()).toEqual([-1, 1, 3, 5]);
    n.insert(1, "y");
    expect(n.getNoComponents()).toEqual(5);
    expect(n.asString()).toBe("x.y.a.b.c");
    expect(n.getIndices()).toEqual([-1, 1, 3, 5, 7]);
    n.insert(n.getNoComponents(), "z");
    expect(n.getNoComponents()).toEqual(6);
    expect(n.asString()).toBe("x.y.a.b.c.z");
    expect(n.getIndices()).toEqual([-1, 1, 3, 5, 7, 9]);
  });
  it("test append", () => {
    let n: StringName = new StringName("a.b.c");
    expect(n.getNoComponents()).toEqual(3);
    expect(n.getIndices()).toEqual([-1, 1, 3]);
    n.append("d");
    expect(n.getNoComponents()).toEqual(4);
    expect(n.asString()).toBe("a.b.c.d");
    expect(n.getIndices()).toEqual([-1, 1, 3, 5]);
    n.append("e");
    expect(n.getNoComponents()).toEqual(5);
    expect(n.asString()).toBe("a.b.c.d.e");
    expect(n.getIndices()).toEqual([-1, 1, 3, 5, 7]);
  });
  it("test remove", () => {
    let n: StringName = new StringName("a.b.c.d.e");
    expect(n.getNoComponents()).toEqual(5);
    expect(n.getIndices()).toEqual([-1, 1, 3, 5, 7]);
    n.remove(0);
    expect(n.getNoComponents()).toEqual(4);
    expect(n.asString()).toBe("b.c.d.e");
    expect(n.getIndices()).toEqual([-1, 1, 3, 5]);
    n.remove(2);
    expect(n.getNoComponents()).toEqual(3);
    expect(n.asString()).toBe("b.c.e");
    expect(n.getIndices()).toEqual([-1, 1, 3]);
    n.remove(2);
    expect(n.getNoComponents()).toEqual(2);
    expect(n.asString()).toBe("b.c");
    expect(n.getIndices()).toEqual([-1, 1]);
  });
  it("test isEmpty", () => {
    let n: StringName = new StringName("oss.cs.fau");
    n.remove(2); 
    n.remove(1);
    n.remove(0);
    expect(n.isEmpty()).toBe(true);
    n.insert(0, "oss");
    expect(n.isEmpty()).toBe(false);
  });
  it("test asDataString", () => {
    let n: StringName = new StringName("oss.cs.fau");
    n.append("foo\\.bar");
    expect(n.asDataString()).toBe("oss.cs.fau.foo\\.bar");
  });
});

describe("Basic StringArrayName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test insert with escaped delimiter char", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    n.insert(1, "cs\\.foo");
    expect(n.asString("#")).toBe("oss#cs.foo#fau#de");
  });
  it("test append", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau"]);
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });
  it("test asString with escaped delimiter char", () => {
    let n: Name = new StringArrayName(["oss\\.cs", "fau", "de"]);
    expect(n.asString("#")).toBe("oss.cs#fau#de");
  });
  it("test concat two StringArrayNames", () => {
    let n1: Name = new StringArrayName(["oss\\.cs", "fau", "de"]);
    let n2: Name = new StringArrayName(["foo", "bar"]);
    n1.concat(n2);
    expect(n1.asString("#")).toBe("oss.cs#fau#de#foo#bar");
  });
  it("test isEmpty", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau"]);
    n.remove(2);
    n.remove(1);
    n.remove(0);
    expect(n.isEmpty()).toBe(true);
    n.insert(0, "oss");
    expect(n.isEmpty()).toBe(false);
  });
  it("test asDataString", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau"]);
    n.append("foo\\.bar");
    expect(n.asDataString()).toBe("oss.cs.fau.foo\\.bar");
  });
});

describe("Delimiter function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss#fau#de", '#');
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
});

describe("Escape character extravaganza", () => {
  it("test escape and delimiter boundary conditions", () => {
    let n: Name = new StringName("oss.cs.fau.de", '#');
    expect(n.getNoComponents()).toBe(1);
    expect(n.asString()).toBe("oss.cs.fau.de");
    n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de#people");
  });
});

describe("concat between StringArrayName and StringName", () => {
  it("test concat StringArrayName with StringName", () => {
    let n1: Name = new StringArrayName(["oss\\.cs", "fau", "de"]);
    let n2: Name = new StringName("foo.bar");
    n1.concat(n2);
    expect(n1.asString("#")).toBe("oss.cs#fau#de#foo#bar");
  });
});

describe("edge cases StringName", () => {
  it("test empty String", () => {
    let n: Name = new StringName("");
    expect(n.isEmpty()).toBe(true);
    expect(n.asString()).toBe("");
    expect(n.asDataString()).toBe("");
    n.append("foo\\.bar");
    expect(n.getNoComponents()).toBe(1);
    expect(n.asDataString()).toBe("foo\\.bar");
  });
});

describe("edge cases StringArrayName", () => {
  it("test empty array", () => {
    let n: Name = new StringArrayName(["oss"]);
    n.remove(0);
    expect(n.isEmpty()).toBe(true);
    expect(n.getNoComponents()).toBe(0);
    expect(n.asString()).toBe("");
    expect(n.asDataString()).toBe("");
    n.append("foo\\.bar");
    expect(n.getNoComponents()).toBe(1);
    expect(n.asDataString()).toBe("foo\\.bar");
  });
});

describe("clone", () => {
  it("StringArrayName", () => {
    let n: StringArrayName = new StringArrayName(["oss", "cs", "fau"]);
    let n_clone: Name = n.clone();
    expect(n.asDataString()).toBe(n_clone.asDataString());
    n.remove(0);
    n_clone.remove(0);
    expect(n.asDataString()).toBe(n_clone.asDataString());
    expect(n.getDelimiterCharacter()).toBe(n_clone.getDelimiterCharacter());
    expect(n.getNoComponents()).toBe(n_clone.getNoComponents());
    expect(n.getComponent(0)).toBe(n_clone.getComponent(0));
  });
  it("StringName", () => {
    let n: StringName = new StringName("oss.cs.fau.de", '#');
    let n_clone: Name = n.clone();
    expect(n.asDataString()).toBe(n_clone.asDataString());
    n.remove(0);
    n_clone.remove(0);
    expect(n.asDataString()).toBe(n_clone.asDataString());
    expect(n.getDelimiterCharacter()).toBe(n_clone.getDelimiterCharacter());
    expect(n.getNoComponents()).toBe(n_clone.getNoComponents());
    expect(n.getComponent(0)).toBe(n_clone.getComponent(0));
  });
});

describe("isEqual and getHashCode (Two equal objects must have the same hashcode (Lecture B01))", () => {
  it("StringArrayName", () => {
    let n: StringArrayName = new StringArrayName(["oss", "cs", "fau"]);
    let n2: StringArrayName = new StringArrayName(["oss", "cs", "fau"]);
    expect(n.isEqual(n2)).toBe(true);
    expect(n.getHashCode()).toBe(n2.getHashCode());
  });
  it("StringName", () => {
    let n: StringName = new StringName("oss.cs.fau.de", '#');
    let n2: StringName = new StringName("oss.cs.fau.de");
    expect(n.isEqual(n2)).toBe(true);
    expect(n.getHashCode()).toBe(n2.getHashCode());
  });
  it("StringArrayName and StringName", () => {
    let n: StringName = new StringName("oss.cs.fau", '#');
    let n2: StringArrayName = new StringArrayName(["oss", "cs", "fau"], "+");
    expect(n.isEqual(n2)).toBe(true);
    expect(n.getHashCode()).toBe(n2.getHashCode());
  });
});

describe("getHashCode", () => {
  it("foo", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau"]);
    console.log(n.getHashCode());
    let n2: StringName = new StringName("oss.cs.fau", '#');
    console.log(n2.getHashCode());
    expect(n.getHashCode()).toBe(n2.getHashCode());
  });
});