import { Command } from "commander";
import { setToken, setUrl, setBranches } from "./libs/config";
import {showMergeList} from "./commands/show-merge-list";
import {trackDiffBranch} from "./commands/track-diff-branch";
import {StateOptionType} from "./types/state-option.type";

const program = new Command();

program
    .name("gitlab-mr")
    .description("GitLab Merge Request Environment Tracker");

// Create `config` command
const configCommand = new Command("config").description("Manage CLI config");

// Subcommand: config set-token
configCommand
    .command("set-token")
    .argument("<token>", "Your GitLab API token")
    .action(setToken);

// Subcommand: config set-url
configCommand
    .command("set-url")
    .argument("<url>", "GitLab API base URL (default: https://gitlab.com/api/v4)")
    .action(setUrl);

// Subcommand: config set-branches
configCommand
    .command("set-branches")
    .argument("<projectId>", "Project ID")
    .argument("<branches...>", "Branch order: dev test master")
    .action(setBranches);

// Register `config` group to main program
program.addCommand(configCommand);

program
    .command('list')
    .description('List GitLab merge requests')
    .option('--all', 'List all merge requests (not just assigned)')
    .action(async (options:StateOptionType) => {
        await showMergeList(options);
    });


program
    .command('env-diff <target> [mrId]')
    .description('Show environment diff against a target branch. Optionally provide a Merge Request ID.')
    .action(async (target, mrId) => {
        await trackDiffBranch( target, mrId );
    });


program.parseAsync(process.argv).then(() => console.log("\nProcess completed."))
