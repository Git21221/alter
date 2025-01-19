import { useEffect, useState } from "react";
import "./App.css";
import { CreateTask } from "./components/form/CreateTask";
import { TasksContainer } from "./components/Dashboard/Taskscontainer";
import { Modal } from "./components/Modal";
import { RootState } from "./feature/store/store";
import { useDispatch, useSelector } from "react-redux";
import { addTask, editWholeTask } from "./feature/slices/Task.slice";
import { AllStatusUpdate } from "./components/AllStatusUpdate";
import { ModifyTask } from "./components/form/ModifyTask";

function App() {
  const dispatch = useDispatch();
  const { editTask } = useSelector((state: RootState) => state.AddTask);
  console.log("Edit Task", editTask);
  const { isModalOpen, isEditModalOpen } = useSelector(
    (state: RootState) => state.AddTask
  );
  const { checkedTask } = useSelector((state: RootState) => state.Task);
  const { isList } = useSelector((state: RootState) => state.ListBoardView);

  const [taskData, setTaskData] = useState({
    id: Date.now(),
    title: "",
    description: "",
    category: {
      id: 0,
      name: "",
      title: "",
    },
    dueOn: null as Date | null,
    status: {
      id: 0,
      name: "",
      title: "",
      tasks: [],
    },
    attachment: [] as File[],
  });

  const [edit, setEdit] = useState({
    id: editTask.id,
    title: editTask.title,
    description: editTask.description,
    category: {
      id:
        editTask.category && typeof editTask.category !== "string"
          ? editTask.category.id
          : 0,
      name:
        editTask.category && typeof editTask.category !== "string"
          ? editTask.category.name
          : "",
      title:
        editTask.category && typeof editTask.category !== "string"
          ? editTask.category.title
          : "",
    },
    dueOn: editTask.dueOn,
    status: {
      id:
        editTask.status && typeof editTask.status !== "string"
          ? editTask.status.id
          : 0,
      name:
        editTask.status && typeof editTask.status !== "string"
          ? editTask.status.name
          : "",
      title:
        editTask.status && typeof editTask.status !== "string"
          ? editTask.status.title
          : "",
      tasks:
        editTask.status && typeof editTask.status !== "string"
          ? editTask.status.tasks
          : [],
    },
    attachment: editTask.attachment,
  });

  useEffect(() => {
    setEdit({
      id: editTask.id,
      title: editTask.title,
      description: editTask.description,
      category: {
        id:
          editTask.category && typeof editTask.category !== "string"
            ? editTask.category.id
            : 0,
        name:
          editTask.category && typeof editTask.category !== "string"
            ? editTask.category.name
            : "",
        title:
          editTask.category && typeof editTask.category !== "string"
            ? editTask.category.title
            : "",
      },
      dueOn: editTask.dueOn,
      status: {
        id:
          editTask.status && typeof editTask.status !== "string"
            ? editTask.status.id
            : 0,
        name:
          editTask.status && typeof editTask.status !== "string"
            ? editTask.status.name
            : "",
        title:
          editTask.status && typeof editTask.status !== "string"
            ? editTask.status.title
            : "",
        tasks:
          editTask.status && typeof editTask.status !== "string"
            ? editTask.status.tasks
            : [],
      },
      attachment: editTask.attachment,
    });
  }, [editTask]);

  const onAction = () => {
    dispatch(addTask({ task: taskData }));
    setTaskData({
      id: Date.now(),
      title: "",
      description: "",
      category: {
        id: 1,
        name: "",
        title: "",
      },
      dueOn: null,
      status: {
        id: 2,
        name: "",
        title: "",
        tasks: [],
      },
      attachment: [] as File[],
    });
  };

  const onEditAction = () => {
    // dispatch(setEditTask({ task: edit }));
    dispatch(editWholeTask({ task: edit }));
    setTaskData({
      id: Date.now(),
      title: "",
      description: "",
      category: {
        id: 1,
        name: "",
        title: "",
      },
      dueOn: null,
      status: {
        id: 0,
        name: "",
        title: "",
        tasks: [],
      },
      attachment: [] as File[],
    });
  };

  return (
    <div className="pt-14 px-8">
      <TasksContainer taskData={taskData} setTaskData={setTaskData} />
      {isModalOpen && (
        <Modal
          label="Add Task"
          buttonContent="Add Task"
          onAction={onAction}
          taskData={taskData}
        >
          <CreateTask taskData={taskData} setTaskData={setTaskData} />
        </Modal>
      )}
      {isEditModalOpen && (
        <Modal
          label="Edit Task"
          buttonContent="Edit Task"
          onAction={onEditAction}
          taskData={editTask}
        >
          <ModifyTask editTask={edit} setEditTask={setEdit} />
        </Modal>
      )}
      {checkedTask.length > 0 && isList ? <AllStatusUpdate /> : null}
    </div>
  );
}

export default App;
