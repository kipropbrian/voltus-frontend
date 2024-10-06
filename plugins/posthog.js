//./plugins/posthog.js
import posthog from 'posthog-js';

export default {
	install(app) {
		app.config.globalProperties.$posthog = posthog.init('phc_3RZgYGMN8EMMONl8LkqTJBanN3xIMZAXoKSmiTIkHVC', {
			api_host: 'https://us.i.posthog.com',
		});
	},
};
