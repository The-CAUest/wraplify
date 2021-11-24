exports.makeDeleteComponent = (name) => {
  let ret = `import { Button } from "antd";
  import "antd/dist/antd.css";
  import React, { useReducer, useEffect } from "react";
  import ${name} from "../../classes/crudl/${name}";
  
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
  
  function ${name}Delete({ id ,onDelete, style = {}}) {
    const [state, dispatch] = useReducer(reducer, initialState);
    useEffect(() => {
      fetch${name}();
    }, []);
  
    async function fetch${name}() {
      try {
        ${name}.list${name}(id).then((data) => {
          dispatch({ type: "SET_DATA", list: data });
        });
      } catch (err) {
        console.log("fetch error : ", err);
        dispatch({ type: "ERROR" });
      }
    }
  
    async function delete${name}() {
      try {
        await ${name}.delete${name}(id);
        if (onDelete) {
          onDelete();
        } else {
          window.location.reload();
        }
      } catch (err) {
        console.log({ err });
      }
    }
  
    return (
      <div style={style}>
        <Button onClick={() => delete${name}()}>Delete ${name}</Button>
      </div>
    );
  }
  export default ${name}Delete;
  
  `;
  return ret;
};
