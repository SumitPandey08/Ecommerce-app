import { Client } from '@elastic/elasticsearch';

const elasticsearchClient = new Client({ node: 'http://localhost:9200' });

elasticsearchClient.info()
  .then(response => console.log('Elasticsearch client connected:', response))
  .catch(error => console.error('Elasticsearch client connection error:', error));

export default elasticsearchClient;