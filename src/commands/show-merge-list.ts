import { table } from 'table';
import {StateOptionType} from "../types/state-option.type";
import {GitServices} from "../utils/git-services";

export const showMergeList = async (state: StateOptionType) => {
    try {
        const git = new GitServices();
        const mrs = await git.fetchMergeRequests(state);

        if (!mrs || mrs.length === 0) {
            console.log('No merge requests found.');
            return;
        }

        console.log('[Merge Requests]');

        const data = [
            ['MR ID', 'Title', 'State', 'Draft', 'Created At'],
            ...mrs.map((mr) => [
                `!${mr.iid}`,
                mr.title,
                mr.state,
                mr.draft ? 'true' : 'false',
                mr.created_at.slice(0, 10), // yyyy-mm-dd
            ]),
        ];

        console.log(table(data));
    } catch (err: any) {
        console.error('Failed to load merge requests:', err.message || err);
    }
};
