import Card from './Card';
import { useState, useEffect } from 'react';

// https://github.com/zealousAnemone/draggable-list-app/blob/main/src/components/Card.jsx

const List = () => {
  const [cards, setCards] = useState([]);
  const [newCard, setNewCard] = useState('Card 0');

  const addCard = () => {
    const tempArr = [...cards];
    // Create a new card object with a unique ID
    const card = { id: Date.now(), title: newCard, code: '' };
    tempArr.push(card);
    setCards(tempArr);
    setNewCard('Card ' + (cards.length + 1));
  }
  
  const deleteCard = (id) => {
    const tempArr = cards.filter((card) => card.id !== id);
    setCards(tempArr);
  }

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
        // Assuming gists is an array of objects with titles

        /*const newCardsPromises = gists.map((gist) => {
          return fetchGist(gist.id)
            .then((contentResponse) => {
              if (!contentResponse.ok) {
                throw new Error(`Error fetching content for gist ${gist.id}: ${contentResponse.status}`);
              }
              return contentResponse.json();
            })
            .then((contentData) => {
              const fileName = Object.keys(contentData.files)[0]; // Get the first file name
              const content = contentData.files[fileName].content; // Access content using file name
              return { id: gist.id, title: gist.title, content };
            });
        });*/
        
        const newCardsPromises = gists.map(async (gist) => {
          // Fetch content for each gist ID
          const contentResponse = await fetchGist(gist.id);
          //console.log(gist.id, contentResponse);

          //const contentData = await contentResponse.json();

          const firstFileName = Object.keys(contentResponse.files)[0]; // Get the name of the first file
          const content = contentResponse.files[firstFileName].content; // Get the content of the first file

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
      <div className="add-card-form">
        <input type="text" value={newCard} className="new-card-input" onChange={(e) => setNewCard(e.target.value)} />
        <button onClick={addCard}>New Card</button>
      </div>
      <div className="card-container">
        {
          cards.map((card) => <Card title={card.title} id={card.id} files={card.files} deleteCard={deleteCard} />)
        }
      </div>
    </div>
  );
}

export default List;
