import { reactive, readonly } from "vue";

interface PostsState {
  foo: string;
}

export class PostsStore {
  #state: PostsState;

  constructor() {
    this.#state = reactive<PostsState>({
      foo: "foo",
    });
  }

  getState() {
    return readonly(this.#state);
  }

  updateFoo(value: string) {
    this.#state.foo = value;
  }
}

const store = new PostsStore();

export function usePosts() {
  return store;
}
