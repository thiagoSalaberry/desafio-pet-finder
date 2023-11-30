import algoliasearch from "algoliasearch";
import "dotenv/config";
const ALGOLIA_APP_ID:string = process.env.ALGOLIA_APP_ID;
const ALGOLIA_KEY:string = process.env.ALGOLIA_KEY;
const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_KEY);

const petIndex = client.initIndex('pets');

export {petIndex};