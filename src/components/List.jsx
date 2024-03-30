import Card from './Card';
import { useState, useEffect } from 'react';
import { MdAddCircleOutline } from "react-icons/md";

// https://github.com/zealousAnemone/draggable-list-app/blob/main/src/components/Card.jsx

const List = () => {
  const [cards, setCards] = useState([]);
  const [newCard, setNewCard] = useState('New gist');
  const [newCardText, setNewCardText] = useState(''); // Updated to handle user input

  const addCard = () => {
    // Draw a new card, text is empty, and id is the current length of the cards array
    setCards([{ title: newCard, id: cards.length, files: { 'file1': { content: newCardText }}}, ...cards]);
  }
  
  const deleteCard = (id) => {
    const tempArr = cards.filter((card) => card.id !== id);
    setCards(tempArr);
  }

  const handleCommitCard = (id, filename, content) => {
    /* Make a request like this:
      curl -L \
        -X PATCH \
        -H "Accept: application/vnd.github+json" \
        -H "Authorization: Bearer <YOUR-TOKEN>" \
        -H "X-GitHub-Api-Version: 2022-11-28" \
        https://api.github.com/gists/GIST_ID \
        -d '{"description":"An updated gist description","files":{"README.md":{"content":"Hello World from GitHub"}}}'
    */
    console.log(id, filename, content);

    const token = "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"; // Replace with your actual GitHub token
    const url = `https://api.github.com/gists/${id}`;


    const requestOptions = {
      method: 'PATCH',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        description: `Updated gist description for ${filename}`,
        files: {
          [filename]: {
            content: content
          }
        }
      })
    };
  
    fetch(url, requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to commit card to GitHub gist');
        }
        return response.json();
      })
      .then(data => {
        console.log('Card committed successfully:', data);
        // Optionally, you can perform further actions here upon successful commit
      })
      .catch(error => {
        console.error('Error committing card to GitHub gist:', error);
        // Optionally, you can handle errors here
      });

    /* Assuming you want to update the content of the active file
    // You might need to adjust this based on how your props.files is structured
    const updatedFiles = { ...cards[id].files };
    updatedFiles[filename].content = content;
    // Here, you would typically update the parent component's state or perform some action to save the changes
    // For example, you might call a function passed as a prop like props.onUpdateFiles(updatedFiles)
    const updatedCards = [...cards];
    updatedCards[id].files = updatedFiles;
    setCards(updatedCards);*/
  };

  async function fetchGists() {
    const token = "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"; // Replace with your actual GitHub token
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

  useEffect(() => {

    async function fetchGist(id) {
      const token = "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"; // Replace with your actual GitHub token
      const url = `https://api.github.com/gists/${id}`;
      //console.log(url);
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
      //console.log(id, data);
      return data;
    }


    async function fetchData() {
      try {
        const gists = await fetchGists();
        const newCardsPromises = gists.map(async (gist) => {
          // Fetch content for each gist ID
          const contentResponse = await fetchGist(gist.id);
          //console.log(gist.id, contentResponse);

          //const contentData = await contentResponse.json();

          const firstFileName = Object.keys(contentResponse.files)[0]; // Get the name of the first file

          return { id: gist.id, title: firstFileName, files:  contentResponse.files };
        });

        //const newCards = gists.map(gist => ({ id: gist.id, title: gist.title, content: 'some code here'}));
        const newCards = await Promise.all(newCardsPromises);
        setCards(newCards);
      } catch (error) {
        console.error('Error fetching gists:', error);
      }
    }
    fetchData();
  }, []); // Empty dependency array ensures the effect runs only once on component mount

  return (
    <div className="list">

      <MdAddCircleOutline onClick={addCard}></MdAddCircleOutline>

      <div className="card-container">
        {
          cards.map((card) => <Card title={card.title} id={card.id} files={card.files} deleteCard={deleteCard} commitCard={handleCommitCard} />)
        }
      </div>
    </div>
  );
}

export default List;
