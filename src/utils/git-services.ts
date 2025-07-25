import axios from 'axios';
import {loadConfig} from "../libs/config.ts";
import {StateOptionType} from "../types/state-option.type.ts";

export class GitServices {
     config = loadConfig();

    fetchMergeRequests = async (state: StateOptionType = StateOptionType.ALL): Promise<any> => {
        const { projects, apiToken, apiUrl } = this.config;

        if (!projects || !apiToken) {
            throw new Error('No projects or API token configured');
        }

        const headers = {
            'PRIVATE-TOKEN': apiToken
        };
        let allMergeRequests = [];
        for (const project of Object.keys(projects)) {
            const url = `${apiUrl}/api/v4/projects/${encodeURIComponent(project)}/merge_requests`;
            const params = state === StateOptionType.ALL ? {} : { state };

            const response = await axios.get<any[]>(url, { headers, params });
            allMergeRequests.push(...response.data);
        }

        return allMergeRequests;
    }

    fetchMergeCommits = async (mr: any): Promise<any[]> => {
        const { apiToken, apiUrl} = this.config;
        const headers = { 'PRIVATE-TOKEN': apiToken };

        const url = `${apiUrl}/api/v4/projects/${encodeURIComponent(mr.project_id)}/merge_requests/${mr.iid}/commits`;
        const res = await axios.get<any[]>(url, { headers });
        return res.data;
    };
}
