import posthog from 'posthog-js';

export default {
	install(app) {
		if (import.meta.env.PROD) {
			app.config.globalProperties.$posthog = posthog.init('phc_3RZgYGMN8EMMONl8LkqTJBanN3xIMZAXoKSmiTIkHVC', {
				api_host: 'https://us.i.posthog.com',
			});
		}
	},
};
