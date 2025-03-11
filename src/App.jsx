import * as React from 'react';

const welcome = {
  greeting: 'Hey',
  title: 'React'
}

const Item = ({item, onRemoveItem}) => {
  return (
    <li>
      <span><a href={item.url}>{item.title}</a></span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
        <button type="button" onClick={() => onRemoveItem(item)}>
          Dismiss
        </button>
      </span>
    </li>
  );
};

const List = ({list, onRemoveItem}) => {
  return (
    <ul>
      {
        list.map((item) => (
            <Item 
              key={item.objectID}
              item={item} 
              onRemoveItem={onRemoveItem}
            />
          )
        )
      }
    </ul>
  )
}

const InputWithLabel = ({
  id, 
  value, 
  type='text', 
  onInputChange,
  isFocused,
  children
}) => {
  // A
  const inputRef = React.useRef();

  // C
  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input 
        ref={inputRef}
        id={id} 
        type={type}
        value={value}
        autoFocus={isFocused}
        onChange={onInputChange}
      />
    </>
  )
}

const useStorageState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue]
};

const App = () => {
  const initialStories = [
    {
      title: 'React',
      url: 'htts://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: 'Redux',
      url: 'htts://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1,
    }
  ];

  const getAsyncStories = () => 
    new Promise((resolve) =>
      setTimeout(
        () => resolve({data: {stories: initialStories}}),
        2000
      )
    );

  const storiesReducer = (state, action) => {
    switch (action.type) {
      case 'SET_STORIES':
        return action.payload;
      case 'REMOVE_STORY':
        return state.filter(
          (story) => action.payload.objectID !== story.objectID
        );
      default:
        throw new Error();
    }
  };

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer, []
  );

  const [searchTerm, setSearchTerm] = useStorageState(
    'search',
    'React'
  );

  // const [stories, setStories] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  React.useEffect(() => {
    setIsLoading(true);
    getAsyncStories().then(result => {
      dispatchStories({
        type: 'SET_STORIES',
        payload: result.data.stories
      });
      setIsLoading(false);
    })
    .catch(() => setIsError(true));
  }, [])

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item
    })
  }

  const searchedStories = stories.filter(story => {
    return story.title.toLowerCase().includes(searchTerm.toLowerCase())
  });

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  return (
    <>
      <h1>My Hacker Stories</h1>
      <InputWithLabel 
        id="search" 
        label="Search" 
        value={searchTerm}
        isFocused={true}
        onInputChange={handleSearch}
      >
        <strong>Search:</strong>
      </InputWithLabel>
      <hr/>

      {isError && <p>Something went wrong ...</p>}

      {
        isLoading ? (
          <p>Loading ...</p>
        ) : (
          <List list={searchedStories} onRemoveItem={handleRemoveStory}/>
        )
      }
    </>
  );
}

export default App
