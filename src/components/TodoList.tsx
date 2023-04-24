import React, { useContext, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { TodoListContext } from "~/context/todoListContext";
import { api } from "~/utils/api";
import EmptyState from "./EmptyState";

//type TodoList = RouterOutputs["todoList"]["getAll"][0];

const TodoList: React.FC = () => {
  const { data: sessionData } = useSession();
  // const [selectedTodoList, setSelectedTodoList] = useState<TodoList | null>(
  //   null
  // );

  const { selectedTodoList, setSelectedTodoList } = useContext(TodoListContext);
  const [todoListItem, setTodoListItem] = useState({
    id: "",
    name: "",
  });

  // Get all Todo Lists
  const { data: todoList, refetch: refetchTodoList } =
    api.todoList.getAll.useQuery(
      undefined, // no input
      {
        enabled: sessionData?.user !== undefined,
      }
    );

  // To Create a TodoList
  const createTodoList = api.todoList.createOrUpdate.useMutation({
    onSuccess: async () => {
      await refetchTodoList();
    },
  });

  // Delete a TodoList
  const deleteTodoList = api.todoList.delete.useMutation({
    onSuccess: () => {
      void refetchTodoList();
    },
  });

  // Mark Todo List Completed
  const markDone = api.todoList.markDone.useMutation({
    onSuccess: () => {
      void refetchTodoList();
    },
  });

  // Mark Todo List NOT Completed
  const markUnDone = api.todoList.markUnDone.useMutation({
    onSuccess: () => {
      void refetchTodoList();
    },
  });

  // Clean up all fields
  const handleResetInputs = () => {
    setTodoListItem({ name: "", id: "" });
    setTodoListItem({ name: "", id: "" });
  };

  const handleCreateOrUpdate = () => {
    if (todoListItem.name == "") {
      return;
    } else {
      createTodoList.mutate({
        name: todoListItem.name,
        id: todoListItem.id,
      });
    }
    handleResetInputs();
  };

  return (
    <div className="flex max-w-xl flex-[0.40] flex-col ">
      <div className="flex gap-3 px-2 md:gap-6">
        <input
          type="text"
          name=""
          value={todoListItem.name}
          placeholder="Pick up groceries from..."
          className="input-bordered input input-md w-full bg-[#020005] placeholder:text-white/20"
          onChange={(e) => {
            setTodoListItem({ ...todoListItem, name: e.currentTarget.value });
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.currentTarget.value !== "")
              handleCreateOrUpdate();
          }}
        />
        <button
          className="text-md btn-primary btn font-semibold capitalize"
          onClick={handleCreateOrUpdate}
        >
          Create Todo List
        </button>
      </div>
      <div className="divider"></div>
      {todoList && todoList?.length !== 0 ? (
        <ul className={`menu rounded-box min-h-16 w-full bg-[#15272c4a] p-2`}>
          {todoList?.map((listItem) => {
            return (
              <li
                key={listItem.id}
                className={`${
                  selectedTodoList === listItem ? "bg-[#0d2434fc]" : ""
                }  flex flex-row items-center rounded-2xl pr-3 hover:bg-[#15162c4a]`}
                onClick={() => {
                  setSelectedTodoList(listItem);
                }}
              >
                <label className="label cursor-pointer bg-transparent hover:bg-transparent">
                  <input
                    type="checkbox"
                    checked={listItem.completed}
                    className="checkbox-primary checkbox  rounded-full border-[1px]"
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
                    setSelectedTodoList(listItem);
                  }}
                >
                  {listItem.name}
                </Link>

                <span className="max-w-[145px] bg-transparent outline-none ">
                  <a
                    href="#edit"
                    className="btn-sm btn bg-primary capitalize text-black hover:bg-primary/60"
                    onClick={() => {
                      setTodoListItem({ name: listItem.name, id: listItem.id });
                    }}
                  >
                    Edit
                  </a>

                  <label className="modal" id="edit">
                    <label htmlFor="" className="modal-box">
                      <input
                        type="text"
                        name=""
                        value={todoListItem.name}
                        placeholder="Pick up groceries from..."
                        className="input-bordered input input-md w-full bg-[#020005] placeholder:text-white/20"
                        onChange={(e) => {
                          setTodoListItem({
                            ...todoListItem,
                            name: e.currentTarget.value,
                          });
                        }}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            e.currentTarget.value !== ""
                          ) {
                            handleCreateOrUpdate();
                            handleResetInputs();
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
                          onClick={handleResetInputs}
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
                        &ldquo;{listItem.name}&ldquo;
                      </h2>
                      <div className="modal-action">
                        <a
                          href="#"
                          className="text-md btn-error btn font-semibold capitalize"
                          onClick={() => {
                            deleteTodoList.mutate({ id: listItem.id });
                            handleResetInputs();
                          }}
                        >
                          Confirm Delete
                        </a>
                        <a
                          href="#"
                          className="text-md btn-primary btn font-semibold capitalize"
                          onClick={handleResetInputs}
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
        <EmptyState text={"You have Nothing here yet!"} />
      )}
    </div>
  );
};

export default TodoList;
