
export async function runReminderFlow(token: string, branchOrder: string[]) {
    const apiUrl = "https://gitlab.com/api/v4";

    const currentUser = await fetch(`${apiUrl}/user`, {
        headers: { "PRIVATE-TOKEN": token },
    }).then((res) => res.json());

    const mrs = await fetch(`${apiUrl}/merge_requests?state=opened&author_username=${currentUser.username}`, {
        headers: { "PRIVATE-TOKEN": token },
    }).then((res) => res.json());

    const finalBranch = branchOrder[branchOrder.length - 1];

    for (const mr of mrs) {
        if (mr.target_branch === finalBranch) continue;

        const projectId = mr.project_id;
        const mrCommits = await fetch(`${apiUrl}/projects/${projectId}/merge_requests/${mr.iid}/commits`, {
            headers: { "PRIVATE-TOKEN": token },
        }).then((res) => res.json());

        const mrSHAs = mrCommits.map((c: any) => c.id);

        const finalBranchCommits = await fetch(`${apiUrl}/projects/${projectId}/repository/commits?ref_name=${finalBranch}&per_page=100`, {
            headers: { "PRIVATE-TOKEN": token },
        }).then((res) => res.json());

        const masterSHAs = finalBranchCommits.map((c: any) => c.id);

        const allInMaster = mrSHAs.every((sha: string) => masterSHAs.includes(sha));

        if (!allInMaster) {
            console.log(`⚠️ MR #${mr.iid} "${mr.title}" not yet merged to ${finalBranch}:`);
            console.log(`   ${mr.web_url}`);
        }
    }

    console.log("✅ Done");
}
