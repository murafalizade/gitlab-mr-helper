import {StateOptionType} from "../types/state-option.type.ts";
import {isCommitEffectivelyInBranch} from "../utils/git-operations.ts";
import {GitServices} from "../utils/git-services.ts";

export const trackDiffBranch = async (targetBranch: string, mrId?: string) => {
    const git = new GitServices();
    const mrs = await git.fetchMergeRequests(StateOptionType.MERGED);
    const targetMrList = mrId ? mrs.filter((mr) => String(mr.iid) === mrId) : mrs;

    const result: {
        id: number;
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
