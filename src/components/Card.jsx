import Draggable from "react-draggable";
import { useState, useRef } from "react";

const Card = (props) => {
  const nodeRef = useRef(null);
  const [text, setText] = useState("");

  // loop through props.files and print file.name and file.content
  console.log(props.files);
  //console.log(props.files[0].name);
  //console.log(props.files[0].content);
  
  // Convert props.files object to an array of file objects
    const filesArray = Object.keys(props.files).map((filename) => ({
      filename: filename,
      ...props.files[filename]
    }));


  //const [text, setText] = useState(props.content.replace(/\n/g, "<br />"));
  const [isEditing, setIsEditing] = useState(false);

  const [activeTab, setActiveTab] = useState(Object.keys(props.files).filename); // Set the first file as active by default

  const handleTabClick = (name) => {
    setActiveTab(name);
  };

  return (
    <Draggable nodeRef={nodeRef} handle=".header">
      <div className={`card ${isEditing ? "editing" : ""}`} ref={nodeRef}>
        <div className="header">{props.title}</div>
        <div className="tabs">
          {filesArray.map((file) => (
            <button
              key={file.filename}
              className={file.filename === activeTab ? 'active' : ''}
              onClick={() => handleTabClick(file.filename)}
            >
              {file.filename}
            </button>
          ))}
        </div>
        <div className="content">
          {filesArray.map((file) => (
            <div key={file.filename} className={file.filename === activeTab ? 'active' : 'hidden'}>
              <textarea
                className="text-input"
                value={file.content}
                onChange={(e) => setText(e.target.value)}
                onDoubleClick={() => setText("")}
              />
            </div>
          ))}
        </div>
        <button onClick={() => props.deleteCard(props.id)}>Delete</button>
      </div>
    </Draggable>
  );
};

export default Card;

