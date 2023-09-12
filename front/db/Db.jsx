let instance;
let notes = {};
let index = {};

let globalResolve;
let globalPromise = new Promise((resolve) => {
  globalResolve = resolve;
});

class DB {
  constructor() {
    if (instance) {
      throw new Error("You can only create one instance!");
    }
    instance = this;
    this.loadIndex();
  }

  async loadIndex() {
    const data = await fetch("/notes/index.json");
    const json = await data.json();
    index = json;
    globalResolve();
  }

  async load(arrOfPaths) {
    await globalPromise;
    const data = await Promise.all(
      arrOfPaths.map((path) => {
        const note = index[path];
        return fetch(`/${note.path}`);
      })
    );
    const json = await Promise.all(data.map((d) => d.text()));

    json.forEach((n, index) =>
      Object.assign(notes, { [arrOfPaths[index]]: n })
    );
  }

  getInstance() {
    return this;
  }

  async getNote(path) {
    await this.load([path]);
    return { ...index[path], content: notes[path] };
  }
}

const singletonDB = Object.freeze(new DB());
export default singletonDB;
