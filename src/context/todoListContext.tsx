import { createContext } from "react";
import { type RouterOutputs } from "~/utils/api";

type TodoList = RouterOutputs["todoList"]["getAll"][0];

type ITodoListContext = {
  selectedTodoList: TodoList | null;
  setSelectedTodoList: (todoList: TodoList) => void;
};

export const TodoListContext = createContext<ITodoListContext>({
  selectedTodoList: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSelectedTodoList: () => {},
});
