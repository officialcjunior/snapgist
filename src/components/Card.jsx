import Draggable from "react-draggable";
import { useState, useRef } from "react";

const Card = (props) => {
  const nodeRef = useRef(null);
  const [text, setText] = useState(props.content.replace(/\n/g, "<br />"));
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Draggable nodeRef={nodeRef} handle=".header">
      <div className={`card ${isEditing ? "editing" : ""}`} ref={nodeRef}>
        <div className="header">{props.title}</div>
        <div className="content">
          {isEditing ? (
            <>
              <textarea
                className="text-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onDoubleClick={() => setText("")}
              />
              <button onClick={() => setIsEditing(false)}>Save</button>
            </>
          ) : (
            <p
              dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, "<br>") }}
              onClick={() => setIsEditing(true)}
            ></p>
          )}
        </div>
        <button onClick={() => props.deleteCard(props.id)}>Delete</button>
      </div>
    </Draggable>
  );
};

export default Card;

