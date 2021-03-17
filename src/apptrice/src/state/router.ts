import routes from './routes';

const urlhub = require('urlhub');
const hashStrategy = require('urlhub/hashStrategy');


const router = urlhub.create({strategy: hashStrategy});
router.setRoutes( routes );
router.start();

export default router;