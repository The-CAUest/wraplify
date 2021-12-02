const path = require("path");

function makeInitialValue(name) {
  const schemaPath = path.join(process.cwd(), "./src/schema.js");
  let schema = require(schemaPath);

  let tokens = schema[name];
  let ret = ``;
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i]["isConnection"] == true) {
      continue;
    }
    if (tokens[i]["type"].startsWith("[") && tokens[i]["type"].endsWith("]")) {
      //changed
      ret += tokens[i]["name"] + ": [],";
    } else if (tokens[i]["type"] == "Boolean") {
      ret += tokens[i]["name"] + ": false,";
    } else if (tokens[i]["type"] == "Int") {
      ret += tokens[i]["name"] + ": 0,";
    } else if (tokens[i]["type"] == "Float") {
      ret += tokens[i]["name"] + ": 0,";
    } else {
      ret += tokens[i]["name"] + ': "",';
    }
  }
  return ret;
}

exports.makeCreateComponent = (name) => {
  let initialValue = makeInitialValue(name);
  let ret =
    `import { v4 as uuid } from "uuid";
  import { DatePicker, InputNumber, Form, Input, Button, Checkbox } from "antd";
  import "antd/dist/antd.css";
  import React, { useReducer } from "react";
  import ${name} from "../../classes/crudl/${name}";
  
  function ${name}Create({ initialValue = {} ,onCreate, inputColumn, style = {} }) {
    const initialState = {
      lists: [],
      loading: true,
      error: false,
      form: { ` +
    initialValue +
    `},
    };
    function reducer(state, action) {
      switch (action.type) {
        case "SET_DATA":
          return { ...state, lists: action.lists, loading: false };
        case "ERROR":
          return { ...state, loading: false, error: true };
        case "ADD": 
          return { ...state, lists: [action.data, ...state.lists] };
        case "RESET": 
          return { ...state, form: initialState.form };
        case "SET_INPUT": 
          return {
            ...state,
            form: { ...state.form, [action.name]: action.value },
          }; 
        default:
          return state;
      }
    }
    const [state, dispatch] = useReducer(reducer, initialState);
    async function create${name}() {
      const { form } = state;
      const data = {
        ...form,
        ...initialValue,
        id: uuid(),
      };
      dispatch({ type: "ADD", data });
      dispatch({ type: "RESET" });
      try {
        await ${name}.create${name}(data);
        console.log("succesfully created!");
        if (onCreate) {
          onCreate();
        } else {
          window.location.reload();
        }
      } catch (err) {
        console.log("error:", err);
      }
    }
    function onChange(e) {
      dispatch({ type: "SET_INPUT", name: e.target.name, value: e.target.value });
    }

    const schema = require("../../../src/schema.js");
    let data = schema["${name}"];
  
    return (
      <div style={ style }>
        <Form onFinish={create${name}}>
          {inputColumn.map((column) => {
            for (let i = 0; i < data.length; i++) {
              if (data[i]["name"] == column && data[i]["mandatory"]) {
                //필수
                if (data[i]["type"] === "AWSDate") {
                  return (
                    <Form.Item
                      key={column}
                      name={column}
                      rules={[
                        {
                          required: true,
                          message: \`please write \${column}\`,
                        },
                      ]}
                    >
                      <DatePicker
                        style={{ width: "50%" }}
                        value={state.form.column}
                        onChange={(_m, dateString) => {
                          dispatch({
                            type: "SET_INPUT",
                            name: column,
                            value: dateString,
                          });
                        }}
                      />
                    </Form.Item>
                  );
                } else if (data[i]["type"] === "AWSURL") {
                  return (
                    <Form.Item
                      key={column}
                      name={column}
                      rules={[
                        {
                          required: true,
                          message: \`please write \${column}\`,
                        },
                      ]}
                    >
                      <Input
                        defaultValue="https://"
                        key={column} //map 쓸때 반환되는 애들은 무조건 key가 있어야 함
                        onChange={onChange}
                        value={state.form.column} //이래도 돼..?
                        placeholder={column}
                        name={column}
                      />
                    </Form.Item>
                  );
                } else if (data[i]["type"] === "Int") {
                  return (
                    <Form.Item
                      key={column}
                      name={column}
                      rules={[
                        {
                          required: true,
                          message: \`please write \${column}\`,
                        },
                      ]}
                    >
                    <InputNumber
                    key={column} //map 쓸때 반환되는 애들은 무조건 key가 있어야 함
                    onChange={(value) => {
                      dispatch({
                        type: "SET_INPUT",
                        name: column,
                        value: value,
                      });
                    }}
                    placeholder={column} //DatePicker거 넘겨주는거 해야함
                  />
                    </Form.Item>
                  );
                } else if (data[i]["type"] === "Boolean") {
                    return (
                      <Form.Item
                        label={column}
                        key={column}
                        name={column}
                        rules={[
                          { required: true, message: \`please write \${column}\` },
                        ]}
                      >
                        <Checkbox
                          onChange={(e) => {
                            dispatch({
                              type: "SET_INPUT",
                              name: column,
                              value: e.target.checked,
                            });
                          }}
                        >
                          {column}
                        </Checkbox>
                      </Form.Item>
                    );
                  } else {
                  return (
                    <Form.Item
                      key={column}
                      name={column}
                      rules={[
                        {
                          required: true,
                          message: \`please write \${column}\`,
                        },
                      ]}
                    >
                      <Input
                        key={column}
                        onChange={onChange}
                        value={state.form.column} //이래도 돼..?
                        placeholder={column}
                        name={column}
                      />
                    </Form.Item>
                  );
                }
              } else if (data[i]["name"] == column) {
                //필수는 아닌애들
                if (data[i]["type"] === "AWSDate") {
                  return (
                    <DatePicker
                      key={column}
                      style={{ width: "50%" }}
                      value={state.form.column}
                      onChange={(_m, dateString) => {
                        dispatch({
                          type: "SET_INPUT",
                          name: column,
                          value: dateString,
                        });
                      }}
                    />
                  );
                } else if (data[i]["type"] === "AWSURL") {
                  return (
                    <Input
                      defaultValue="https://"
                      key={column} //map 쓸때 반환되는 애들은 무조건 key가 있어야 함
                      onChange={onChange}
                      value={state.form.column} //이래도 돼..?
                      placeholder={column}
                      name={column}
                    />
                  );
                } else if (data[i]["type"] === "Int") {
                  return (
                    <InputNumber
                    key={column} //map 쓸때 반환되는 애들은 무조건 key가 있어야 함
                    onChange={(value) => {
                      dispatch({
                        type: "SET_INPUT",
                        name: column,
                        value: value,
                      });
                    }}
                    placeholder={column} //DatePicker거 넘겨주는거 해야함
                  />
                  );
                } else if (data[i]["type"] === "Boolean") {
                    return (
                      <Checkbox
                        onChange={(e) => {
                          dispatch({
                            type: "SET_INPUT",
                            name: column,
                            value: e.target.checked,
                          });
                        }}
                      >
                        {column}
                      </Checkbox>
                    );
                  } else {
                  return (
                    <Input
                      key={column}
                      onChange={onChange}
                      value={state.form.column}
                      placeholder={column}
                      name={column}
                    />
                  );
                }
              } else {
              }
            }
          })}
  
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => console.log("click")}
          >
            생성
          </Button>
        </Form>
      </div>
    );
  }

  export default ${name}Create;
  `;
  return ret;
};
