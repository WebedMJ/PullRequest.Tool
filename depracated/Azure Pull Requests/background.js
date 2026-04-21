async function getPullRequests() {
  const organization = document.getElementById("organization").value;
  const project = document.getElementById("project").value;
  const repository = document.getElementById("repository").value;
  const branch = document.getElementById("branch").value;
  const pat = document.getElementById("pat").value;

  const organizationValue = String(organization || "").trim();
  const authHeader = `Basic ${btoa(`:${pat}`)}`;

  function isAllowedAzureDevOpsUrl(urlString) {
    try {
      const parsed = new URL(urlString);
      if (parsed.protocol !== "https:" || parsed.hostname !== "dev.azure.com") {
        return false;
      }
      const normalizedPath = parsed.pathname.toLowerCase();
      const normalizedOrg = `/${organizationValue.toLowerCase()}/`;
      return organizationValue && normalizedPath.startsWith(normalizedOrg);
    } catch {
      return false;
    }
  }

  // Build date filter: 12 months ago from today
  const minTime = new Date();
  minTime.setMonth(minTime.getMonth() - 12);
  const minTimeISO = minTime.toISOString();

  // Paginate through all results in pages of 100
  const PAGE_SIZE = 100;
  let skip = 0;
  let allPullRequests = [];

  try {
    while (true) {
      const baseUrl =
        `https://dev.azure.com/${organization}/${project}/_apis/git/repositories/${repository}/pullrequests` +
        `?searchCriteria.status=Completed` +
        `&searchCriteria.targetRefName=refs/heads/${branch}` +
        `&searchCriteria.minTime=${encodeURIComponent(minTimeISO)}` +
        `&$top=${PAGE_SIZE}` +
        `&$skip=${skip}` +
        `&api-version=7.0`;

      const response = await fetch(baseUrl, {
        headers: { Authorization: authHeader },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const page = data.value || [];
      allPullRequests = allPullRequests.concat(page);

      if (page.length < PAGE_SIZE) {
        break; // last page reached
      }
      skip += PAGE_SIZE;
    }
  } catch (error) {
    console.log("something went wrong", error);
    return;
  }

  const pullRequestsTable = document.getElementById("pull-requests").getElementsByTagName("tbody")[0];

  // clearing table body
  pullRequestsTable.innerHTML = "";

  allPullRequests.forEach((pullRequest, index) => {
    const row = pullRequestsTable.insertRow();
    const serialCell = row.insertCell();
    const titleCell = row.insertCell();
    const authorCell = row.insertCell();
    const createdCell = row.insertCell();
    const completedCell = row.insertCell();
    const statusCell = row.insertCell();
    const PRCell = row.insertCell();
    const commitCell = row.insertCell();
    const approversCell = row.insertCell();

    serialCell.textContent = String(index + 1);
    titleCell.textContent = String(pullRequest.title || "");
    authorCell.textContent = String(pullRequest.createdBy?.displayName || "Unknown");
    createdCell.textContent = new Date(pullRequest.creationDate).toLocaleDateString();
    completedCell.textContent = new Date(pullRequest.closedDate).toLocaleDateString();
    statusCell.textContent = String(pullRequest.status || "");

    const prUrl = `https://dev.azure.com/${organization}/${project}/_git/${repository}/pullrequest/${pullRequest.pullRequestId}`;
    if (isAllowedAzureDevOpsUrl(prUrl)) {
      const prLink = document.createElement("a");
      prLink.href = prUrl;
      prLink.target = "_blank";
      prLink.rel = "noopener noreferrer";
      prLink.textContent = String(pullRequest.pullRequestId || "");
      PRCell.appendChild(prLink);
    } else {
      PRCell.textContent = String(pullRequest.pullRequestId || "");
    }

    commitCell.textContent = String(pullRequest.lastMergeSourceCommit?.commitId || "");

    // Approvers: reviewers with vote >= 5 (approved with suggestions) or 10 (approved)
    const approvers = (pullRequest.reviewers || [])
      .filter((r) => r.vote >= 5)
      .map((r) => String(r.displayName || ""))
      .filter(Boolean);
    approversCell.textContent = approvers.join(", ");
  });

  document.getElementById("tablediv").style.display = "block";

  // showing table after fetching pull requests
  document.getElementById("pull-requests").style.display = "block";

  //enabling export button after data fetching
  enableExportButton();
}

function tabelToExcel() {
  var confirmDownload = confirm("Do you want to download the Pull Request data as an Excel file?");
  if (confirmDownload) {
    var table2excel = new Table2Excel();
    table2excel.export(document.querySelectorAll("table"));
  } else {
    alert("Downloading Data is Cancelled 🤨.");
  }
}

//Export button disabled script

function enableExportButton() {
  document.getElementById("exportButton2").removeAttribute("disabled");
}

//Table filter with Jquery plugin
$(document).ready(function () {
  $("#myInput").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#myTable tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
});
