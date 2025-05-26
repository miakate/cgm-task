import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { GithubCommit, GithubSearchResponse } from '../models/github-repo.model';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  http = inject(HttpClient);

  searchRepositories(
    query: string,
    language?: string,
    stars?: number
  ): Observable<GithubSearchResponse> {
    let q = query.trim();
    if (language) q += `+language:${language}`;
    if (stars) q += `+stars:>=${stars}`;

    const params = new HttpParams()
      .set('q', q || 'angular')
      .set('sort', 'stars')
      .set('order', 'desc')
      .set('per_page', 15);

    const headers = new HttpHeaders({
      Accept: 'application/vnd.github+json',
    });

    return this.http.get<GithubSearchResponse>(`${environment.githubApiUrl}/search/repositories`, {
      headers,
      params,
    });
  }

  getCommits(owner: string, repo: string): Observable<GithubCommit[]> {
    const url = `${environment.githubApiUrl}/repos/${owner}/${repo}/commits`;
    return this.http.get<any[]>(url, {
      headers: new HttpHeaders({
        Accept: 'application/vnd.github+json',
      }),
    });
  }
}
