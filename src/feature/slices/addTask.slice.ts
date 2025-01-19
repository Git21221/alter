import { createSlice } from "@reduxjs/toolkit";
import { Task } from "./Task.slice";

interface AddTaskState {
  isModalOpen: boolean;
  isEditModalOpen: boolean;
  editTask: Task;
}

const initialState: AddTaskState = {
  isModalOpen: false,
  isEditModalOpen: false,
  editTask: {
    id: 0,
    title: "",
    description: "",
    category: {
      id: 0,
      name: "",
      title: "",
    },
    status: {
      id: 0,
      name: "",
      title: "",
      tasks: [],
    },
    dueOn: null,
    attachment: [],
  },
}

const addTaskSlice = createSlice({
  name: "AddTask",
  initialState,
  reducers: {
    openModal: (state) => {
      state.isModalOpen = true;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
    },
    openEditModal: (state) => {
      state.isEditModalOpen = true;
    },
    closeEditModal: (state) => {
      state.isEditModalOpen = false;
    },
    setEditTask: (state, action) => {
      state.editTask = action.payload;
    },
  },
});

export default addTaskSlice;
export const { openModal, closeModal, openEditModal, closeEditModal, setEditTask } = addTaskSlice.actions;