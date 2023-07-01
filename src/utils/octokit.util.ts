import octokit from "@/config/octokit";
import { CreateIssueRequest } from "@/interfaces/requests.interface";

const createIssue = async (issue: CreateIssueRequest) => {
  const response = await octokit.request('POST /repos/IonHobbit/budgetr/issues', {
    owner: 'IonHobbit',
    repo: 'budgetr',
    assignees: [
      'IonHobbit'
    ],
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    },
    ...issue
  })

  return response;
}

export { createIssue }