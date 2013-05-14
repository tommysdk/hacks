Node.js based web server which acts as an in-memory logger and provides a looking glass to the received log events.

Groups logging events by specified context path and stores the latest specified query parameter key and value for that path. Currently only on query parameter is supported.

Example when hosted at localhost:
Status page: http://127.0.0.1/
Log request: http://127.0.0.1/event_title?event=value 
