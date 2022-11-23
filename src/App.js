import { useEffect, useState, useRef, useCallback } from 'react';
import './App.css';
import axios from 'axios';
import { Buffer } from 'buffer'

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [newUsers, setNewUsers] = useState([]);

  const observer = useRef();
  const lastUserRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting) {
        fetchUsers()
      }
    }, {threshold: 1})
    if (node) observer.current.observe(node)
  }, [loading])

  const fetchUsers = () => {
    setLoading(true);
    setTimeout(() => {
      axios.get('https://jsonplaceholder.typicode.com/users')
        .then((res) => {
          setUsers(prevUsers => {
            return [...prevUsers, ...res.data]
          })
          setLoading(false);
        })
        .catch(err => {
          if(err) {
            setError(err)
          }
          setLoading(false);
        })
    }, 2000)
  }

  useEffect(() => {
    fetchUsers()

    return () => setUsers([])
  }, [])


  const fetchNewUsers = () => {
    setLoading(true);
      if(users.length > 1) {
        users.map((newUser, index) => {
          axios.get(`https://avatars.dicebear.com/api/male/${newUser.name}.svg`)
            .then(res => {
              const buff = new Buffer(res.data);
              const base64Image = buff.toString('base64');
              newUser.img = base64Image;
  
              setNewUsers(prevNewUsers => {
                return [...prevNewUsers, newUser]
              })
              setLoading(false);
            })
            .catch(err => {
              if(err) {
                setError(err)
              }
              setLoading(false);
            })
        })
      }
  }

  console.log(users.length)
  
  useEffect(() => {
    fetchNewUsers();

  }, [users])



  return (
    <div className="App">
      <div>
        {error && <p style={{color: 'red'}}>Sorry, something occured</p>}
        <h1 style={{textAlign: 'center'}}>User Profiles</h1>

        {newUsers?.map((u, index) => {
          if(users.length === index + 1) {
            return (
              <div ref={lastUserRef} key={index} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{width: '50%', height: 160, color: 'white', fontSize: '1.2rem', fontWeight: 'bold', boxShadow: '0 2px 8px -2px gray', marginBottom: 20, display: 'flex', flexDirection: 'column-reverse', justifyContent: 'center', alignItems: 'center',  background: 'linear-gradient(to right, #4776E6, #8E54E9)'}}>
                  {u.name}
                  <div style={{marginBottom: '15px', width: '50px', height: '50px', borderRadius: '50%', outline: '3px solid white', outlineOffset: '3px'}}>
                    <img src={`data:image/svg+xml;base64,${u.img }`} alt="user" style={{width: '100%', height: '100%'}}/>
                  </div>
                </div>
              </div>)
          } else {
            return (
              <div key={index} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{width: '50%', height: 160, color: 'white', fontSize: '1.2rem', fontWeight: 'bold', boxShadow: '0 2px 8px -2px gray', marginBottom: 20, display: 'flex', flexDirection: 'column-reverse', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(to right, #4776E6, #8E54E9)'}}>
                {u.name}
                <div style={{marginBottom: '15px', width: '50px', height: '50px', borderRadius: '50%', outline: '3px solid white', outlineOffset: '3px'}}>
                  <img src={`data:image/svg+xml;base64,${u.img }`} alt="user" style={{width: '100%', height: '100%'}}/>
                </div>
              </div>
              
            </div>
            )}
        })}
      </div>
      <div  style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        {loading && <img src="/assets/Spinner-0.5s-200px.gif"/>}
      </div>
    </div>
  );
}

export default App;
