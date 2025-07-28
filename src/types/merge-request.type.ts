import {StateOptionType} from "./state-option.type";

export interface MergeRequest {
    id: string;
    iid: string;
    project_id: string;
    title: string;
    state: StateOptionType;
    created_at: string;
    sha: string;
    merge_commit_sha: string;
    draft: boolean;
    source_branch: string;
    target_branch: string;
}
