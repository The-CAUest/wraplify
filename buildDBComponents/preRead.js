exports.makeReadComponent = (name) => {
  let fileContext = `import { Card, Checkbox } from 'antd'
import 'antd/dist/antd.css'
import ${name} from '../../classes/${name}'
import { useEffect, useState } from 'react'

function ${name}Read({ id, title, showList }) {
  const [data, setData] = useState({})

  useEffect(() => {
    ${name}.read${name}(id).then(data => setData(data))
  }, [id])

  if (!data) return null
  
  return(
      <div
        className="App"
        style={{ display:'flex', justifyContent: 'center', marginTop:50}}
      >
        <Card 
          style={{marginTop :16, width: 300, textAlign: 'center'}}
          type="inner"
          title={data[title]}>
          {showList.map(function (elem) {
            if (typeof (data[elem]) === 'boolean') {
              return <Checkbox style={{marginBottom:15}} defaultChecked={data[elem]}>{elem}</Checkbox>
            }
            return <p>{data[elem]}</p>
          })}
        </Card>
      </div>
   )
}

export default ${name}Read
  `
  return fileContext
}
