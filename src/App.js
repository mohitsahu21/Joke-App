

import './App.css';
import React, { useEffect, useState } from 'react';
import Loading from './Loading';

function App() {
  const [joke, setJoke] = useState();
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [bookmarks, setBookmarks] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleRatingChange = (event) => {
    const newRating = parseInt(event.target.value);
    setRating(newRating);
    // Store the rating in localStorage
    localStorage.setItem('jokeRating', newRating);
  };

  async function callApi() {
    try {
      setLoading(true);
      setRating(0);
      const response = await fetch("https://official-joke-api.appspot.com/random_joke");
      const data = await response.json();
      setJoke(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const handleAddBookmark = () => {
    if (joke) {
      const oldJoke = bookmarks.filter((bookmark) =>bookmark.id == joke.id);
     
      if(oldJoke.length > 0){
       return alert("Joke already Bookmarkd");
      }
      else{
      alert("Bookmarks added successfully");
      const newBookmark = {
        id: joke.id,
        type: joke.type,
        setup: joke.setup,
        punchline: joke.punchline,
        rating: rating
      };
      setBookmarks([...bookmarks, newBookmark]);
      localStorage.setItem('jokeBookmarks', JSON.stringify([...bookmarks, newBookmark]));}
    }
  };

  const handleRemoveBookmark = (id) => {
    const updatedBookmarks = bookmarks.filter((bookmark) => bookmark.id !== id);
    setBookmarks(updatedBookmarks);
    localStorage.setItem('jokeBookmarks', JSON.stringify(updatedBookmarks));
  };

  const handleToggleModal = () => {
    setShowModal(!showModal);
  };



  useEffect(() => {
    callApi();
    // Load rating from localStorage if available
    const storedBookmarks = localStorage.getItem('jokeBookmarks');
    if (storedBookmarks) {
      setBookmarks(JSON.parse(storedBookmarks));
    }
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        Jokes Application
        <span className="bookmark-icon" onClick={handleToggleModal}>
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="20" fill="currentColor" class="bi bi-bookmark" viewBox="0 0 16 16">
  <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>
</svg>
        </span>
      </div>
      { !showModal &&(<div className="card-body">
      <div className='rating'>
          <label htmlFor="rating">Rate this joke:</label>
          <select
            id="rating"
            value={rating}
            onChange={handleRatingChange}
          >
            <option value={0}>Select rating...</option>
            <option value={1}>⭐</option>
            <option value={2}>⭐⭐</option>
            <option value={3}>⭐⭐⭐</option>
            <option value={4}>⭐⭐⭐⭐</option>
            <option value={5}>⭐⭐⭐⭐⭐</option>
          </select>
          <div >
          {rating > 0 && <p>Your rating: {rating} star{rating > 1 ? 's' : ''}</p>}
        </div>
        </div>
        <h5 className="card-title">{loading ? <Loading/> : joke?.type}</h5>
        <p className="card-text">{loading ? <Loading/> : joke?.setup}</p>
        <p className="card-text">{loading ? <Loading/> : joke?.punchline}</p>
        
        
        <button type="button" className="btn btn-primary"  onClick={callApi} disabled={loading}>
          Get Another Joke
        </button>
        <button style={{marginLeft: "10px"}} type="button" className="btn btn-primary" onClick={handleAddBookmark} disabled={!joke}>
          Add Bookmark
        </button>
      </div>)}
      {showModal && (
        <div >
          <div >
            <span  onClick={handleToggleModal}>&times;</span>
            <h3>Bookmarks</h3>
            {bookmarks.length === 0 ? (
              <p>No bookmarks added yet.</p>
            ) : (
              <ul>
                {bookmarks.map((bookmark) => (
                  <li key={bookmark.id}>
                    <strong>{bookmark.type}</strong>
                    <p>{bookmark.setup}</p>
                    <p>{bookmark.punchline}</p>
                    <p>Rating: {bookmark.rating}</p>
                    <button type="button" onClick={() => handleRemoveBookmark(bookmark.id)}>Remove</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;





 