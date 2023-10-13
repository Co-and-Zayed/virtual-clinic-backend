/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use("test");

// Create a TTL index in the collection on the "expire_at" field.
db.getCollection("refreshtokens").createIndex(
  {
    expire_at: 1, // Specify the "expire_at" field and the 1 indicates ascending order.
  },
  {
    expireAfterSeconds: 86400, // Set the expiration time to 86400 seconds (1 day).
  }
);
