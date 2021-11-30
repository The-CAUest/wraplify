import { Checkbox, List } from 'antd'
import 'antd/dist/antd.css'
import Note from '../../classes/crudl/Note'
import React, { useEffect, useState } from 'react'

function NoteList({ filter, showList, style={} }) {
  const [data, setData] = useState([])
  
  useEffect(() => {
    Note.listNote(filter).then(data => {
      setData(data)
    })
  }, [])
  
  if (!data) return null
  
  return (
    <div style={style}>
        <List
          bordered
          dataSource={data}
          renderItem={item => (
            <List.Item/>
              {showList.map(function (elem) {
                if (typeof (item[elem]) === 'boolean') {
                  return <Checkbox defaultChecked={item[elem]} disabled>{elem}</Checkbox>
                } else if (elem.startsWith('img_')) { return }
                return <p>{item[elem]}</p>
              })}
            </List.Item>
          )}
        />
      </div>
  )  
}

export default NoteList
  