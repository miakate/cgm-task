import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { GithubService } from '../../core/services/github.service';
import { DatePipe, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { sortArray } from '../../core/utils/sort.util';

@Component({
  selector: 'app-repo-list',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, NgIf],
  templateUrl: './repo-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepoListComponent {
  #githubService = inject(GithubService);
  #router = inject(Router);

  searchControl = new FormControl<string | null>('angular');
  languageControl = new FormControl<string | null>('');
  starsControl = new FormControl<string | null>('');

  sortField: 'name' | 'owner' | 'created_at' = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  readonly isLoading = signal(true);

  sortBy(field: 'name' | 'owner' | 'created_at') {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
  }

  sortedRepos(repos: any[]): any[] {
    return sortArray(repos, this.sortField, this.sortDirection, (item, field) => {
      if (field === 'owner') return item.owner.login.toLowerCase();
      if (field === 'name') return item.name.toLowerCase();
      if (field === 'created_at') return new Date(item.created_at).getTime();
      return '';
    });
  }

  readonly repos = toSignal(
    combineLatest([
      this.searchControl.valueChanges.pipe(
        startWith(this.searchControl.value),
        debounceTime(400),
        distinctUntilChanged()
      ),
      this.languageControl.valueChanges.pipe(startWith(this.languageControl.value ?? '')),
      this.starsControl.valueChanges.pipe(startWith(this.starsControl.value ?? '')),
    ]).pipe(
      tap(() => this.isLoading.set(true)),
      switchMap(([query, language, stars]) => {
        const safeQuery = query ?? '';
        const safeLanguage = language?.trim() || undefined;
        const safeStars =
          stars !== null && stars.trim() !== '' && !isNaN(+stars) ? +stars : undefined;

        return this.#githubService.searchRepositories(safeQuery, safeLanguage, safeStars).pipe(
          tap(() => this.isLoading.set(false)),
          catchError(() => {
            this.isLoading.set(false);
            return of({ items: [] });
          })
        );
      })
    )
  );

  navigateToCommits(repo: { owner: { login: string }; name: string }): void {
    this.#router.navigate(['/commits', repo.owner.login, repo.name]);
  }
}
