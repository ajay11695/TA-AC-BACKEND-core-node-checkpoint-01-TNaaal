Assignment
(Discuss this block)

Core Node Project

Create a http server which should run on port 5000 and handle following routes:-

    1.>GET request on index path (/) should render html template, for example index.html
    >
    2.>GET request on /about path should render html template like about.html
    >
    3.>Use separate routes to handle requests for stylesheets and images which must be linked with both index.html and about.html
    >

Note:-

Make sure to put all stylesheets and images in assets directory. You don't have to place exact image in the templates, you can use any of your choice.

4.Handle GET request on /contact path which should render a HTML form with following inputs:-
    >Name
    >Email
    >Username(unique)
    >Age
    >Bio

5.Handle a POST request on /form path which should capture about data from above form and save it inside contacts directory provided at the root of the project.

Follow below steps to save data:-

    >capture form data from contacts
    >create a filename inside contacts using username available from form like username1.json
    >if that username already exists in contacts, it should throw an error saying username taken
    >save contacts data inside above created file(A sample file is present inside contacts)
    >send a HTML response saying contacts saved

Note:-

Use fs module for above operations. Make sure to save users who have unique usernames, ensure unique username by using appropriate flags with fs.open()

6.handle GET request on /users?username=ANY_USERNAME_FROM_CONTACTS which should

   fetch that specific user information based on username from contacts
   return HTML response with all user data

Bonus

7.handle GET request on "/users" which should list all contacts into a webpage