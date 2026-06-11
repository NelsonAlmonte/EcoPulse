import { Injectable, signal } from '@angular/core';
import { Issue } from '@shared/models/issue.model';

@Injectable({
  providedIn: 'root',
})
export class OfflineService {
  issues = signal<Issue[]>([]);

  constructor() {
    this.getOfflineIssues();
  }

  saveOfflineIssue(issue: Issue): void {
    const issues: Issue[] = JSON.parse(localStorage.getItem('issues') ?? '[]');

    issues.push(issue);

    localStorage.setItem('issues', JSON.stringify(issues));

    this.issues.set(issues);
  }

  getOfflineIssues(): Issue[] {
    const issues = JSON.parse(localStorage.getItem('issues') ?? '[]');

    this.issues.set(issues);

    return issues;
  }

  removeOfflineIssue(id: string): void {
    const issues = this.getOfflineIssues().filter((issue) => issue.id !== id);

    localStorage.setItem('issues', JSON.stringify(issues));

    this.issues.set(issues);
  }
}
