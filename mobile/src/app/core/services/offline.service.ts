import { Injectable } from '@angular/core';
import { CreateIssueDto, OfflineIssue } from '@shared/dto/issue.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class OfflineService {
  saveOfflineIssue(issue: CreateIssueDto): void {
    const issues: OfflineIssue[] = JSON.parse(
      localStorage.getItem('issues') ?? '[]'
    );

    issues.push({
      localId: uuidv4(),
      issue,
    });

    localStorage.setItem('issues', JSON.stringify(issues));
  }

  getOfflineIssues(): OfflineIssue[] {
    return JSON.parse(localStorage.getItem('issues') ?? '[]');
  }

  removeOfflineIssue(localId: string): void {
    const issues = this.getOfflineIssues().filter(
      (issue) => issue.localId !== localId
    );

    localStorage.setItem('issues', JSON.stringify(issues));
  }
}
