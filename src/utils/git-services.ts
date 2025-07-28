import axios from 'axios';
import {GitlabMRConfig, loadConfig} from "../libs/config";
import {StateOptionType} from "../types/state-option.type";
import {MergeRequest} from "../types/merge-request.type";

export class GitServices {
     config:GitlabMRConfig;
     headers = {};

     constructor() {
         this.config = loadConfig();
         if(!this.config.apiToken || !this.config.projectId){
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

    fetchMergeRequests = async (state: StateOptionType = StateOptionType.ALL): Promise<Array<MergeRequest> | undefined> => {
        const { projectId, apiUrl } = this.config;
        const user = await this.fetchUser();

        if(!user) {
            console.log('No Merge Requests Found');
            return;
        }

            const url = `${apiUrl}/api/v4/projects/${encodeURIComponent(projectId)}/merge_requests`;
            const params =
                state === StateOptionType.ALL
                    ? { author_id: user?.id } // still limit to assigned MRs
                    : { state, author_id: user?.id };
            const response = await axios.get<MergeRequest[]>(url, { headers:this.headers, params });
        return response.data;
    }

    async compareBranches(from: string, to: string) {
        const { projectId, apiUrl } = this.config;
        const url = `${apiUrl}/api/v4/projects/${encodeURIComponent(projectId)}/repository/compare?from=${from}&to=${to}`;
        const response = await axios.get(url, {
            headers: this.headers,
        });
        return response.data;
    }
}
