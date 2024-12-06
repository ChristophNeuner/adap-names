import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b06/names/Name";
import { StringName } from "../../../src/adap-b06/names/StringName";
import { StringArrayName } from "../../../src/adap-b06/names/StringArrayName";

describe("Equality test", () => {
  it("test isEqual", () => {
    // TODO

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
  });
});

describe("mutation methods", () => {
    it("concat", () => {
      let name1: StringName = new StringName("oss.cs", ".");
      let name2: StringName = new StringName("fau.de", ".");
      try{
        let name3: Name = name1.concat(name2);
        console.log(name3.asString());
        expect(name3.getComponent(0)).toBe("oss");
        expect(name3.getComponent(1)).toBe("cs");
        expect(name3.getComponent(2)).toBe("fau");
        expect(name3.getComponent(3)).toBe("de");
      }catch(e){
        console.log(e);
        throw e;
      }
    });
    it("append", () => {
      let name1: StringName = new StringName("oss.cs.fau.de", ".");
      try{
        let name2 = name1.append("test");
        expect(name1.getNoComponents()).toBe(4);
        expect(name2.getNoComponents()).toBe(5);
        expect(name2.getComponent(4)).toBe("test");
        console.log(name1.asString());
        console.log(name2.asString());
        expect(name1.asString()).toBe("oss.cs.fau.de");
        expect(name2.asString()).toBe("oss.cs.fau.de.test");
      }catch(e){
        console.log(e);
        throw e;
      }
    });
  });