import { create } from "zustand";
import type { FieldType } from "@/pages/Setting/Document/api";

export type SkillSet = {
  id: any;
  field: FieldType;
  language: string;
};

interface DocumentStates {
  questions: any[];
  currentType: FieldType;
  skillSets: SkillSet[];
}

interface DocumentActions {
  setQuestions: (questions: any[]) => void;
  setCurrentType: (type: FieldType) => void;
  setSkillSets: (skills: SkillSet[]) => void;
  resetStore: () => void;
}

type DocumentStore = DocumentStates & DocumentActions;

const initialState: DocumentStates = {
  questions: [],
  currentType: "COMMON",
  skillSets: [],
};
const useDocumentStore = create<DocumentStore>((set) => ({
  ...initialState,
  setCurrentType: (fieldType: FieldType) => set({ currentType: fieldType }),
  setQuestions: (questions: any[]) => set({ questions }),
  setSkillSets: (skills: SkillSet[]) => set({ skillSets: skills }),
  resetStore: () => set(initialState),
}));

export default useDocumentStore;
