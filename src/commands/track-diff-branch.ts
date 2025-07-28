import { StateOptionType } from "../types/state-option.type";
import { GitServices } from "../utils/git-services";

export const trackDiffBranch = async (targetBranch: string, mrId?: string, fileFilter?: string) => {
    const git = new GitServices();
    const mrs = await git.fetchMergeRequests(StateOptionType.MERGED);

    if (!mrs || mrs.length === 0) {
        console.log("No merge requests found.");
        return;
    }

    const targetMrList = mrId ? mrs.filter((mr: any) => String(mr.iid) === mrId) : mrs;

    const result: {
        id: string;
        title: string;
        hasDiff: boolean;
    }[] = [];

    for (const mr of targetMrList) {
        const sourceBranch = mr.source_branch;
        const compareData = await git.compareBranches(targetBranch, sourceBranch);

        let hasDiff = false;

        if (compareData && compareData.diffs) {
            if (fileFilter) {
                hasDiff = compareData.diffs.some((diff: any) => diff.new_path === fileFilter || diff.old_path === fileFilter);
            } else {
                hasDiff = compareData.diffs.length > 0;
            }
        }

        result.push({
            id: mr.iid,
            title: mr.title,
            hasDiff,
        });
    }

    console.table(
        result.map((r) => ({
            'MR ID': `!${r.id}`,
            Title: r.title,
            'Has Diff in Target': r.hasDiff ? "🔍 Yes" : "✅ No Diff",
        }))
    );
};
