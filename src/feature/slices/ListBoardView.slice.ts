import { createSlice } from "@reduxjs/toolkit";

export interface ListBoardViewState {
  isList: boolean,
  isBoard: boolean,
}


const initialState: ListBoardViewState = {
  isList: true,
  isBoard: false,
}

const ListBoardViewSlice = createSlice({
  name: "ListBoardView",
  initialState,
  reducers: {
    setBoardView: (state) => {
      state.isList = false;
      state.isBoard = true;
    },
    setListView: (state) => {
      state.isList = true;
      state.isBoard = false;
    },
  },
  // extraReducers: (builder) => {}
})

export default ListBoardViewSlice;
export const { setBoardView, setListView } = ListBoardViewSlice.actions;
