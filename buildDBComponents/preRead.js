const path = require("path");

const ReadComp = (isImg) => {
  let ReadItemForm = "";
  if (isImg) {
    ReadItemForm = `<Card
          cover={ <img src={data['img_imgUrl']} alt='logo' /> }
          onClick={onClick ? () => onClick(data) : onClick}
          title={data[title]}
        >`;
  } else {
    ReadItemForm = `<Card title={data[title]} onClick={onClick ? () => onClick(data) : onClick}>`;
  }
  return ReadItemForm;
};

exports.makeReadComponent = (name) => {
  const schemaPath = path.join(process.cwd(), "./src/schema.js");
  const schema = require(schemaPath);

  let columnData = schema[name];
  let ReadForm = "";
  let flag = false;

  for (let i = 0; i < columnData.length; i++) {
    if (columnData[i]["name"].startsWith("img_")) {
      flag = true;
    }
  }

  if (flag) {
    ReadForm = ReadComp(true);
  } else {
    ReadForm = ReadComp(false);
  }

  let fileContext = `import { Card, Checkbox } from 'antd'
import 'antd/dist/antd.css'
import ${name} from '../../classes/crudl/${name}'
import React, { useEffect, useState } from 'react'

function ${name}Read({ id, title, showList, onClick, style={} }) {
  const [data, setData] = useState({})

  useEffect(() => {
    ${name}.read${name}(id).then(data => setData(data))
  }, [id])

  if (!data) return null
  
  return(
      <div style={style}>
        ${ReadForm}
          {showList.map(function (elem) {
            if (typeof (data[elem]) === 'boolean') {
              return <Checkbox style={{marginBottom:15}} defaultChecked={data[elem]} disabled>{elem}</Checkbox>
            } else if (elem.startsWith('img_')) {return}
            return <p>{data[elem]}</p>
          })}
        </Card>
      </div>
   )
}

export default ${name}Read
  `;
  return fileContext;
};
