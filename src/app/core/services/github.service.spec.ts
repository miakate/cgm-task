import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GithubService } from './github.service';
import { environment } from '../../../environments/environment.prod';

describe('GithubService', () => {
  let service: GithubService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GithubService],
    });
    service = TestBed.inject(GithubService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call searchRepositories with correct parameters', () => {
    service.searchRepositories('angular', 'typescript', 100).subscribe();

    const req = httpMock.expectOne((r) => {
      const q = r.params.get('q') ?? '';
      return (
        r.url === `${environment.githubApiUrl}/search/repositories` &&
        q.includes('angular') &&
        q.includes('language:typescript') &&
        q.includes('stars:>=100')
      );
    });

    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Accept')).toBe('application/vnd.github+json');

    req.flush({ items: [], total_count: 0, incomplete_results: false });
  });

  it('should call getCommits with correct URL and headers', () => {
    service.getCommits('angular', 'core').subscribe();

    const req = httpMock.expectOne(`${environment.githubApiUrl}/repos/angular/core/commits`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Accept')).toBe('application/vnd.github+json');

    req.flush([]);
  });
});
