type ClassType<C> = {
  new (...args : unknown[]): C;
};

export default abstract class Singleton {
  private static instances: object[] = [];

  static getInstance<T extends object>(classType: ClassType<T>, ...constructorProps: unknown[]): T {
    const instance = this.instances.find((obj) => obj instanceof classType);

    if (instance) {
      return instance as T;
    }

    const newInstance = new classType(constructorProps);

    this.instances.push(newInstance);

    return newInstance;
  }
}
