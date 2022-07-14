# Router Testing Overview

## Basic CRUD Cases

The following cases are the basic cases that **any** CRUD (create, read, update, delete) backend application should satisfy. This template outlines the tests for three major routers:

1) Authentication router: controls access to app resources via token generation and validation

2) Resource router: a partially auth-protected generic router with CRUD operations (to be replaced with other project-specific collections)

3) User router: manages user objects, intended for use in admin panels and profile pages

Below is a key for how to interpret the following cases.

### Key

* `!` - Don't check for these cases
* `?` - May or may not be required

### Cases

```javascript
/**
 * FETCH ONE
 * ? permissions (401 / 403)
 * resource doesn't exist (404)
 * ! failed to fetch (500)
 * success (200)
 */

/**
 * CREATE ONE
 * ? permissions (401 / 403)
 * data is invalid (incorrect POST, invalid data) (400)
 * ? resource already exists (if unique fields) (409)
 * ! failed to create (500)
 * success (201)
 */

/**
 * UPDATE ONE
 * ? permissions (401 / 403)
 * data is invalid (incorrect POST, invalid data) (400)
 * ? resource already exists (if unique field updated) (409)
 * resource doesn't exist (404)
 * ! failed to update (500)
 * success (200)
 */

/**
 * DELETE ONE
 * ? permissions (401 / 403)
 * resource doesn't exist (404)
 * ! failed to delete (500)
 * success (200)
 */

/**
 * FETCH MULTIPLE
 * ? permissions (401 / 403)
 * ? valid pagination (400)
 * couldn't find one or more resources (404)
 * ! failed to fetch (500)
 * success (200)
 */

/**
 * CREATE MULTIPLE
 * ? permissions (401 / 403)
 * data is invalid (incorrect POST, invalid data) (400)
 * ? one or more resources already exist (if unique fields) (409)
 * ! failed to create (500)
 * success (201)
 */

/**
 * UPDATE MULTIPLE
 * ? permissions (401 / 403)
 * data is invalid (incorrect POST, invalid data) (400)
 * ? one or more resources already exist (if unique field updated) (409)
 * one or more resources don't exist (404)
 * ! failed to update (500)
 * success (200)
 */

/**
 * DELETE MULTIPLE
 * ? permissions (401 / 403)
 * one or more resources don't exist (404)
 * ! failed to delete (500)
 * success (200)
 */
```
