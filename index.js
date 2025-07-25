#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var config_ts_1 = require("./libs/config.ts");
// import { runReminderFlow } from "./lib/reminder.js";
// import { listMRs } from "./lib/list.js";
var program = new commander_1.Command();
program
    .name("gitlab-mr")
    .description("GitLab Merge Request Environment Tracker");
//
// CONFIG COMMAND
//
program
    .command("config")
    .description("Manage CLI config")
    .command("set-token")
    .argument("<token>", "Your GitLab API token")
    .action(config_ts_1.setToken);
program
    .command("config")
    .command("set-url")
    .argument("<url>", "GitLab API base URL (default: https://gitlab.com/api/v4)")
    .action(config_ts_1.setUrl);
program
    .command("config")
    .command("set-branches")
    .argument("<projectId>", "Project ID")
    .argument("<branches...>", "Branch order: dev test master")
    .action(config_ts_1.setBranches);
//
// LIST COMMAND
//
program
    .command("list")
    .description("List your merge requests")
    .option("--open", "List open MRs")
    .option("--merged", "List merged MRs")
    .option("--closed", "List closed MRs")
    .option("--all", "List all MRs");
// .action(async (opts) => {
//     const config = loadConfig();
//     await listMRs(config, opts);
// });
//
// SHOW ENV DIFF
//
program
    .command("show")
    .description("Show environment propagation")
    .command("env-diff")
    .option("--target <branch>", "Check against a specific target branch");
// .action(async (opts) => {
//     const config = loadConfig();
//     await runReminderFlow(config, opts.target);
// });
program.parseAsync(process.argv);
