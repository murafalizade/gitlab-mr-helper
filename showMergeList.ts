import {loadConfig} from "../libs/config.ts";
import {MergeRequest} from "../models/MergeRequest.ts";

export const showMergeList= (state: string)  => {
    const config = loadConfig();

    if(!config.projects|| !config.apiToken){
        console.error("No projects configured");
        throw new Error("No projects configured");
    }

    // Filter merge request based on state
    console.log('[ALL MRs]');
    console.log('- !123 Fix login issue: MERGED');
    console.log('- !124 Add unit tests: CLOSED');
};

