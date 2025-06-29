import { create } from "zustand";

type FieldStore<T extends Record<string, any>> = T & {
  setField: <K extends keyof T>(key: K, value: T[K]) => void;
  reset: () => void;
} & {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};

export const createStore = <T extends Record<string, any>>(initalStates: T) =>
  create<FieldStore<T>>((set) => {
    const dynamicSetters = Object.keys(initalStates).reduce((acc, key) => {
      const capitalized = key.charAt(0).toUpperCase() + key.slice(1);
      const fnName = `set${capitalized}`;
      return {
        ...acc,
        [fnName]: (value: any) => set((state) => ({ ...state, [key]: value })),
      };
    }, {} as Record<string, (value: any) => void>);

    return {
      ...initalStates,
      ...dynamicSetters,
      setField: (key, value) => set((state) => ({ ...state, [key]: value })),
      reset: () => {
        set(initalStates as FieldStore<T>);
      },
    };
  });
