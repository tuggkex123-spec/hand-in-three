import assert from "assert";
import http from "http";


// ─── Helper ───────────────────────────────────────────────────────────────────
function request(method, path, formData = null) {
  return new Promise((resolve, reject) => {
    const body = formData
      ? Object.entries(formData)
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
          .join("&")
      : null;

    const options = {
      hostname: "localhost",
      port: 3000,
      path,
      method,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...(body ? { "Content-Length": Buffer.byteLength(body) } : {}),
      },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });

    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

// ─── Tests ────────────────────────────────────────────────────────────────────

// POST /users — creates data, has validation, can fail in multiple ways
const res1 = await request("POST", "/users", { slug: "peter-pan", user_name: "PeterPan", age: "14" });
assert.ok(res1.body.includes("User Created"), "Should confirm user was created");

// POST /users — fails when required fields are missing
const res2 = await request("POST", "/users", { user_name: "NoSlug" });
assert.ok(res2.body.includes("Error"), "Should return an error when fields are missing");

// GET /users/:slug — finds an existing user
const res3 = await request("GET", "/users/peter-pan");
assert.strictEqual(res3.status, 200, "Should return 200 for existing user");

// GET /users/:slug — returns 404 for a user that does not exist
const res4 = await request("GET", "/users/this-does-not-exist");
assert.strictEqual(res4.status, 404, "Should return 404 for missing user");

// POST /users/:slug — updates an existing user and redirects
const res5 = await request("POST", "/users/peter-pan", { slug: "peter-pan", user_name: "PeterPanUpdated", age: "15" });
assert.strictEqual(res5.status, 302, "Should redirect after update");
assert.ok(res5.headers.location.includes("peter-pan"), "Should redirect to the user's page");

// POST /users/:slug — returns 404 when updating a user that does not exist
const res6 = await request("POST", "/users/this-does-not-exist", { slug: "x", user_name: "Ghost", age: "0" });
assert.strictEqual(res6.status, 404, "Should return 404 when user not found");

// GET /users/:slug/delete — deletes user and redirects to /users
const res7 = await request("GET", "/users/peter-pan/delete");
assert.strictEqual(res7.status, 302, "Should redirect after deletion");
assert.ok(res7.headers.location.includes("/users"), "Should redirect to /users");

console.log("All tests passed ✅");
