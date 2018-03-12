# A small scale URL shortening service.

### Project Summary
A URL Shortening Micro service, part of a series of Free Code Camp backend projects.
Features a react frontend for getting short(er) links - cant afford a short domain!
Can also be used just as an api from your own web application.

## API Routes:
--- 
## ```GET /api/new ```
--- 
#### Request Query Body:
```url``` *required*  

```e.g. /api/new?url=http://www.youtube.com```


```
=> { success: true,  short: http://shrinkthis.herokuapp.com/api/150 }
```

--- 
## ```GET /api/:id ```
--- 
#### Request Params:
```id``` *required*  

```e.g. /api/150```

#### Response:

```
=> redirects to 'http://www.youtube.com'
```

## Notes 
New link ids are created by maintaining a 'counter' collection, that increments on each time a link is added.

This is obviously not ideal for a larger scale project, in which case I'd look at creating a more unique hash that doesnt have to access the DB initially in order to increment.

### What I learned
- Created a fairly extensive testing suite, using ```Mocha, Chai, chai-http```, made possible by the modularity of the app.
- Custom error handling middleware, with ```async/await``` route controllers.
- Initally made this with the stock MongoClient, so got familiar with the vanilla aspects of Mongo. I then transitioned to Mongoose so I could easily enforce a Schema and make the app a little less verbose.
- Encountered some problems on the way, involving route declaration see my Stack Overflow question and [subsequent answer that I posted](https://stackoverflow.com/questions/48989127/express-api-react-issue-with-routing).

### To-do
- Make a design for front end (dont just design in the browser!)