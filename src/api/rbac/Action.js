class Action {
  /**
   * @param {string} [id]
   * @param {string} name
   */
  constructor(id, name) {
    /** @type {string | null} */
    this.id = id ?? null;
    /** @type {string} */
    this.name = name;
  }

  get Synchronized() {
    return this.id !== null;
  }

  /**
   * @param {{ id: string } | string} id
   */
  synchronize(id) {
    if (id instanceof Object) this.id = id.id;
    else this.id = id;
  }
}

module.exports = Action;
