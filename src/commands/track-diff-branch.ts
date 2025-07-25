import {loadConfig} from "../libs/config.ts";

export const trackDiffBranch = (target: string, mrId: string) => {
    const config = loadConfig();

    if(!config.projects|| !config.apiToken){
        console.error("No projects configured");
        throw new Error("No projects configured");
    }

    Object.entries(config.projects).forEach(([projectName, branches]) => {
        console.log(`📁 Project: ${projectName}`);

        // Generate 3 fake commits per project
        const fakeCommits = [
            '!123 Fix login issue',
            '!124 Add new dashboard',
            '!125 Cleanup styles'
        ];

        const data = fakeCommits.map((commit, i) => {
            const row: Record<string, string> = {commit};

            // For each branch in the config, randomly assign ✅ or ❌
            branches.forEach(branch => {
                row[branch] = Math.random() > 0.5 ? '✅' : '❌';
            });

            return row;
        });

        console.table(data);
    });
};
