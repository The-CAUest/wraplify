exports.makeListComponent = (name) => {
  let fileContext = `import { Checkbox, List } from 'antd'
import 'antd/dist/antd.css'
import ${name} from '../../classes/crudl/${name}'
import React, { useEffect, useState } from 'react'

function ${name}List({ filter, showList, onClick, style={} }) {
  const [data, setData] = useState([])
  
  useEffect(() => {
    ${name}.list${name}(filter).then(data => {
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
            <List.Item onClick={onClick ? () => onClick(item) : onClick}>
              {showList.map(function (elem) {
                if (typeof (item[elem]) === 'boolean') {
                  return <Checkbox defaultChecked={item[elem]} disabled>{elem}</Checkbox>
                } else if (elem.startsWith('img_')) { 
                  return <img src={item[elem]} alt='logo' />
                 }
                return <p>{item[elem]}</p>
              })}
            </List.Item>
          )}
        />
     </div>
  )  
}

export default ${name}List
  `;
  return fileContext;
};
