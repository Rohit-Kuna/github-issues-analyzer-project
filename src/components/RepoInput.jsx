import { useState } from 'react';
import '../styles/RepoInput.scss';

const RepoInput = ({ onSubmit, isLoading }) => {
  const [repoInput, setRepoInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const [owner, repo] = repoInput.split('/');
    if (!owner || !repo) {
      setError('Please enter a valid repository in the format: owner/repo');
      return;
    }

    onSubmit(owner, repo);
  };

  return (
    <div className="repo-input">
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            value={repoInput}
            onChange={(e) => setRepoInput(e.target.value)}
            placeholder="Enter repository (e.g., facebook/react)"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Analyze'}
          </button>
        </div>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default RepoInput; 