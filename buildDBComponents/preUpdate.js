const path = require("path");

const makeUpdateForm = (name, form) => {
  const keys = Object.keys(form); // [name description]
  let formItem = ``;
  let initialValues = ``;
  let realFormItem = ``;
  let dispatchItem = ``;
  let changeColumns = ``;
  for (let num = 0; num < keys.length; num++) {
    formItem += `
      <Form.Item
        label="${keys[num]}"
        name="${keys[num]}"
        rules={[{ required: true, message: 'Please input your ${keys[num]}' }]}
      >
        <Input
          onChange={onChange}
          name="${keys[num]}"
        />
      </Form.Item>
    `;
    initialValues += `${keys[num]}: state.list["${keys[num]}"], `;
    changeColumns += `'${keys[num]}', `;
    realFormItem += `${keys[num]}: '', `;
    dispatchItem += `dispatch({ type: 'SET_INPUT', name: '${keys[num]}', value: data['${keys[num]}'] })`;
    dispatchItem += `\n\t\t\t\t`;
  }
  // console.log(formItem)

  const updateForm = `
    <Form
      initialValues={{${initialValues}}}
    >
          ${formItem}
      <Form.Item
        wrapperCol={{ offset: 8, span: 16, }}
      >
        <Button type="primary" htmlType="submit" onClick={() => update${name}()}>
          Update
        </Button>
      </Form.Item>
    </Form>
  `;
  const realForm = `{ ${realFormItem}}`;
  console.log(initialValues);
  // console.log(`Real Form : ${realForm}`)
  // console.log(`Real Form : ${realForm}`)

  return [updateForm, realForm, initialValues, dispatchItem, changeColumns];
};

exports.makeUpdateComponent = (name) => {
  const schemaPath = path.join(process.cwd(), "./src/schema.js");
  const schema = require(schemaPath);

  let columnData = schema[name];
  let tempForm = {};
  for (let i = 0; i < columnData.length; i++) {
    if (
      // eslint-disable-next-line no-mixed-operators
      columnData[i]["type"] !== "ID"
    ) {
      tempForm[columnData[i].name] = "";
    }
  }
  const [updateform, realForm, initialValues, dispatchItem, changeColumns] =
    makeUpdateForm(name, tempForm);

  let fileContext = `import React, { useEffect, useReducer } from 'react'
import { DatePicker, InputNumber, Form, Input, Button, Checkbox } from 'antd'
import 'antd/dist/antd.css'
import ${name} from '../../classes/${name}'
import moment from 'moment'

const schema = require("../../src/schema");

function reducer (state, action) {
  switch (action.type) {
    case 'SET_INPUT':
      return { ...state, form: { ...state.form, [action.name]: action.value } }
    case 'SET_DATA':
      return { ...state, list: action.list, loading: false }
    case 'ERROR':
      return { ...state, loading: false, error: true }
    default:
      return state
  }
}

const initialState = {
  list: {},
  loading: true,
  error: false,
  form: ${realForm}
}
    
function ${name}Update({ id }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const changeColumns = [${changeColumns}]
  const data = schema['${name}']
  
  useEffect(() => {
    fetch${name}()
  }, [])
  
  if ((typeof (state.list) == 'undefined') || (state.list === null) || (Object.keys(state.list).length === 0)) return null
  
  async function fetch${name} () {
    try {
      ${name}.read${name}(id).then(data => {
        dispatch({ type: 'SET_DATA', list: data })
        ${dispatchItem}
      })
    } catch (err) {
      console.log('fetch error : ', err)
      dispatch({ type: 'ERROR' })
    }
  }
  
  async function update${name} () {
    try {
      await ${name}.update${name}({ id, ...state.form })
      console.log('successfully updated note!')
    } catch (err) {
      console.log('update error : ', err)
    }
    dispatch({ type: 'SET_DATA', ...state.list })
  }
  
  function onChange (e) {
    dispatch({ type: 'SET_INPUT', name: e.target.name, value: e.target.value })
  }
  
  return (
    <div
      className="App"
      style={{ display:'flex', justifyContent: 'center', marginTop:50}}
    >
      <Form
        initialValues={{${initialValues}}}
      >
        {changeColumns.map(column => {
          for(let i = 0; i < data.length; i++) {
            if (data[i]['name'] === column) {
              if (data[i]['type'] === 'AWSDate') {
                return (
                  <Space size={10} style={{width: '100%', marginBottom: 20, display: 'left'}}>
                    * date
                    <DatePicker
                      style={{ width: '130%' }}
                      value={state.form.column}
                      defaultValue={moment(state.list[column], 'YYYY-MM-DD')}
                      onChange={(_m, dateString) => {
                        dispatch({ type: 'SET_INPUT', name: column, value: dateString })
                      }}
                    />
                  </Space>
                )
              } else if (data[i]['type'] === 'AWSURL') {
                return (
                  <Form.Item
                    label={column}
                    key={column}
                    name={column}
                    rules={[{ required: true, message: \`please write \${column}\` }]}
                  >
                    <Input
                      defaultValue="https://"
                      onChange={onChange}
                      value={state.form.column}
                      placeholder={column}
                      name={column}
                    />
                  </Form.Item>
                )
              } else if (data[i]['type'] === 'Int') {
                return (
                  <Form.Item
                    label={column}
                    key={column}
                    name={column}
                    rules={[{ required: true, message: \`please write \${column}\` }]}
                  >
                    <InputNumber
                      key={column} //map 쓸때 반환되는 애들은 무조건 key가 있어야 함
                      defaultValue={state.list['age']}
                      onChange={(value) => {
                        dispatch({ type: 'SET_INPUT', name: column, value: value })
                      }}
                      value={state.form.column}
                      placeholder={column}
                      name={column}
                    />
                  </Form.Item>
                )
              } else if (data[i]['type'] === 'Boolean') {
                return (
                  <Form.Item
                    label={column}
                    key={column}
                    name={column}
                    rules={[{ required: true, message: \`please write \${column}\` }]}
                  >
                    <Checkbox
                      defaultChecked={state.list[column]}
                      onChange={(e) => {
                        dispatch({ type: 'SET_INPUT', name: column, value: e.target.checked })
                      }}
                    >
                      {column}
                    </Checkbox>
                  </Form.Item>
                )
              } else {
                return (
                  <Form.Item
                    label={column}
                    key={column}
                    name={column}
                    rules={[{ required: true, message: \`please write \${column}\` }]}
                  >
                    <Input
                      key={column}
                      onChange={onChange}
                      value={state.form.column}
                      placeholder={column}
                      name={column}
                    />
                  </Form.Item>
                )
              }
            } 
          }
        })}
        <Form.Item
          wrapperCol={{ offset: 8, span: 16, }}
        >
          <Button type="primary" htmlType="submit" onClick={() => updateNote()}>
            Update
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default ${name}Update
    `;
  return fileContext;
};
