# Devmix


[![build Status](https://scontent.fcai1-2.fna.fbcdn.net/v/t1.0-9/21768353_1588748554518253_7857270476047284440_n.png?_nc_cat=110&_nc_eui2=AeFlYsmL8VQgoqvJ_mNsA5UlLyJ9pMmt8xdfYnnTUhW8otKDoAoKEXX-bjxIK67ZlxPfW1vrlMMipC-uC8FbNEuvGF0KB6GtlNPnJ4J2duCOvg&_nc_oc=AQldOgCLpoCR1LDU_q6UZn72tkJarP3azPXtetQumTRoXP4UhiBCFDz8rMgOiUDmdMg&_nc_ht=scontent.fcai1-2.fna&oh=4ca47705a01c1e313607f90ac7d3ec2a&oe=5DB6A9C3)](https://www.facebook.com/DevmixOfficialPage/)

[![build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://www.linkedin.com/in/ezat-elzalouy-844bb0133/)

[Devmix] is an application programming interface which will help the other front-end developers or even the mobile developer to create an application that will make people able to learn or even ask anyone about anything needs to know in software development.

  - All the events which roganized by devmix
  - Devmix members can be admins on the website.
  - Admins can publish their events or remove any event or session.
  - Users can see the upcoming events, the past event and its content.

# basic Features!

  - Displaying all the events
  - create an account.
  - being an admin and publish, modify, or remove events and sessions.

### Tech

Devmix uses a number of open source projects to work properly:

* [Node.js] - Javascript server-side development!
* [Mongo Database] - document-based, distributed database built for modern application developers and for the cloud era. No database is more productive to use.
* [Express JS] - Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
* [JSON Web Token] - JSON Web Tokens are an open, industry standard RFC 7519 method for representing claims securely between two parties.
* [node.js] - evented I/O for the backend
* [NPM] - Essential JavaScript development tools that help you go to market faster and build powerful applications using modern open source code.



And of course Devmix itself is open source with a [public repository][devmix]
 on GitHub.


### Development

Want to contribute? Great!

Devmix uses Node.js for fast developing. So you should have [node.js] installed on you device. just click the link and download according to your operating system.
[how to install node.js]

Open your favorite Terminal and run these commands.

Clone the github:
```sh
$ mkdir devmix
$ cd devmix
$ git clone [link-here]
```

Install dependencies:
```sh
$ npm install -g nodemon
$ npm i mongodb
$ npm i mongoose
$ npm i express
$ npm i config
$ npm i morgan
$ npm i helmet
$ npm i jsonwebtoken
$ export DEBUG=app:startup
$ export jwt_PK=[your secret key here]
$ export mail_password=[your secret password here (any word until now)]
```
For Running the application
```sh
$ nodemon index.js
```

**Free API, Hell Yeah!**

![](https://github.com/elzalouy/Devmix/blob/master/Devmix%20API.gif)


[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)


   [how to install node.js]: <https://www.guru99.com/download-install-node-js.html>
   [devmix]: <https://github.com/elzalouy/Devmix>
   [git-repo-url]: <https://github.com/elzalouy/Devmix>
   [node.js]: <http://nodejs.org>
   [Mongo Database]: <https://www.mongodb.com/>
   [Express JS]: <expressjs.com>
   [JSON Web Token]: <jwt.io>
   [NPM]: <https://www.npmjs.com/>
