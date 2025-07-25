import { execSync } from 'child_process';

/**
 * Get patch ID for a commit
 */
const getPatchId = (commitSha: string): string | null => {
    try {
        const patch = execSync(`git show ${commitSha} | git patch-id --stable`, {
            encoding: 'utf8',
        });
        return patch.trim().split(' ')[0]; // format: "<patch-id> <commit-sha>"
    } catch (e:any) {
        console.warn(`Failed to get patch-id for ${commitSha}: ${e.message}`);
        return null;
    }
};

/**
 * Get all patch-ids from target branch (limited to last 500 commits)
 */
const getPatchIdsFromBranch = (branch: string): string[] => {
    try {
        const script = `
      git log ${branch} -n 500 -p | git patch-id --stable
    `;
        const output = execSync(script, { shell: '/bin/bash', encoding: 'utf8' });
        return output
            .split('\n')
            .map((line) => line.trim().split(' ')[0])
            .filter((line) => !!line);
    } catch (e:any) {
        console.warn(`Failed to get patch-ids from ${branch}: ${e.message}`);
        return [];
    }
};

/**
 * Check if commit patch-id exists in the branch
 */
export const isCommitEffectivelyInBranch = (commitSha: string, branch: string): boolean => {
    const targetPatchIds = getPatchIdsFromBranch(branch);
    const commitPatchId = getPatchId(commitSha);

    return commitPatchId !== null && targetPatchIds.includes(commitPatchId);
};
