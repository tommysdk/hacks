Node.js based web server which acts as an in-memory logger and provides a looking glass to the received log events.

Groups logging events by specified context path and stores the specified query parameter key and value for that path. Currently only one query parameter is supported.

Example when hosted at localhost:
Status page : http://localhost/
Log request : http://localhost/event_title?event=value 
View history: http://localhost/history/event_title
