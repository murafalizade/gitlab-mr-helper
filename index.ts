import { Command } from "commander";
import { setToken, setUrl, setBranches } from "./libs/config.ts";

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

// Other commands (list, show) can go here...
program.addCommand(new Command("list").description("List all merge requests"));

program.parseAsync(process.argv).then(() => console.log("Initialization complete."))
