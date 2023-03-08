# OC_P6_DA-Python

Projet n°6: DA-Python OpenClassrooms (Develop a software program in Python)

# Installation

Download the repository on your computer.

```bash
git clone https://github.com/Majestic-MJ12/OC_P6_DA-Python.git
```

First, setup and run the server:



1- Navigate to the API folder with ```$cd OCMovies-API-EN-FR-master/```

2- Create a virtual environment for the project with ```$ py -m venv env on windows or $ python3 -m venv env on macos or linux.```

3- Activate the virtual environment with ```$ env\Scripts\activate on windows or $ source env/bin/activate on macos or linux.```

4- Install project dependencies with ```$ pip install -r requirements.txt```

5- Create and populate the project database with ```$ python manage.py create_db```

6- Run the server with ```$ python manage.py runserver```


When the server is running after step 6 of the procedure, the OCMovies API can be requested from endpoints starting with the following base URL: http://localhost:8000/api/v1/titles/.

Steps 2 and 4-5 are only required for initial installation. For subsequent launches of the API, you only have to execute steps 3 and 6 from the root folder of the project.

# Launch the website
Simply open the index.html page.

Click on a movie to see more about it.

# Resources and Credits

Bootstrap icons

JustStreamIt and OpenClassromms logo provided by OpenClassrooms

API used in this project provided by OpenClassrooms: https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR

Other image are from licence creative commons from google

HTML and CSS Indent: https://www.tab-it.fr/

JS indent: https://www.freeformatter.com/javascript-beautifier.html

HTML and CSS validator: https://validator.w3.org/ and https://jigsaw.w3.org/css-validator/
