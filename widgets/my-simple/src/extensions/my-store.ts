import { type extensionSpec, type ImmutableObject, type IMState } from "jimu-core";

export enum MyActionKeys {
  IsLoading = "IS_LOADING",
  SubmitForm = "SUBMIT_FORM_TEST",
}

export interface Action1 {
  type: MyActionKeys.IsLoading;
  val: boolean;
}

export interface Action2 {
  type: MyActionKeys.SubmitForm;
  val: object;
}

type ActionTypes = Action1 | Action2;

interface FormTestPayload {
  firstName: string;
  lastName: string;
  category: string;
  aboutYou: string;
}
interface MyState {
  form: FormTestPayload;
}

const initState = {
  form: {
    firstName: "",
    lastName: "",
    category: "",
    aboutYou: "",
  },
  isLoading: false,
};

type IMMyState = ImmutableObject<MyState>;

declare module "jimu-core/lib/types/state" {
  interface State {
    myState?: IMMyState;
  }
}

export default class MyReduxStoreExtension implements extensionSpec.ReduxStoreExtension {
  id = "my-local-redux-store-extension";

  getActions() {
    return Object.keys(MyActionKeys).map((k) => MyActionKeys[k]);
  }

  getInitLocalState() {
    return {
      form: {
        firstName: "",
        lastName: "",
        category: "",
        aboutYou: "",
      },
      isLoading: false,
    };
  }

  getReducer() {
    return (localState: IMMyState, action: ActionTypes, appState: IMState): IMMyState => {
      switch (action.type) {
        case MyActionKeys.IsLoading:
          return localState.set("isLoading", true);
        case MyActionKeys.SubmitForm:
          console.log(localState);
          return localState.set("form", action.val).set("isLoading", false);
        default:
          return localState;
      }
    };
  }

  getStoreKey() {
    return "myState";
  }
}
