import { Octokit } from "octokit";

const octokit = new Octokit({ auth: process.env.NEXT_PUBLIC_OCTO_TOKEN })

export default octokit