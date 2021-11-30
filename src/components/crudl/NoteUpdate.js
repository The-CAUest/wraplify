import React, { useEffect, useReducer } from 'react'
import { DatePicker, InputNumber, Form, Input, Button, Checkbox, Space } from 'antd'
import 'antd/dist/antd.css'
import Note from '../../classes/crudl/Note'
import moment from 'moment'

const schema = require("../../../src/schema");

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
  form: { name: '', completed: '', date: '', url: '', age: '', }
}
    
function NoteUpdate({ id, onUpdate, style={} }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const changeColumns = ['name', 'completed', 'date', 'url', 'age', ]
  const data = schema['Note']
  
  useEffect(() => {
    fetchNote()
  }, [])
  
  if ((typeof (state.list) == 'undefined') || (state.list === null) || (Object.keys(state.list).length === 0)) return null
  
  async function fetchNote () {
    try {
      Note.readNote(id).then(data => {
        dispatch({ type: 'SET_DATA', list: data })
        dispatch({ type: 'SET_INPUT', name: 'name', value: data['name'] })
				dispatch({ type: 'SET_INPUT', name: 'completed', value: data['completed'] })
				dispatch({ type: 'SET_INPUT', name: 'date', value: data['date'] })
				dispatch({ type: 'SET_INPUT', name: 'url', value: data['url'] })
				dispatch({ type: 'SET_INPUT', name: 'age', value: data['age'] })
				
      })
    } catch (err) {
      console.log('fetch error : ', err)
      dispatch({ type: 'ERROR' })
    }
  }
  
  async function updateNote () {
    const list = state.list
    dispatch({ type: 'SET_DATA', list })
    try {
      await Note.updateNote({ id, ...state.form })
      console.log('successfully updated note!')
      if(onUpdate) {
        onUpdate();
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.log('update error : ', err)
    }
  }
  
  function onChange (e) {
    dispatch({ type: 'SET_INPUT', name: e.target.name, value: e.target.value })
  }
  
  return (
    <div
      className="App"
      style={{ display:'flex', justifyContent: 'center', marginTop:50, ...style}}
    >
      <Form
        initialValues={{name: state.list["name"], completed: state.list["completed"], date: state.list["date"], url: state.list["url"], age: state.list["age"], }}
        onFinish={updateNote}
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
                    rules={[{ required: true, message: `please write ${column}` }]}
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
                    rules={[{ required: true, message: `please write ${column}` }]}
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
                    rules={[{ required: true, message: `please write ${column}` }]}
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
                    rules={[{ required: true, message: `please write ${column}` }]}
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
          <Button type="primary" htmlType="submit">
            수정
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default NoteUpdate
    