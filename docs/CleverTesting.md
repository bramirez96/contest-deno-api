# Testing From the Clever District Dashboard

## Joining Our Dev Sandbox

To begin with, you need to be added to our Clever sandbox district. Reach out to a project manager for assistance. After joining, you will be redirected to our developer district page.

> To log in in the future, use the [district admin login](https://clever.com/oauth/district_admin/login).

## Logging In as a Student/Teacher

Our seed files include data that connects certain users from our Clever sandbox district. Use the following three users to test 'MERGE' or 'SUCCESS' statuses returned from our `/auth/o/clever` authorization endpoint.

> To read more about the three different account states returned from our OAuth endpoints, [click here](../src/interfaces/apiResponses.ts#cleverauthresponse).

### Teacher w/ StorySquad Account Linked ('SUCCESS')

While logged in, use [this link](https://schools.clever.com/impersonation/teachers/6001e942790e5a0fd643d7ea/start) to log in as `Reuben Conn`, who has a StorySquad account built into the seeds, as well as a linked `sso_lookup` row connecting to his Clever account.

### Student w/ StorySquad Account Linked ('SUCCESS')

While logged in, use [this link](https://schools.clever.com/impersonation/students/6001e942790e5a0fd643d7c5/start) to log in as `Fahey Young`, who also has a StorySquad account with an SSO link built into the seeds.

### Teacher w/ Unlinked Story Squad Account ('MERGE')

While logged in, use [this link](https://schools.clever.com/impersonation/teachers/6001e942790e5a0fd643d7eb/start) to log in as `Casandra Daniel`, who has a StorySquad account built into the seeds that is NOT linked to her Clever account.

## Testing the OAuth Flow

Now you should be in the student or teacher portal. Listed on the main page (the 'Homeroom' tab), in the bottom row of apps (called 'More'), you should see our app. Once you click on our app, you will be redirected to our application's redirect URI. The redirect page on our frontend should be at the route `/oauth/clever`. Clever passes back a code as a query parameter (`/oauth/clever?code=somecode`) that is passed back to our backend, which passes the code back to clever to get the user's information.
