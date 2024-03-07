import Draggable from "react-draggable";
import { useState, useRef } from "react";

const Card = (props) => {
  const nodeRef = useRef(null);
  const [text, setText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState(Object.keys(props.files)[0]); // Assuming the first file is the default active tab

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

  const handleSave = () => {
    // Assuming you want to update the content of the active file
    // You might need to adjust this based on how your props.files is structured
    const updatedFiles = { ...props.files };
    updatedFiles[activeTab].content = text;
    // Here, you would typically update the parent component's state or perform some action to save the changes
    // For example, you might call a function passed as a prop like props.onUpdateFiles(updatedFiles)
    setIsEditing(false); // Exit edit mode after saving
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
              className={file.filename === activeTab ? "active" : "hidden"}
            >
              <textarea
                className="text-input"
                value={isEditing ? text : file.content}
                onChange={(e) => setText(e.target.value)}
                disabled={!isEditing} // Disable the textarea when not in edit mode
              />
            </div>
          ))}
        </div>
        <button onClick={isEditing ? handleSave : handleEdit}>
          {isEditing ? "Save" : "Edit"}
        </button>

        <button onClick={() => props.deleteCard(props.id)}>Delete</button>
      </div>
    </Draggable>
  );
};

export default Card;
