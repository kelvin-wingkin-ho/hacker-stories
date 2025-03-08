import * as React from 'react';

const welcome = {
  greeting: 'Hey',
  title: 'React'
}

const Item = ({title, url, author, num_comments, points}) => (
  <li>
    <span><a href={url}>{title}</a></span>
    <span>{author}</span>
    <span>{num_comments}</span>
    <span>{points}</span>
  </li>
);

const List = ({list}) => {
  return (
    <ul>
      {
        list.map((item) => (
            <Item key={item.objectID} {...item}/>
          )
        )
      }
    </ul>
  )
}

const Search = ({ search, onSearch }) => {
  return (
    <div>
      <label htmlFor="search">Search:</label>
      <input id="search" type="text" value={search}
        onChange={onSearch}/>
    </div>
  )
}

const App = () => {
  const stories = [
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

  const [searchTerm, setSearchTerm] = React.useState(
    localStorage.getItem('search') || 'React'
  );

  React.useEffect(() => {
    localStorage.setItem('search', searchTerm);
  }, [searchTerm])

  const searchedStories = stories.filter(story => {
    return story.title.toLowerCase().includes(searchTerm.toLowerCase())
  });

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <Search search={searchTerm} onSearch={handleSearch}/>
      <hr/>
      <List list={searchedStories}/>
    </div>
  );
}

export default App
