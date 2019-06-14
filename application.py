################ Graphic ################

import seaborn as sns

sns.set(color_codes=True)

################  Hash  #################
import hashlib
import uuid


def hash_password(password):
    salt = uuid.uuid4().hex
    return hashlib.sha256(salt.encode() + password.encode()).hexdigest() + ':' + salt


def check_password(hashed_password, user_password):
    password, salt = hashed_password.split(':')
    return password == hashlib.sha256(salt.encode() + user_password.encode()).hexdigest()


############ JSON Encoder ################
import json


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

################ MongoDb #################
from pymongo import MongoClient
from bson.objectid import ObjectId
mongoUrl = "mongodb://localhost:27017/employee_attrition"
client = MongoClient(mongoUrl)
employeeAttrition = client.employee_attrition
employee = employeeAttrition.employee

################ Data preparation ################

import pandas as pd

sf = pd.DataFrame.from_dict(employee.find())

def get_distance(x):
    if x <= 5:
        return 1
    elif x > 5 and x <= 10:
        return 2
    elif x > 10 and x <= 20:
        return 3
    else:
        return 4

def get_monthly_income(x):
    if x > 2000 and x <= 5000:
        return 1
    elif x > 5000 and x <= 10000:
        return 2
    else:
        return 3

def get_twy(x):
    if x <= 2:
        return 1
    elif x > 2 and x <= 5:
        return 2
    elif x > 5 and x <= 10:
        return 3
    elif x > 10 and x <= 15:
        return 4
    elif x > 15 and x <= 20:
        return 5
    else:
        return 6

def get_age(x):
    if x <= 25:
        return 1
    elif x > 25 and x <= 30:
        return 2
    elif x > 30 and x <= 35:
        return 3
    elif x > 35 and x <= 40:
        return 4
    else:
        return 5

def get_education(x):
    if x == 'Politehnica':
        return 1
    elif x == 'Universitate':
        return 2
    elif x == 'Cibernetica':
        return 3
    elif x == 'Master':
        return 4
    else:
        return 5

sf['Distance'] = sf.distance_from_home.apply(get_distance)
sf['Income'] = sf.monthly_income.apply(get_monthly_income)
sf['twy'] = sf.total_working_years.apply(get_twy)
sf['AgeIndex'] = sf.age.apply(get_age)

sf = sf.drop(['monthly_income', 'distance_from_home', 'total_working_years', 'age'], axis=1)


sf = sf.rename(index=str, columns = {"Distance" : "distance_from_home", "Income" : "monthly_income",
                                     "twy" : "total_working_years", 'AgeIndex': 'age'})

# print(sf.head())
# print(sf)

X = sf[['age', 'education', 'job_level', 'num_companies_worked',
        'training_times_last_year','years_at_company',
        'years_since_last_promotion', 'distance_from_home',
        'monthly_income', 'total_working_years']]
Y = sf['attrition']

################# Training Classifier ################
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
import time


X_train, X_test = train_test_split(sf, test_size=0.5, random_state=int(time.time()))
used_features = ['age', 'education', 'job_level', 'num_companies_worked',
                 'training_times_last_year', 'years_at_company', 'years_since_last_promotion',
                 'distance_from_home', 'monthly_income', 'total_working_years']

# gnb = GaussianNB()
gnb = GradientBoostingClassifier()

gnb.fit(X_train[used_features].values, X_train['attrition'])

y_pred = gnb.predict(X_test[used_features])

print("Number of mislabeled points out of a total {} points : {}, performance {:05.2f}%"
      .format(
          X_test.shape[0],
          (X_test["attrition"] != y_pred).sum(),
          100*(1-(X_test["attrition"] != y_pred).sum()/X_test.shape[0])
))

sns.distplot(sf.distance_from_home)
# plt.show()

################# API ################
from flask import Flask
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS

user = employeeAttrition.user

app = Flask(__name__)
CORS(app)
api = Api(app)

class Attrition(Resource):
    @app.route('/attrition', methods=['POST'])
    def getAttrition():
        parser = reqparse.RequestParser()
        parser.add_argument('age')
        parser.add_argument('education')
        parser.add_argument('jobLevel')
        parser.add_argument('numCompaniesWorked')
        parser.add_argument('trainingTimesLastYear')
        parser.add_argument('yearsAtCompany')
        parser.add_argument('yearsSinceLastPromotion')
        parser.add_argument('distanceFromHome')
        parser.add_argument('monthlyIncome')
        parser.add_argument('totalWorkingYears')

        args = parser.parse_args()
        print(args)

        result_proba = gnb.predict_proba([[
            get_age(int(args['age'])),
            get_education(args['education']),
            int(args['jobLevel']),
            int(args['numCompaniesWorked']),
            int(args['trainingTimesLastYear']),
            int(args['yearsAtCompany']),
            int(args['yearsSinceLastPromotion']),
            get_distance(int(args['distanceFromHome'])),
            get_monthly_income(int(args['monthlyIncome'])),
            get_twy(int(args['totalWorkingYears']))
        ]]
        )

        print("------------------------Classes probabilities------------------------")
        print(result_proba)

        percentage = result_proba[0][0] * 100

        result = gnb.predict(
            [[
            get_age(int(args['age'])),
            get_education(args['education']),
            int(args['jobLevel']),
            int(args['numCompaniesWorked']),
            int(args['trainingTimesLastYear']),
            int(args['yearsAtCompany']),
            int(args['yearsSinceLastPromotion']),
            get_distance(int(args['distanceFromHome'])),
            get_monthly_income(int(args['monthlyIncome'])),
            get_twy(int(args['totalWorkingYears']))
        ]]
        )

        attritionLevel = ''
        if percentage >= 50:
            attritionLevel = 'yes'
        else:
            attritionLevel = 'no'

        e = {
            "age": int(args['age']),
            "attrition": attritionLevel,
            "distance_from_home": int(args['distanceFromHome']),
            "education": args['education'],
            "job_level": int(args['jobLevel']),
            "monthly_income": int(args['monthlyIncome']),
            "num_companies_worked": int(args['numCompaniesWorked']),
            "total_working_years": int(args['totalWorkingYears']),
            "training_times_last_year": int(args['trainingTimesLastYear']),
            "years_at_company": int(args['yearsAtCompany']),
            "years_since_last_promotion": int(args['yearsSinceLastPromotion'])
        }
        employee.insert_one(e)

        print("-----------------------RESULT-------------------------")
        print(result)

        responseBody = {
            "percentage": "{:05.2f}".format(percentage)
        }

        return JSONEncoder().encode(responseBody), 200

class Login(Resource):
    @app.route('/login', methods=['POST'])
    def login():
        parser = reqparse.RequestParser()
        parser.add_argument('username')
        parser.add_argument('password')

        args = parser.parse_args()
        print(args)

        username = args['username']
        password = args['password']
        if username == "" or password == "":
            return '', 403
        userFound = user.find_one({"username": username})

        print(userFound)
        if check_password(userFound['password'], password):
            return '', 200
        else:
            return '', 401

class Employee(Resource):
    @app.route('/employees/page/<int:pageNr>/number/<int:totalPerPage>', methods=['GET'])
    def getEmployees(pageNr, totalPerPage):
        empls = employee.find().skip((pageNr - 1) * totalPerPage).limit(totalPerPage)
        numberOfRows = employee.count_documents({})
        responseBody = {
            "obj": list(empls),
            "counter": numberOfRows
        }
        if empls:
            return JSONEncoder().encode(responseBody), 200
        else:
            return 'Nothing', 404

    @app.route('/employees/<string:id>', methods=['DELETE'])
    def deleteEmployee(id):
        employee.delete_one({"_id": ObjectId(id)})
        return '', 200

app.run(debug=True, port=5000)
