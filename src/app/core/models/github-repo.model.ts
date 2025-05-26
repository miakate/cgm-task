export interface GithubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GithubRepo[];
}

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  created_at: string;
  stargazers_count: number;
  language: string;
  owner: GithubOwner;
}

export interface GithubOwner {
  login: string;
  avatar_url: string;
  html_url: string;
}
export interface GithubCommit {
  sha: string;
  html_url: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  author: {
    login: string;
    avatar_url: string;
    html_url: string;
  } | null;
}
