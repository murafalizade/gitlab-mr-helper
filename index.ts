import { Command } from "commander";
import { setToken, setUrl, setBranches } from "./libs/config.ts";
import {showMergeList} from "./commands/showMergeList.ts";
import {writer} from "./utils/writer.ts";
import {trackRequestBranch} from "./commands/trackRequestBranch.ts";

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
    .action((options:string) => {
        showMergeList(options);
    });

const show = new Command('show')
    .description('Show details from GitLab');

show
    .command('env-diff <target> [mrId]')
    .description('Show environment diff against a target branch. Optionally provide a Merge Request ID.')
    .action((target, mrId) => {
        trackRequestBranch( target, mrId );
    });

program.addCommand(show);

program.parseAsync(process.argv).then(() => console.log("Initialization complete."))
