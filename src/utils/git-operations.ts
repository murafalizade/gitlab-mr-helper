import { exec } from 'child_process';

/*
   * @deprecate
 */
export  function checkBranchMerged(targetBranch: string, sourceBranch: string): Promise<{ missing: string[], present: string[] }> {
    return new Promise((resolve, reject) => {
        exec(`git cherry ${targetBranch} ${sourceBranch}`, (error, stdout, stderr) => {
            if (error) {
                return reject(error);
            }

            const missing: string[] = [];
            const present: string[] = [];

            stdout.split('\n').forEach(line => {
                if (!line.trim()) return;

                const sign = line[0];
                const sha = line.slice(2);

                if (sign === '+') missing.push(sha);
                else if (sign === '-') present.push(sha);
            });

            resolve({ missing, present });
        });
    });
}

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
    } catch (e) {
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
    } catch (e) {
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
