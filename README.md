**A short report on FIFA-world-cup web app api development using AdonisJS by Ridwan W.**

**Project summary and aim**

The goal of this project is to help me gain familiarity with API development using the AdonisJS framework and to work with a junior front-end developer. This project tested my knowledge and helped me become comfortable building RESTful APIs with AdonisJS. I became familiar with the AdonisJS folder structure, concepts such as routing and controllers, database migration, models, factories, seeders, validators, middleware, and testing. I learned how to connect to the database, store and retrieve data, create endpoints, and, most importantly, API testing. Testing was particularly challenging for me as I was not familiar with it, having primarily used Postman to test API endpoints while following a series.
Having completing the assignment, I am using this report as an opportunity to revisit the project from the start and document every process involved in developing the API. Furthermore, it allows me to become more familiar with the AdonisJS framework and to learn and reinforce important concepts found in the AdonisJS documentation.

**What is AdonisJS?**

AdonisJS is a Node.js framework that brings fluency and expressiveness to the Node.js ecosystem and is also known for its beautiful code and simplicity for the backend.

**The project and its objectives**

The project was a FIFA World Cup web application that provided and stored details about the group stage, such as the 32 teams, matches played, teams in each group, match results, and so on.
The backend should provide the following API endpoints:
	Endpoint for creating a group.
	Endpoint for listing all groups.
	Endpoint for fetching a single group (with all matches played in the group and the results of the matches).
	Endpoint for updating a single group.
	Endpoint for deleting a single group.
	Endpoint for creating a team (and assigning the team to a group).
	Endpoint for listing all team.
	Endpoint for fetching a single team.
	Endpoint for updating a single team.
	Endpoint for deleting a single team.
	Endpoint for creating a match.
	Endpoint for listing all matches played with results of the matches.
	Endpoint for fetching a single match with result of the match.
	Endpoint for updating a single match (including the result of the match).
	Endpoint for deleting a single match.

**The methodology**

This is the approach taken to accomplish the goals of the project, which includes the following steps:
•	Setting up the backend
1.	Database design
2.	Setting up the database in the MySQL environment
3.	Configuring AdonisJS
•	Building the FIFA-world-cup application API
1.	Create the migration
2.	Create the Model
3.	Create the Controller
4.	Create the Endpoint Routes
•	Test the API

**Setting up the backend**

**Database design**

Database Design is a collection of processes that facilitate the designing, development, implementation and maintenance of enterprise data management systems. Properly designed database is easy to maintain, improves data consistency and are cost effective in terms of disk storage space. The database designer decides how the data elements correlate and what data must be stored.
The database for the project was designed using an online schema design tool called drawsql. DrawSQL software is a platform used to create, visualize and collaborate on your database entity relationship diagrams.
The schema was designed with care to accurately depict the structure of the tables in the database and their relationships. Based on the requirements and endpoints to be created, the following tables will hold the application data:

•	The group table

•	The teams table

•	The match table

•	The result table 

Below is a diagram of the schema design, including column names, data types, and relationships:


![image](https://user-images.githubusercontent.com/92832657/212670973-7c0096d8-b34a-4e3e-b509-2731fd2a41b5.png)


**Setting up the database in the MySQL environment**

MySQL is a popular and widely-used relational database management system (RDBMS) that is free and open-source. It is the system that we will be using to store our data. To use it, we will create a database and set up user access. However, creating tables in the MySQL environment will be handled by AdonisJS migrations, and our only task here is to create the database.
Installing and Configuring MySQL Database Server
For Windows, open this link MySQL: Download MySQL Installer  and to install MySQL for your Windows environment. To install MySQL, follow these steps:
1.	Click on the installer and select the custom setup type.
2.	Under the MySQL server section, choose the latest available version and click the right-pointing arrow to add it to the files to be installed.
3.	Under the applications section, select MySQL Workbench and add it to the files to be installed. Repeat the same process for MySQL Shell.
4.	Click next and then execute to download the three selected applications.
5.	After they have finished downloading, click next and then execute to install the three packages.
6.	Upon completion of the installation, you will need to configure the server. Keep all settings as the default and set a strong password for authentication. Continue clicking next to finish the setup.
Note: It is important to use a strong password and to write it down or store it in a safe place as you will need it to access the server.

**Creating the schema for our project**

Before we proceed to creating the schema for our project, we need to setup our connection in the workbench. On the MySQL workbench page, click on add new connection and make sure all parameters are set as seen in the image below.

![image](https://user-images.githubusercontent.com/92832657/212671214-c9bbd0e9-d5f7-40db-ab3d-e4bacad34966.png)

 
At the bottom right of the dialog box, click Test Connect. If everything is right, a success alert will be displayed.
Click OK to close the dialog box. Then click on the Local instance MySQL80 connection now listed on the home. This will open the Workbench interface.
Now, we can proceed to creating the schema for our project. Below are the steps involves:
1.	At the bottom of the Navigator panel on the left side of the Workbench interface, switch to the Schemas tab. Within the Schema panel, right click and choose Create Schema on the context menu. This opens the new_schema tab.
2.	In the Name field, enter fifa_world_cup as the name of the schema.
3.	For Charset/Collation, select utf8 as the Default Charset and select utf8_general_ci as the Default Collation.
4.	At the bottom right, click Apply. On the Apply SQL Script to Database dialog, click Apply to create the schema using the SQL statement shown. Click Finish when the success message is shown within dialog box.
5.	Check the Schema tab on the left-side of the interface. Now, you will see your newly-created fifa_world_cup schema.
Creating a User for our Schema (Database)
For our API server to connect to our database (schema), we need to provide an existing user within our database server and the password for that user. The user must have full access to the schema we want to connect to. Follow the process highlighted in this link to create the user for our schema.
Now we are done setting up our database and now ready to connect to it.

**Setup AdonisJS** 

AdonisJS has a relatively straightforward setup process, especially for those familiar with JavaScript frameworks. The first step is to properly install and configure Node.js and NPM on your local machine, using the instructions provided in the documentation. Once that is done, a new AdonisJS project can be created by following the process outlined in the documentation. Follow the process highlighted in this link for setting up our api server with AdonisJS.

**Building the FIFA-world-cup application API**

**Create the migration**



