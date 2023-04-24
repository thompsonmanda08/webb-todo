import React, { useContext, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { TodoListContext } from "~/context/todoListContext";
import { type RouterOutputs, api } from "~/utils/api";
import EmptyState from "./EmptyState";

//TYPES
type Todo = RouterOutputs["todo"]["getAll"]["0"];

//REACT COMPONENT
const Todos = () => {
  const { data: sessionData } = useSession();
  const { selectedTodoList } = useContext(TodoListContext);

  // TODO-ITEM STATES
  const [selectedTodo, setSelectedTodo] = useState<Todo | undefined | null>(
    null
  );
  const [editTodo, setEditTodo] = useState({
    id: "",
    title: "",
    description: "",
  });

  const { data: todos, refetch: refetchTodos } = api.todo.getAll.useQuery(
    { todoListId: selectedTodoList?.id ?? "" },
    {
      enabled: sessionData?.user !== undefined,
      onSuccess: (data) => {
        setSelectedTodo(selectedTodo ?? data[0] ?? null);
      },
    }
  );

  // To Create a Todo Sub-Task
  const createTodo = api.todo.createOrUpdate.useMutation({
    onSuccess: async () => {
      await refetchTodos();
    },
  });

  // Mark Todo Completed
  const markDone = api.todo.markDone.useMutation({
    onSuccess: () => {
      void refetchTodos();
    },
  });

  // Mark Todo NOT Completed
  const markUnDone = api.todo.markUnDone.useMutation({
    onSuccess: () => {
      void refetchTodos();
    },
  });

  // Delete a Todo
  const deleteTodo = api.todoList.delete.useMutation({
    onSuccess: () => {
      void refetchTodos();
    },
  });

  const handleCreateOrUpdate = () => {
    if (editTodo.title == "") {
      return;
    } else {
      createTodo.mutate({
        id: editTodo.id,
        title: editTodo.title,
        description: editTodo.description,
        todoListId: String(selectedTodoList?.id),
      });
    }
    handleResets();
  };

  // Clean up all fields
  const handleResets = () => {
    setEditTodo({ id: "", title: "", description: "" });
  };
  return (
    <>
      {todos && todos?.length !== 0 ? (
        <ul
          className={`menu rounded-box min-h-[120px] w-full bg-[#15272c4a] p-2`}
        >
          {todos?.map((listItem) => {
            return (
              <li
                key={listItem.id}
                className={`${
                  selectedTodo === listItem ? "bg-[#0d2434fc]" : ""
                }  flex flex-row items-center rounded-2xl pr-3 hover:bg-[#15162c4a]`}
                onClick={() => {
                  setSelectedTodo(listItem);
                }}
              >
                <label className="label cursor-pointer bg-transparent hover:bg-transparent">
                  <input
                    type="checkbox"
                    checked={Boolean(listItem.completed)}
                    className="checkbox-primary checkbox checkbox-sm  rounded-full border-[1px]"
                    onClick={() => {
                      if (listItem.completed) {
                        markUnDone.mutate({ id: listItem.id });
                      } else {
                        markDone.mutate({ id: listItem.id });
                      }
                    }}
                  />
                </label>

                <Link
                  href="#"
                  className={`${
                    listItem.completed ? "text-slate-700 line-through" : ""
                  } -ml-4 mr-auto bg-transparent outline-none`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedTodo(listItem);
                  }}
                >
                  {listItem.title}
                </Link>

                <span className="max-w-[145px] bg-transparent outline-none ">
                  <a
                    href="#edit"
                    className="btn-sm btn bg-primary capitalize text-black hover:bg-primary/60"
                    onClick={() => {
                      setEditTodo({
                        title: listItem.title,
                        description: listItem.description,
                        id: listItem.id,
                      });
                    }}
                  >
                    Edit
                  </a>

                  <label className="modal" id="edit">
                    <label htmlFor="" className="modal-box">
                      <input
                        type="text"
                        name=""
                        value={editTodo.title}
                        placeholder="Pick up groceries from..."
                        className="input-bordered input input-md w-full bg-[#020005] placeholder:text-white/20"
                        onChange={(e) => {
                          setEditTodo({
                            ...editTodo,
                            title: e.currentTarget.value,
                          });
                        }}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            e.currentTarget.value !== ""
                          ) {
                            handleCreateOrUpdate();
                          }
                        }}
                      />

                      <div className="modal-action">
                        <a
                          href="#"
                          className="text-md btn-primary btn font-semibold capitalize"
                          onClick={handleCreateOrUpdate}
                        >
                          Done
                        </a>
                        <a
                          href="#"
                          className="text-md btn-error btn font-semibold capitalize"
                          onClick={handleResets}
                        >
                          Cancel
                        </a>
                      </div>
                    </label>
                  </label>
                  <a
                    href="#delete"
                    className="hover: btn-error btn-sm btn capitalize"
                  >
                    Delete
                  </a>
                  <label className="modal" id="delete">
                    <label htmlFor="" className="modal-box">
                      <p>Are you sure you want to delete the TodoList?</p>
                      <h2 className="text-xl font-semibold">
                        &ldquo;{listItem.title}&ldquo;
                      </h2>
                      <div className="modal-action">
                        <a
                          href="#"
                          className="text-md btn-error btn font-semibold capitalize"
                          onClick={() => {
                            deleteTodo.mutate({ id: listItem.id });
                            handleResets();
                          }}
                        >
                          Confirm Delete
                        </a>
                        <a
                          href="#"
                          className="text-md btn-primary btn font-semibold capitalize"
                          onClick={handleResets}
                        >
                          Cancel
                        </a>
                      </div>
                    </label>
                  </label>
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState text={"You have no Sub-Tasks here!"} />
      )}
    </>
  );
};

export default Todos;
