import fs from "fs";
import path from "path";

const configPath = path.resolve(process.cwd(), ".gitlab-mrrc");

export interface GitlabMRConfig {
    apiToken: string;
    apiUrl: string;
    projects: Record<string, string[]>;
}

export function loadConfig(): GitlabMRConfig {
    if (!fs.existsSync(configPath)) {
        return { apiToken: "", apiUrl: "https://gitlab.com/api/v4", projects: {} };
    }
    return JSON.parse(fs.readFileSync(configPath, "utf-8"));
}

export function saveConfig(config: GitlabMRConfig) {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

export function setToken(token: string) {
    const config = loadConfig();
    config.apiToken = token;
    saveConfig(config);
    console.log("✅ Token set successfully.");
}

export function setUrl(url: string) {
    const config = loadConfig();
    config.apiUrl = url;
    saveConfig(config);
    console.log("✅ API URL set successfully.");
}

export function setBranches(projectId: string, branches: string[]) {
    const config = loadConfig();
    config.projects[projectId] = branches;
    saveConfig(config);
    console.log(`✅ Branch order set for project ${projectId}:`, branches.join(" → "));
}
