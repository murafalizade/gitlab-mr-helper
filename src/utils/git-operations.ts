import { exec } from 'child_process';

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
