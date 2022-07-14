# Validation Overview

Although TypeScript does provide a lot of type safety, it is still vulnerable when handling IO. In this context, it is usually HTTP requests and responses, but it can arise in other situations. Therefore, it is helpful to verify the schema of variables before working with them.

## joi and express-joi-validation

In this template, the validation library [`joi`](https://joi.dev) is used. Documentation for this library is found [here](https://joi.dev/api/). The important thing to this library is how to build object schemas that would correspond to the body/query of an HTTP request.

In order to cleanly incorporate `joi` into the `Express` application, the library [`express-joi-validation`](https://www.npmjs.com/package/express-joi-validation) is used. This library takes schemas defined with `joi` and converts them into *middleware* functions to be placed within `Express` routes, and it provides functionality to create *types* for the validated HTTP requests.

## Usage

This directory, `src/validation` is dedicated to the creation of validation schemas and types.

To create validation for an HTTP request:

1. Create a schema with `joi` to describe how you want the request body/query to be shaped.
2. If not done already, create a validator in your `router` file with `createValidator` from the `express-joi-validation` library. Make sure `passError` is set to `true`.
3. Put the validator in the route of interest as a middleware function. This is done using the method `.body()` or `.query()`, where the `joi` schema is passed in.

If any of this is unclear, please follow the existing examples and/or look at the documentation for each library.