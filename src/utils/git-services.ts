import axios from 'axios';
import {loadConfig} from "../libs/config.ts";
import {StateOptionType} from "../types/state-option.type.ts";

export class GitServices {
     config = loadConfig();

    fetchMergeRequests = async (state: StateOptionType = StateOptionType.ALL): Promise<void> => {
        const { projects, apiToken, apiUrl } = config;

        if (!projects || !apiToken) {
            throw new Error('No projects or API token configured');
        }

        const headers = {
            'PRIVATE-TOKEN': apiToken
        };

        for (const project of Object.keys(projects)) {
            const url = `${apiUrl}/api/v4/projects/${encodeURIComponent(project)}/merge_requests`;
            const params = state === StateOptionType.ALL ? {} : { state };

            const response = await axios.get<MergeRequest[]>(url, { headers, params });
            allMergeRequests.push(...response.data);
        }

        return allMergeRequests;
    }

    fetchMergeCommits = async (mr: MergeRequest): Promise<MergeCommit[]> => {
        const { apiToken, apiUrl} = config;
        const headers = { 'PRIVATE-TOKEN': apiToken };

        const url = `${apiUrl}/api/v4/projects/${encodeURIComponent(mr.project_id)}/merge_requests/${mr.iid}/commits`;
        const res = await axios.get<MergeCommit[]>(url, { headers });
        return res.data;
    };
}
