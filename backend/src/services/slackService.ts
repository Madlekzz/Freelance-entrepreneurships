import { WebClient } from "@slack/web-api";

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

export async function findSlackIdByName(
	nombre: string,
): Promise<string | null> {
	const result = await slack.users.list();

	if (!result.members) return null;

	// Normaliza el nombre para comparación flexible
	const query = nombre.toLowerCase().trim();

	const match = result.members.find((user) => {
		if (user.is_bot || user.deleted) return false;

		const displayName = user.profile?.display_name?.toLowerCase() ?? "";
		const realName = user.profile?.real_name?.toLowerCase() ?? "";

		return displayName.includes(query) || realName.includes(query);
	});

	return match?.id ?? null;
}
