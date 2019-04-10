# Featured Creatures
Find behind-the-scenes, up-close-and-personal encounters with your favorite animals at zoos in your city and around the world.

You are currently viewing the server-side repo. [Featured Creatures client-side GitHub repo](https://github.com/TheGaff87/featured-creatures-client)

## Link to live app:
https://featured-creatures.herokuapp.com/

## Screenshots:

### Screenshot of landing page: ![Landing page](/screenshots/landing-page.png)

### Screenshot of Sign up and Sign in components: ![Sign up and Log in components](/screenshots/signup-signin.png)

### Screenshot of filters available for encounters: ![Filters for encounters](/screenshots/filters.png)

### Screenshot of encounter when not logged in or an encounter you did not add: ![Basic encounter](/screenshots/encounter-not-logged.png)

### Screenshot of encounter you created (only accessible when logged in): ![Encounter you added](/screenshots/edit-delete.png)

### Screenshot of 'Add New Encounter' form (only accessible when logged in: ![Add Encounter form](/screenshots/add-new-encounter.png)

## Functionality:

This app allows any user to view all animal encounters in the database and filter encounters by animal or zoo.  Users can create an account which gives them the additional ability to add new encounters and edit or delete any encounter they add. There is also a demo account with pre-created events to help users get started.

## Technologies Used:

Frontend: React | Redux | JavaScript ES6 | CSS3  
Backend: Node.js | Express.js | Mocha | Chai | Mongo(ose)

## API Documentation
### POST request to '/api/users/':
Used to create new user account. Expects a JSON object containing a string username and a password between 5 and 72 characters. Creates user account and returns a JSON object containing username.

### POST request to '/api/auth/login':
Used to create authToken for existing user account. Expects a JSON object containing previously created username and password. Returns JSON object containing "authToken" that must be included as a header for all requests to protected endpoints.

### GET request to '/api/encounters':
Used to get all encounters from database.

### GET request to '/api/animals':
Used to get all distinct animal names in database for filtering. Returns list containing all animals.

### GET request to '/api/zoos':
Used to get all distinct zoo names in database for filtering. Returns list containing all zoos.

### GET request to '/api/animal/:term':
Expects parameter containing requested animal. Returns JSON object containing all encounters for requested animal.

### GET request to '/api/zoo/:term':
Expects parameter containing requested zoo. Returns JSON object containing all encounters for requested zoo.

### POST request to '/api/encounters/':
Requires authToken and expects all required fields in request body. New encounter is created in database and a JSON object containing the new encounter is returned.

### PUT request to '/api/encounters/:id':
Requires authToken. Expects parameter containing encounter ID. Allows user to change encounter cost, encounter schedule, and encounter description for encounters the user added. None of these fields is required, but at least one of the appropriate fields must exist in the request body. The requested field(s) are updated; no response is returned.

### DELETE request to '/api/encounters/:id':
Requires authToken. Expects parameter containing encounter ID. Appropriate encounter is deleted; nothing is returned.
