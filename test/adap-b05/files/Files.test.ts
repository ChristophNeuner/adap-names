import { describe, it, expect } from "vitest";

import { StringName } from "../../../src/adap-b05/names/StringName";
import { StringArrayName } from "../../../src/adap-b05/names/StringArrayName";

import { Node } from "../../../src/adap-b05/files/Node";
import { File } from "../../../src/adap-b05/files/File";
import { BuggyFile } from "../../../src/adap-b05/files/BuggyFile";
import { Directory } from "../../../src/adap-b05/files/Directory";
import { RootNode } from "../../../src/adap-b05/files/RootNode";
import { Exception } from "../../../src/adap-b05/common/Exception";
import { ServiceFailureException } from "../../../src/adap-b05/common/ServiceFailureException";
import { InvalidStateException } from "../../../src/adap-b05/common/InvalidStateException";



describe("StringName test", () => {
  it("test name checking", () => {
    let sn: StringName = new StringName("", '/');
    //console.log('FOOOOOO'+sn.asDataString());
    //console.log('FOOOOOO'+sn.asString());
    sn.append("u\\/sr");
    //console.log('FOOOOOO'+sn.asDataString());

    let san: StringArrayName = new StringArrayName([], '/');
    //console.log('FOOOOOO'+san.toString());
  });
});



function createFileSystem(): RootNode {
  let rn: RootNode = new RootNode();

  let usr: Directory = new Directory("usr", rn);
  let bin: Directory = new Directory("bin", usr);
  let ls: File = new File("ls", bin);
  let code: File = new File("code", bin);

  let media: Directory = new Directory("media", rn);

  let home: Directory = new Directory("home", rn);
  let riehle: Directory = new Directory("riehle", home);
  let bashrc: File = new File(".bashrc", riehle);
  let wallpaper: File = new File("wallpaper.jpg", riehle);
  let projects: Directory = new Directory("projects", riehle);

  return rn;
}

describe("Basic naming test", () => {
  /* it("test name checking", () => {
    let fs: RootNode = createFileSystem();
    let ls: Node = [...fs.findNodes("ls")][0];
    //console.log('ls.getFullName(): '+ls.getFullName().asDataString());
    let sn = new StringName("/usr/bin/ls", '/');
    //console.log('sn.asDataString(): '+sn.asDataString());
    expect(ls.getFullName().isEqual(sn));
  }); */
});

function createBuggySetup(): RootNode {
  let rn: RootNode = new RootNode();

  let usr: Directory = new Directory("usr", rn);
  let bin: Directory = new Directory("bin", usr);
  let ls: File = new BuggyFile("ls", bin);
  let code: File = new BuggyFile("code", bin);

  let media: Directory = new Directory("media", rn);

  let home: Directory = new Directory("home", rn);
  let riehle: Directory = new Directory("riehle", home);
  let bashrc: File = new BuggyFile(".bashrc", riehle);
  let wallpaper: File = new BuggyFile("wallpaper.jpg", riehle);
  let projects: Directory = new Directory("projects", riehle);

  return rn;
}

describe("Buggy setup test", () => {
  it("test finding files", () => {
     let threwException: boolean = false;
     try {
       let fs: RootNode = createBuggySetup();
       fs.findNodes("ls");
     } catch(er) {
       threwException = true;
       console.log('Type of er:', typeof er); // Type of er (primitive or object)
       if (typeof er === "object" && er !== null) {
         console.log('Constructor of er:', er.constructor.name); // Class name of er
       }

       let ex: Exception = er as Exception;
       console.log('Type of ex:', typeof ex);
       console.log('Constructor of ex:', ex.constructor.name);

       expect(ex instanceof ServiceFailureException).toBe(true);
       expect(ex.hasTrigger());

       let tx: Exception = ex.getTrigger();
       console.log('Type of tx:', typeof tx);
      console.log('Constructor of tx:', tx.constructor.name);
       expect(tx instanceof InvalidStateException).toBe(true);
     }
     expect(threwException).toBe(true);
  });
});
