# Welcome to Percy Health

## About

Percy Health is an API under development seeking to streamline the process of collecting and maintaining Patient Reported Outcomes (PROs) through medical surveys. Currently, the API features two entities:

1. **Questionnaire data.** Each questionnaire is represented as one database object, which includes all it's questions, respones, and scoring instructions. These questionnaires are easily generated and customizable via an excel formatting system. See [this repository](https://github.com/percyhealth/csv-scripts) for more on creating surveys. These objects are designed to be easily rendered in various frontend user experiences.
2. **Response data.** Each time a survey is taken, the question-to-answer key/value pairs are recorded. With the values, we hope to develop a functionality that instantaneously calculates the user's score, depending on the scoring system provided with the questionnaire itself. Additionally, interested parties such as PCPs or other medical professionals should be able to replicate and review the survey along with the user's responses

Currently, there are also a **user** and **resource** entities in the repository. These came with the template and have not been thoroughly designed nor tested for use with this product. They may be useful in the development of future entities.

## Tech Stack
- React.js
- Express
- Jest
- MongoDB (see `.env` file for the connection string to manipulate this data via MongoDB Compass or login online via the Percy Health admin)

## Setup

1. Clone this repository into Visual Studio Code
2. Add the file `.env` in the root directory (contact an admin or contributor for this information)
3. Run `yarn` to install all packages
4. Run `yarn dev` to start the server

## Testing

1. Run `yarn test` to run test suites

### Contributors
- [Backend Template](https://github.com/dali-lab/crud-template-backend)
- [Laurel Dernbach](https://github.com/laureldernbach)

