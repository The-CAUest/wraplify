import { Button } from "antd";
  import "antd/dist/antd.css";
  import React, { useReducer, useEffect } from "react";
  import Note from "../../classes/Note";
  
  const initialState = {
    lists: [],
    loading: true,
    error: false,
  };
  function reducer(state, action) {
    switch (action.type) {
      case "SET_DATA":
        return { ...state, lists: action.lists, loading: false };
      case "ERROR":
        return { ...state, loading: false, error: true };
      default:
        return state;
    }
  }
  
  function NoteDelete({ id }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    useEffect(() => {
      fetchNote();
    }, []);
  
    async function fetchNote() {
      try {
        Note.listNote(id).then((data) => {
          dispatch({ type: "SET_DATA", list: data });
        });
      } catch (err) {
        console.log("fetch error : ", err);
        dispatch({ type: "ERROR" });
      }
    }
  
    async function deleteNote() {
      try {
        await Note.deleteNote(id);
      } catch (err) {
        console.log({ err });
      }
    }
  
    return (
      <div>
        <Button onClick={() => deleteNote()}>Delete Note</Button>
      </div>
    );
  }
  export default NoteDelete;
  
  