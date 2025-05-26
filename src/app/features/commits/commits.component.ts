import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GithubService } from '../../core/services/github.service';
import { DatePipe, NgIf } from '@angular/common';
import { switchMap, catchError, of, startWith, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClientModule } from '@angular/common/http';
import { sortArray } from '../../core/utils/sort.util';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-commits',
  standalone: true,
  imports: [RouterModule, HttpClientModule, DatePipe, NgIf, ReactiveFormsModule],
  templateUrl: './commits.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommitsComponent {
  #route = inject(ActivatedRoute);
  #github = inject(GithubService);
  #router = inject(Router);
  readonly isLoading = signal(true);

  readonly searchControl = new FormControl('');
  readonly sortField = signal<'author' | 'date'>('date');
  readonly sortDirection = signal<'asc' | 'desc'>('desc');

  readonly commits = toSignal(
    this.#route.params.pipe(
      tap(() => this.isLoading.set(true)),
      switchMap(({ owner, repo }) =>
        this.#github.getCommits(owner, repo).pipe(
          tap(() => this.isLoading.set(false)),
          catchError(() => {
            this.isLoading.set(false);
            return of([]);
          })
        )
      )
    )
  );
  readonly search = toSignal(
    this.searchControl.valueChanges.pipe(startWith(this.searchControl.value ?? '')),
    { initialValue: '' }
  );

  sortBy(field: 'author' | 'date') {
    if (this.sortField() === field) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortDirection.set('asc');
    }
  }

  readonly filteredCommits = computed(() => {
    const query = (this.search() ?? '').toLowerCase().trim();
    const list = this.commits() || [];

    const filtered = query
      ? list.filter(
          (c) =>
            (c.commit?.author?.name?.toLowerCase() || '').includes(query) ||
            (c.commit?.message?.toLowerCase() || '').includes(query)
        )
      : list;

    return sortArray(filtered, this.sortField(), this.sortDirection(), (c, field) => {
      if (field === 'author') return c.commit?.author?.name?.toLowerCase() || '';
      if (field === 'date') return new Date(c.commit?.author?.date).getTime();
      return '';
    });
  });

  goBack() {
    this.#router.navigate(['/repos']);
  }
}
