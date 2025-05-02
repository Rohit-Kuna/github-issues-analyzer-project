import { useState } from 'react';
import RepoInput from './components/RepoInput';
import Dashboard from './components/Dashboard';
import { fetchRepositoryIssues } from './services/githubService';
import './App.scss';

function App() {
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRepoSubmit = async (owner, repo) => {
    setIsLoading(true);
    setError('');

    try {
      const fetchedIssues = await fetchRepositoryIssues(owner, repo);
      setIssues(fetchedIssues);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>GitHub Issues Analyzer</h1>
      </header>

      <main>
        <RepoInput onSubmit={handleRepoSubmit} isLoading={isLoading} />
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {issues.length > 0 && !error && (
          <Dashboard issues={issues} />
        )}
      </main>
    </div>
  );
}

export default App;
