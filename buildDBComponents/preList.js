const path = require("path");

const ListComp = (isImg) => {
  let ListItemForm = "";
  if (isImg) {
    ListItemForm = `<List.Item
              extra={
                <img src={item['img_imgUrl']} alt='logo' />
              }
            >`;
  } else {
    ListItemForm = `<List.Item/>`;
  }
  return ListItemForm;
};

exports.makeListComponent = (name) => {
  const schemaPath = path.join(process.cwd(), "./src/schema.js");
  const schema = require(schemaPath);

  let columnData = schema[name];
  let ListForm = "";
  let flag = false;

  for (let i = 0; i < columnData.length; i++) {
    if (columnData[i]["name"].startsWith("img_")) {
      flag = true;
    }
  }

  if (flag) {
    ListForm = ListComp(true);
  } else {
    ListForm = ListComp(false);
  }

  let fileContext = `import { Checkbox, List } from 'antd'
import 'antd/dist/antd.css'
import ${name} from '../../classes/crudl/${name}'
import React, { useEffect, useState } from 'react'

function ${name}List({ filter, showList, style={} }) {
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
            ${ListForm}
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

export default ${name}List
  `;
  return fileContext;
};
