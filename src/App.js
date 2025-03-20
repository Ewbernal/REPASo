import { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const postsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [postsResponse, usersResponse] = await Promise.all([
          fetch('https://jsonplaceholder.typicode.com/posts'),
          fetch('https://jsonplaceholder.typicode.com/users')
        ]);
        
        const postsData = await postsResponse.json();
        const usersData = await usersResponse.json();
        
        setPosts(postsData);
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const fetchComments = async (postId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
      );
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    fetchComments(post.id);
  };

  const filteredPosts = posts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           post.body.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesUser = selectedUser ? post.userId === parseInt(selectedUser) : true;
      return matchesSearch && matchesUser;
    });

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: "'Poppins', sans-serif",
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh'
    },
    header: {
      backgroundColor: '#2A2F4F',
      padding: '25px',
      borderRadius: '15px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      marginBottom: '30px',
      textAlign: 'center'
    },
    title: {
      color: '#FFD700',
      fontSize: '2.5rem',
      margin: '0 0 20px 0',
      textShadow: '2px 2px 4px rgba(118, 110, 110, 0.3)'
    },
    filtersContainer: {
      display: 'flex',
      gap: '20px',
      marginBottom: '20px',
      justifyContent: 'center'
    },
    input: {
      padding: '12px 20px',
      width: '400px',
      borderRadius: '30px',
      border: 'none',
      fontSize: '16px',
      background: 'rgba(237, 233, 233, 0.9)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    select: {
      padding: '12px 20px',
      borderRadius: '30px',
      border: 'none',
      background: 'rgba(255,255,255,0.9)',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    postCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: '15px',
      padding: '25px',
      marginBottom: '25px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      borderLeft: '6px solidrgb(36, 23, 211)',
      ':hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 25px rgba(230,57,70,0.2)'
      }
    },
    commentSection: {
      backgroundColor: '#F8F9FA',
      borderRadius: '15px',
      padding: '25px',
      marginTop: '30px',
      boxShadow: '0 4px 15px rgba(57, 56, 56, 0.05)'
    },
    commentCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      padding: '20px',
      margin: '20px 0',
      borderLeft: '4px solidrgb(121, 157, 198)',
      position: 'relative',
      ':before': {
        content: '"💬"',
        position: 'absolute',
        left: '-35px',
        top: '15px',
        fontSize: '24px'
      }
    },
    button: {
      padding: '12px 30px',
      margin: '0 15px',
      backgroundColor: '#E63946',
      color: 'white',
      border: 'none',
      borderRadius: '30px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      ':hover': {
        backgroundColor: '#D62828',
        transform: 'scale(1.05)'
      }
    },
    backButton: {
      backgroundColor: '#2A2F4F',
      marginBottom: '30px'
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '40px 0'
    },
    loading: {
      textAlign: 'center',
      fontSize: '20px',
      color: '#2A2F4F',
      padding: '30px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🚀PRUEBA 🚀</h1>
        
        <div style={styles.filtersContainer}>
          <input
            type="text"
            placeholder="🔍 Buscar publicaciones..."
            style={styles.input}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          <select 
            onChange={(e) => setSelectedUser(e.target.value)}
            style={styles.select}
            value={selectedUser}
          >
            <option value="">👥 Todos los usuarios</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                👤 {user.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <div style={styles.loading}>⏳ Cargando...</div>}

      {!selectedPost ? (
        <>
          <div>
            {currentPosts.map(post => (
              <div 
                key={post.id} 
                style={styles.postCard}
                onClick={() => handlePostClick(post)}
              >
                <h2 style={{ color: '#2A2F4F', marginBottom: '15px' }}>{post.title}</h2>
                <p style={{ color: '#6C757D', lineHeight: '1.6' }}>{post.body}</p>
                <div style={{ 
                  marginTop: '20px', 
                  color: '#E63946',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>📝 Publicación #{post.id}</span>
                  <span style={{ 
                    backgroundColor: '#2A2F4F',
                    color: 'white',
                    padding: '5px 15px',
                    borderRadius: '20px'
                  }}>
                    👤 {users.find(u => u.id === post.userId)?.name || post.userId}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.pagination}>
            <button
              style={styles.button}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              ← Anterior
            </button>
            <span style={{ 
              margin: '0 25px', 
              color: '#2A2F4F',
              fontWeight: '600'
            }}>
              Página {currentPage} de {Math.ceil(filteredPosts.length / postsPerPage)}
            </span>
            <button
              style={styles.button}
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage >= Math.ceil(filteredPosts.length / postsPerPage)}
            >
              Siguiente →
            </button>
          </div>
        </>
      ) : (
        <div>
          <button
            style={{ ...styles.button, ...styles.backButton }}
            onClick={() => setSelectedPost(null)}
          >
            ← Volver al listado
          </button>
          
          <div style={styles.postCard}>
            <h2 style={{ 
              color: '#2A2F4F', 
              marginBottom: '25px',
              fontSize: '2rem'
            }}>
              {selectedPost.title}
            </h2>
            <p style={{ 
              fontSize: '18px', 
              lineHeight: '1.8', 
              color: '#495057',
              marginBottom: '25px'
            }}>
              {selectedPost.body}
            </p>
            <div style={{ 
              margin: '25px 0', 
              padding: '20px',
              backgroundColor: '#E63946',
              borderRadius: '15px',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>📌 Publicación #{selectedPost.id}</span>
              <span style={{ fontWeight: '600' }}>
                👤 Autor: {users.find(u => u.id === selectedPost.userId)?.name || selectedPost.userId}
              </span>
            </div>
          </div>

          <div style={styles.commentSection}>
            <h3 style={{ 
              color: '#2A2F4F', 
              marginBottom: '30px',
              fontSize: '1.5rem',
              textAlign: 'center'
            }}>
              💬 Comentarios ({comments.length})
            </h3>
            {comments.map(comment => (
              <div key={comment.id} style={styles.commentCard}>
                <h4 style={{ 
                  color: '#2A2F4F', 
                  marginBottom: '15px',
                  fontSize: '1.2rem'
                }}>
                  {comment.name}
                </h4>
                <p style={{ 
                  color: '#6C757D', 
                  lineHeight: '1.7',
                  fontSize: '16px'
                }}>
                  {comment.body}
                </p>
                <div style={{ 
                  marginTop: '20px', 
                  textAlign: 'right'
                }}>
                  <a 
                    href={`mailto:${comment.email}`} 
                    style={{
                      color: '#E63946',
                      textDecoration: 'none',
                      fontWeight: '600'
                    }}
                  >
                    ✉️ {comment.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;