import {StateOptionType} from "../types/state-option.type";
import {isCommitEffectivelyInBranch} from "../utils/git-operations";
import {GitServices} from "../utils/git-services";

export const trackDiffBranch = async (targetBranch: string, mrId?: string) => {
    const git = new GitServices();
    const mrs = await git.fetchMergeRequests(StateOptionType.MERGED);

    if(!mrs || mrs.length === 0) {
        console.log('No merge requests found.');
        return;
    }

    const targetMrList = mrId ? mrs.filter((mr: any) => String(mr.iid) === mrId) : mrs;

    const result: {
        id: string;
        title: string;
        exists: boolean;
    }[] = [];

    for (const mr of targetMrList) {
        const commits = await git.fetchMergeCommits(mr);
        const allCommitsExist = await Promise.all(
            commits.map((commit) => {
                return  isCommitEffectivelyInBranch(commit.id, targetBranch);
            })
        );

        result.push({
            id: mr.iid,
            title: mr.title,
            exists: allCommitsExist.every(Boolean),
        });
    }

    // Output result
    console.table(
        result.map((r) => ({
            'MR ID': `!${r.id}`,
            Title: r.title,
            'Exists on Target': r.exists ? '✅ Yes' : '❌ No',
        }))
    );
};
