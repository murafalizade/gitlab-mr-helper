import {StateOptionType} from "../types/state-option.type.ts";
import {GitServices} from "../utils/git-services.ts";

export const showMergeList = async (state: StateOptionType)  => {
    try {
        const git = new GitServices();
        const mrs = await git.fetchMergeRequests(state);

        if (mrs.length === 0) {
            console.log('No merge requests found.');
            return;
        }

        console.log(`[Merge Requests: ${state.toUpperCase()}]`);

        console.log(JSON.stringify(mrs));
    } catch (err) {
        console.error('Failed to load merge requests:', err.message || err);
    }
};

