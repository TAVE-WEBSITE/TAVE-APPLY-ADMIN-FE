import { createStore } from "./createStore";

interface AccountStore {
  email: string;
  nickname: string;
  username: string;
  generation: string;
  department: string;
  job: string;
}

const initialState: AccountStore = {
  email: "",
  nickname: "",
  username: "",
  generation: "",
  department: "",
  job: "",
};
const useAccountStore = createStore(initialState);

export default useAccountStore;
