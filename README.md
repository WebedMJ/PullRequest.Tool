# PullRequest.Tool

PullRequest.Tool provides two UI tools for Azure DevOps pull request reporting:

1. Azure Automation Tool (web page)
2. Azure Pull Requests (browser extension popup)

## Current Functionality

### Run Azure Automation Tool

The automation page supports:

1. Pull request retrieval from Azure DevOps repository APIs.
2. Configurable `Start Date` filter (fetch PRs from a user-selected date onward).
3. Pagination across PR results (not limited to first 1000 results).
4. Status and branch filtering.
5. `Approvers` column (reviewers with vote >= 5).
6. Linked work item display for selected PRs.
7. CSV export (includes PR URL and approvers).
8. Responsive split-pane results layout.

### Run Azure Pull Requests Extension

The extension popup supports:

1. Pull request retrieval and table view.
2. PR link rendering and commit ID display.
3. Approvers column (if implemented in popup branch/version).
4. MV3 manifest configuration.

## How To Run

### Azure Automation Tool

1. Open `Azure Automation Tool/index.html` in a browser.
2. Enter `Organization`, `Project`, `Repository`, `PAT`, and optional `Branch`.
3. Select `PR Status` and optionally choose `Start Date`.
4. Click `Fetch Pull Requests`.
5. Select a row to view PR details, reviewers, and linked work items.
6. Click `Export` to download CSV.

### Azure Pull Requests Extension

1. Load `Azure Pull Requests` as an unpacked extension in Chromium-based browser extension settings.
2. Open the extension popup.
3. Enter organization/project/repository/branch/PAT.
4. Fetch and optionally export.

## PAT Requirements

Use a Personal Access Token (PAT) with minimum required scopes:

1. `Code (Read)` (`vso.code`): Required to list pull requests, reviewers, and PR-linked work item references.
2. `Work Items (Read)` (`vso.work`): Required to resolve linked work item details (title/state/type) via WIT APIs.

If `Work Items (Read)` is missing:

1. PRs still load.
2. Linked work item references may be found.
3. Detailed work item metadata may not be returned.

## Notes

1. PAT must belong to an identity with access to the target org/project/repository.
2. For security, keep PAT scopes minimal and rotate PATs regularly.
3. Use HTTPS Azure DevOps URLs only.
