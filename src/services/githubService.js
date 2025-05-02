const GITHUB_API_BASE = 'https://api.github.com';

export const fetchRepositoryIssues = async (owner, repo) => {
  const issues = [];
  let page = 1;
  const maxPages = 10; // To get up to 1000 issues (100 per page)

  while (page <= maxPages) {
    try {
      const response = await fetch(
        `${GITHUB_API_BASE}/repos/${owner}/${repo}/issues?state=all&per_page=100&page=${page}`
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.length === 0) {
        break; // No more issues to fetch
      }

      issues.push(...data);
      page++;

      // Check rate limiting headers
      const remaining = response.headers.get('x-ratelimit-remaining');
      if (remaining === '0') {
        throw new Error('GitHub API rate limit exceeded');
      }
    } catch (error) {
      console.error('Error fetching issues:', error);
      throw error;
    }
  }

  return issues;
}; 