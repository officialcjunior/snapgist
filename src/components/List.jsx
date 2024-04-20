import Card from "./Card";
import { useState, useEffect } from "react";
import { CgAddR } from "react-icons/cg";

// https://github.com/zealousAnemone/draggable-list-app/blob/main/src/components/Card.jsx

const List = (props) => {
  const [cards, setCards] = useState([]);

  const addCard = () => {
    const newCard = {
      id: Date.now(),
      title: "new gist",
      files: { "new gist": { content: "Your code" } },
    };
    setCards([newCard, ...cards]);
  };

  const deleteCard = (id) => {
    const tempArr = cards.filter((card) => card.id !== id);
    setCards(tempArr);
  };

  const handleCommitCard = (id, filename, content) => {
    const token = props.token;
    const url = `https://api.github.com/gists/${id}`;

    /* Make another request if the filename is 'New gist' */
    if (filename === "new gist") {
      const requestOptions = {
        method: "POST",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: "New gist",
          public: false,
          files: {
            [filename]: {
              content: content,
            },
          },
        }),
      };

      /* Make a POST request to create a new gist */
      fetch("https://api.github.com/gists", requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to commit card to GitHub gist");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Card committed successfully:", data);
        })
        .catch((error) => {
          console.error("Error committing card to GitHub gist:", error);
        });
    } else {
      const requestOptions = {
        method: "PATCH",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: `Updated gist description for ${filename}`,
          files: {
            [filename]: {
              content: content,
            },
          },
        }),
      };

      fetch(url, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to commit card to GitHub gist");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Card committed successfully:", data);
        })
        .catch((error) => {
          console.error("Error committing card to GitHub gist:", error);
        });
    }
  };

  useEffect(() => {
    async function fetchGists() {
      const token = props.token;
      const url = "https://api.github.com/gists";

      const response = await fetch(url, {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching gists: ${response.status}`);
      }

      const data = await response.json();
      return data;
    }

    async function fetchGist(id) {
      const token = props.token;
      const url = `https://api.github.com/gists/${id}`;
      const response = await fetch(url, {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching gist of ID ${id}: ${response.status}`);
      }

      const data = await response.json();
      return data;
    }

    async function fetchData() {
      try {
        const gists = await fetchGists();
        const newCardsPromises = gists.map(async (gist) => {
          // Fetch content/code for each gist ID
          const contentResponse = await fetchGist(gist.id);

          const firstFileName = Object.keys(contentResponse.files)[0];

          return {
            id: gist.id,
            title: firstFileName,
            files: contentResponse.files,
          };
        });

        //const newCards = gists.map(gist => ({ id: gist.id, title: gist.title, content: 'some code here'}));
        const newCards = await Promise.all(newCardsPromises);
        setCards(newCards);
      } catch (error) {
        console.error("Error fetching gists:", error);
      }
    }
    fetchData();
  }, [props.token]); // Empty dependency array ensures the effect runs only once on component mount

  return (
    <div className="list">
      <div className="add-card-container">
        <CgAddR onClick={addCard} title="Create new Gist"></CgAddR>
      </div>
      <div className="card-container">
        {cards.map((card) => (
          <Card
            title={card.title}
            id={card.id}
            files={card.files}
            deleteCard={deleteCard}
            commitCard={handleCommitCard}
          />
        ))}
      </div>
    </div>
  );
};

export default List;
