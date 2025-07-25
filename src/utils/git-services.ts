import axios from 'axios';
import {GitlabMRConfig, loadConfig} from "../libs/config.ts";
import {StateOptionType} from "../types/state-option.type.ts";

export class GitServices {
     config:GitlabMRConfig;
     headers = {};

     constructor() {
         this.config = loadConfig();
         if(!this.config.apiToken || !this.config.projects){
             throw new Error('No projects or API token configured');
         }

        this.headers = {
            'PRIVATE-TOKEN': this.config.apiToken,
        };
     }

     fetchUser = async (): Promise<any> => {
         const {  apiToken, apiUrl } = this.config;

         const userRes = await axios.get(`${apiUrl}/api/v4/user`, { headers:this.headers });
         return userRes.data;
     }

    fetchMergeRequests = async (state: StateOptionType = StateOptionType.ALL): Promise<any> => {
        const { projects, apiUrl } = this.config;
        let allMergeRequests = [];
        const user = await this.fetchUser();

        if(!user) {
            console.log('No Merge Requests Found');
            return;
        }

        for (const project of Object.keys(projects)) {
            const url = `${apiUrl}/api/v4/projects/${encodeURIComponent(project)}/merge_requests`;
            const params =
                state === StateOptionType.ALL
                    ? { author_id: user?.id } // still limit to assigned MRs
                    : { state, author_id: user?.id };
            const response = await axios.get<any[]>(url, { headers:this.headers, params });
            allMergeRequests.push(...response.data);
        }

        return allMergeRequests;
    }

    fetchMergeCommits = async (mr: any): Promise<any[]> => {
        const {apiUrl} = this.config;

        const url = `${apiUrl}/api/v4/projects/${encodeURIComponent(mr.project_id)}/merge_requests/${mr.iid}/commits`;
        const res = await axios.get<any[]>(url, { headers:this.headers });
        return res.data;
    };
}
