# PullRequest.Tool

PullRequest.Tool provides a UI tool for Azure DevOps pull request reporting

## Current Functionality

The tool supports:

1. Pull request retrieval from Azure DevOps repository APIs.
2. Configurable `Start Date` filter (fetch PRs from a user-selected date onward).
3. Status and branch filtering.
4. `Approvers` column (reviewers with vote >= 5).
5. Linked work item display for selected PRs.
6. CSV export (includes PR URL and approvers).

## How To Run

1. Open `Azure Automation Tool/index.html` in a browser.
2. Enter `Organization`, `Project`, `Repository`, `PAT`, and optional `Branch`.
3. Select `PR Status` and optionally choose `Start Date`.
4. Click `Fetch Pull Requests`.
5. Select a row to view PR details, reviewers, and linked work items.
6. Click `Export` to download CSV.

## PAT Requirements

Use a Personal Access Token (PAT) with minimum required scopes:

1. `Code (Read)` (`vso.code`): Required to list pull requests, reviewers, and PR-linked work item references.
2. `Work Items (Read)` (`vso.work`): Required to resolve linked work item details (title/state/type) via WIT APIs.

## Notes

1. PAT must belong to an identity with access to the target org/project/repository.
2. For security, keep PAT scopes minimal and rotate PATs regularly.
3. Use HTTPS Azure DevOps URLs only.
