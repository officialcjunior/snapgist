import Draggable from "react-draggable";
import { useState, useRef } from "react";
import {
  MdCreate,
  MdOutlineSave,
  MdOutlineUploadFile,
  MdDelete,
} from "react-icons/md";

const Card = (props) => {
  const nodeRef = useRef(null);
  const [text, setText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  // Assuming the first file is the default active tab
  const [activeTab, setActiveTab] = useState(Object.keys(props.files)[0]); 
  
  const filesArray = Object.keys(props.files).map((filename) => ({
    filename: filename,
    ...props.files[filename],
  }));

  const handleTabClick = (name) => {
    setActiveTab(name);
  };

  const handleEdit = () => {
    setText(props.files[activeTab].content);
    setIsEditing(!isEditing);
  };

  const handleCommit = () => {
    props.commitCard(props.id, activeTab, text);
  };

  const handleSave = () => {
    const updatedFiles = { ...props.files };
    updatedFiles[activeTab].content = text;
    // Exit edit mode after saving
    setIsEditing(false);
  };

  return (
    <Draggable nodeRef={nodeRef} handle=".header">
      <div className={`card ${isEditing ? "editing" : ""}`} ref={nodeRef}>
        <div className="header">{props.title}</div>
        <div className="tabs">
          {filesArray.map((file) => (
            <button
              key={file.filename}
              className={file.filename === activeTab ? "active" : ""}
              onClick={() => handleTabClick(file.filename)}
            >
              {file.filename}
            </button>
          ))}
        </div>
        <div className="content">
          {filesArray.map((file) => (
            <div
              key={file.filename}
              className={`${
                file.filename === activeTab ? "active" : "hidden"
              } ${isEditing && file.filename === activeTab ? "editing" : ""}`}
            >
              <textarea
                className="text-input"
                value={
                  isEditing && file.filename === activeTab ? text : file.content
                }
                // Disable the textarea when not in edit mode or when it's not the active tab
                onDoubleClick={() => setText("")}
                // Call handleEdit function when textarea is clicked
                disabled={!isEditing || file.filename !== activeTab}onClick={() => handleEdit()}
              />
            </div>
          ))}
        </div>
        
        <button
          className="cardoperationsbutton"
          onClick={isEditing ? handleSave : handleEdit}
        >

        <div className="icon">
            {isEditing ? <MdOutlineSave /> : <MdCreate />}
          </div>
        </button>

        <button className="cardoperationsbutton" onClick={handleCommit}>
          <div className="icon">
            <MdOutlineUploadFile />
          </div>
        </button>

        <button
          className="cardoperationsbutton"
          onClick={() => props.deleteCard(props.id)}
        >
          <div className="icon">
            <MdDelete />
          </div>
        </button>

      </div>
    </Draggable>
  );
};

export default Card;
