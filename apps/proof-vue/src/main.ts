import { createApp } from 'vue';
import { registerRosettaDashElements } from '@rosettadash/web-components';
import '../../../packages/web-components/src/styles/styles.css';
import '../public/styles.css';
import { router } from './router';
import { provideConsumerSecrets } from './composables/use-consumer-secrets';

registerRosettaDashElements();

const app = createApp({ template: '<router-view />' });
provideConsumerSecrets(app);
app.use(router);
app.mount('#app');
