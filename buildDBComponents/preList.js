exports.makeListComponent = (name) => {
  let fileContext = `import { Checkbox, List } from 'antd'
import 'antd/dist/antd.css'
import ${name} from '../../classes/${name}'
import { useEffect, useState } from 'react'

function ${name}List({ filter, showList }) {
  const [filteredData, setFilteredData] = useState([])
  
  useEffect(() => {
    ${name}.list${name}().then(data => {
      let pre_data = {}
      if(!filter) {
        pre_data = data
      } else {
        const filter_arr = Object.entries(filter)
        filter_arr.forEach((condition) => {
          const key = condition[0]
          const value = condition[1]
          pre_data = data.filter(elem => elem[key] === value)
        })
      }
      setFilteredData(pre_data)
    })
  }, [])
  
  if (!filteredData) return null
  
  return (
    <div
       className="App"
       style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}
     >
        <List
          style={{ marginTop: 16, width:700 }}
          bordered
          dataSource={filteredData}
          renderItem={item => (
            <List.Item
              style={{textAlign: 'center'}}
            >
              {showList.map(function (elem) {
                if (typeof (item[elem]) === 'boolean') {
                  return <Checkbox defaultChecked={item[elem]} disabled>{elem}</Checkbox>
                }
                return <p>{item[elem].toString()}</p>
              })}
            </List.Item>
          )}
        />
     </div>
  )  
}

export default ${name}List
  `
  return fileContext
}