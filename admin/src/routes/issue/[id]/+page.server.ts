import { PUBLIC_API_URL } from '$env/static/public';
import type { Issue } from '$lib/models/issue.model';
import type { InfoItem } from '$lib/types/information.type';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const response = await fetch(`${PUBLIC_API_URL}issue/${params.id}/1`);
	const issue = (await response.json()) as Issue;
	const issueInfoItems = generateIssueInfoItems(issue);

	return { issue, issueInfoItems };
};

function generateIssueInfoItems(issue: Issue): InfoItem[] {
	return [
		{
			label: 'Tipo de incidencia',
			value: issue.category.name,
			icon: 'CircleDot'
		},
		{
			label: 'Estado',
			value: issue.status.toLocaleLowerCase(),
			icon: 'CircleDot'
		},
		{
			label: 'Reportado por',
			value: `${issue.user.name} ${issue.user.last}`,
			icon: 'User'
		},
		{
			label: 'Fecha',
			value: new Date(issue.createdAt).toLocaleDateString('es-ES', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric'
			}),
			icon: 'Calendar'
		},
		{
			label: 'Resaltes',
			value: issue.highlights,
			icon: 'Star'
		},
		{
			label: 'Comentario',
			value: issue.comment,
			icon: 'Star'
		}
	];
}
