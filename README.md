# omie-harbor
A serveless application for ingestion and parsing data from Omie ERP and deliver it through a REST API

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![CI](https://github.com/ikaromarlon/omie-harbor/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/ikaromarlon/omie-harbor/actions/workflows/main.yml)

Omie Harbor is a service for ingestion and processing data consumed from [Omie ERP](https://developer.omie.com.br/). It processes data from Omie, map and stores into a new database an then exports data to a JSON file stored in AWS S3 Bucket. 

<!-- Put your application diagram bellow -->
<!-- ![](docs/image.png) -->

### Main Services:
- **registerCompany**
  Register into database an existing company on Omie ERP using it's credentials.
- **ingestionDispatcher**
  A cron job triggered service that runs automatically to import data from Omie ERP every day and send to a queue to be processed by ```ingestionPerformer``` service.
- **ingestionPerformer**
  A service to process all data imported from Omie ERP.
- **dataExport**
  Exports data from database to a JSON file stored into S3.

### Other Services
- **omieWebhook**
  Receive deletion events from Omie ERP and make updates on database
- **deleteDataByCompany**
  Delete all data for a company on the database.

### Tech Stack
1. [NodeJS v18](https://nodejs.org/dist/latest-v18.x/docs/api/)
2. [MongoDB](https://www.mongodb.com/docs/)
3. [Serverless](https://www.serverless.com/framework/docs/)
4. [AWS Lambda](https://docs.aws.amazon.com/lambda/index.html) + [AWS API Gateway](https://docs.aws.amazon.com/apigateway/index.html)
5. [AWS S3](https://docs.aws.amazon.com/s3/index.html)
6. [AWS EventBridge](https://docs.aws.amazon.com/eventbridge/index.html)
7. [AWS SQS](https://docs.aws.amazon.com/sqs/index.html)
8. [AWS SES](https://docs.aws.amazon.com/ses/index.html)


### Environment Variables
```bash
STAGE="dev" # dev | prd
MONGODB_URI="mongodb+srv://..." # your mongodb connection uri
```
### Run Application locally

Make sure that your environment has:
- [AWS CLI](https://aws.amazon.com/cli/) installed
- AWS Credentials configured
- Serverless Framework installed globally
- ```.env``` or ```.env.dev``` file containing the environment variables described as above

and then run:

```bash
npm start 
```

NOTE: To debug the application use VS Code Debugger

### Setup a new DB

If you are using a new MongoDB database you should setup indexes. You can do this by runing:

```bash
npm run bin:dev # for development environment
```
or
```bash
npm run bin:prd # for production environment
```

### Deploy the application

For Development environment:

```bash
npm run deploy:dev
```

For Production environment:

```bash
npm run deploy:prd
```

### Run Tests

Run unit/integration tests using Jest:

```bash
npm test
```
