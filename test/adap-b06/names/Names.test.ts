import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b06/names/Name";
import { StringName } from "../../../src/adap-b06/names/StringName";
import { StringArrayName } from "../../../src/adap-b06/names/StringArrayName";

describe("Equality test", () => {
  it("test isEqual", () => {
    /* let c1: Coordinate = new CartesianCoordinate(0, 0);
    let p1: Coordinate = new PolarCoordinate(0, 0);
    expect(c1.isEqual(p1)).toBe(true);
    expect(c1.getHashCode() == p1.getHashCode()).toBe(true);

    c1 = c1.setX(2);
    p1 = p1.setR(2);
    expect(c1.isEqual(p1)).toBe(true);
    expect(c1.getHashCode() == p1.getHashCode()).toBe(true); 

    c1 = c1.setY(1);
    p1 = p1.setPhi(Math.PI / 2);
    expect(c1.isEqual(p1)).toBe(false);
    expect(c1.getHashCode() == p1.getHashCode()).toBe(false);  */

    let name1: Name = new StringName("oss.cs.fau.de", ".");
    let name2: Name = new StringName("oss.cs.fau.de", ".");
    expect(name1.isEqual(name2)).toBe(true);
    expect(name1.getHashCode() == name2.getHashCode()).toBe(true);

    name2 = new StringArrayName(["oss", "cs", "fau", "de"], ".");
    expect(name1.isEqual(name2)).toBe(true);
    expect(name1.getHashCode() == name2.getHashCode()).toBe(true);

    let name3 = name2.setComponent(3, "com");
    expect(name2.isEqual(name3)).toBe(false);
    expect(name2.getHashCode() == name3.getHashCode()).toBe(false);
  });
});

describe("mutation methods", () => {
    it("concat", () => {
      let name1: Name = new StringName("oss.cs", ".");
      let name2: Name = new StringName("fau.de", ".");
      try{
        let name3: Name = name1.concat(name2);
        console.log(name3.asString());
        expect(name3.asString()).toBe("oss.cs.fau.de");
      }catch(e){
        console.log(e);
        throw e;
      }

      let name4: Name = new StringArrayName(["oss", "cs"], ".");
      try{
        let name5: Name = name4.concat(name2);
        console.log("name4.concat(name2): " + name5.asString());
        expect(name5.asString()).toBe("oss.cs.fau.de");
        expect(name4.getNoComponents()).toBe(2);
        expect(name5.getNoComponents()).toBe(4);
      }catch(e){
        console.log(e);
        throw e;
      }
    });
    it("append", () => {
      let name1: StringName = new StringName("oss.cs.fau.de", ".");
      try{
        let name2 = name1.append("test");
        expect(name2.asString()).toBe("oss.cs.fau.de.test");
        expect(name1.asString()).toBe("oss.cs.fau.de");
        expect(name1.getNoComponents()).toBe(4);
        expect(name2.getNoComponents()).toBe(5);
      }catch(e){
        console.log(e);
        throw e;
      }
      let name3 = new StringArrayName(["oss", "cs", "fau", "de"], ".");
      try{
        let name4 = name3.append("test");
        expect(name4.asString()).toBe("oss.cs.fau.de.test");
        expect(name3.asString()).toBe("oss.cs.fau.de");
        expect(name3.getNoComponents()).toBe(4);
        expect(name4.getNoComponents()).toBe(5);
      }catch(e){
        console.log(e);
        throw e;
      }
    });
    it("insert", () => {
      let name1: StringName = new StringName("oss.cs.fau.de", ".");
      try{
        let name2 = name1.insert(2, "test");
        expect(name2.asString()).toBe("oss.cs.test.fau.de");
        expect(name1.asString()).toBe("oss.cs.fau.de");
        expect(name1.getNoComponents()).toBe(4);
        expect(name2.getNoComponents()).toBe(5);
      }catch(e){
        console.log(e);
        throw e;
      }
      let name3 = new StringArrayName(["oss", "cs", "fau", "de"], ".");
      try{
        let name4 = name3.insert(2, "test");
        expect(name4.asString()).toBe("oss.cs.test.fau.de");
        expect(name3.asString()).toBe("oss.cs.fau.de");
        expect(name3.getNoComponents()).toBe(4);
        expect(name4.getNoComponents()).toBe(5);
      }catch(e){
        console.log(e);
        throw e;
      }
    });
    it("remove", () => {
      let name1: StringName = new StringName("oss.cs.fau.de", ".");
      try{
        let name2 = name1.remove(2);
        expect(name2.asString()).toBe("oss.cs.de");
        expect(name1.asString()).toBe("oss.cs.fau.de");
        expect(name1.getNoComponents()).toBe(4);
        expect(name2.getNoComponents()).toBe(3);
      }catch(e){
        console.log(e);
        throw e;
      }
      let name3 = new StringArrayName(["oss", "cs", "fau", "de"], ".");
      try{
        let name4 = name3.remove(2);
        expect(name4.asString()).toBe("oss.cs.de");
        expect(name3.asString()).toBe("oss.cs.fau.de");
        expect(name3.getNoComponents()).toBe(4);
        expect(name4.getNoComponents()).toBe(3);
      }catch(e){
        console.log(e);
        throw e;
      }
    });
    it("setComponent", () => {
      let name1: StringName = new StringName("oss.cs.fau.de", ".");
      try{
        let name2 = name1.setComponent(2, "test");
        expect(name2.asString()).toBe("oss.cs.test.de");
        expect(name1.asString()).toBe("oss.cs.fau.de");
        expect(name1.getNoComponents()).toBe(4);
        expect(name2.getNoComponents()).toBe(4);
      }catch(e){
        console.log(e);
        throw e;
      }
      let name3 = new StringArrayName(["oss", "cs", "fau", "de"], ".");
      try{
        let name4 = name3.setComponent(2, "test");
        expect(name4.asString()).toBe("oss.cs.test.de");
        expect(name3.asString()).toBe("oss.cs.fau.de");
        expect(name3.getNoComponents()).toBe(4);
        expect(name4.getNoComponents()).toBe(4);
      }catch(e){
        console.log(e);
        throw e;
      }
    });
    it("getComponent", () => {
      let name1: StringName = new StringName("oss.cs.fau.de", ".");
      try{
        expect(name1.getComponent(2)).toBe("fau");
      }catch(e){
        console.log(e);
        throw e;
      }
      let name3 = new StringArrayName(["oss", "cs", "fau", "de"], ".");
      try{
        expect(name3.getComponent(2)).toBe("fau");
      }catch(e){
        console.log(e);
        throw e;
      }
    });
  });