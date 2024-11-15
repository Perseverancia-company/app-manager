import { Models } from "felixriddle.ts-app-models";

/**
 * App output
 */
export default interface AppOutput {
	id: number;
	appName: string;
	output: string;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Delete all processes output
 */
export function deleteAllProcessesOutput(models: Models) {
	const { AppOutput } = models;

	return new Promise((resolve, reject) => {
		AppOutput.destroy({
			where: {},
			truncate: true,
		})
			.then(() => {
				resolve(true);
			})
			.catch((err: any) => {
				reject(err);
			});
	});
}
