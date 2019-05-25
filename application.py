################ Graphic ################

import seaborn as sns
import matplotlib.pyplot as plt
sns.set(color_codes=True)


############ JSON Encoder ################
import json
from bson import ObjectId

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

################ MongoDb #################
from pymongo import MongoClient
mongoUrl = "mongodb://localhost:27017/employee_attrition"
client = MongoClient(mongoUrl)
employeeAttrition = client.employee_attrition

################ Data preparation ################

import pandas as pd

# Used to import data in mongodb

# sf = pd.read_csv('data/employees_good.csv')
# employee = employeeAttrition.employee
# for i in sf.iterrows():
#     emp = {
#         "age": i[1].Age,
#         "attrition" : i[1].Attrition,
#         "distance_from_home" : i[1].DistanceFromHome,
#         "education": i[1].Education,
#         "job_level": i[1].JobLevel,
#         "monthly_income": i[1].MonthlyIncome,
#         "num_companies_worked": i[1].NumCompaniesWorked,
#         "total_working_years": i[1].TotalWorkingYears,
#         "training_times_last_year" : i[1].TrainingTimesLastYear,
#         "years_at_company": i[1].YearsAtCompany,
#         "years_since_last_promotion": i[1].YearsSinceLastPromotion
#     }
#     employee.insert_one(emp)

employee = employeeAttrition.employee
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

X = sf[['age', 'education', 'job_level', 'num_companies_worked', 'training_times_last_year',
       'years_at_company', 'years_since_last_promotion', 'distance_from_home', 'monthly_income', 'total_working_years']]
Y = sf['attrition']

################# Training Classifier ################
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
import time


X_train, X_test = train_test_split(sf, test_size=0.5, random_state=int(time.time()))
used_features = ['age', 'education', 'job_level', 'num_companies_worked', 'training_times_last_year',
       'years_at_company', 'years_since_last_promotion', 'distance_from_home', 'monthly_income', 'total_working_years']

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

app = Flask(__name__)
CORS(app)
api = Api(app)

class Attrition(Resource):
    def post(self):
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

        if percentage <= 25:
            response = 1
        elif percentage > 25 and percentage <= 50:
            response = 2
        elif percentage > 50 and percentage <= 75:
            response = 3
        else: 
            response = 4

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

        print("-----------------------RESULT-------------------------")
        print(result)

        responseBody = {
            "percentage": "{:05.2f}".format(percentage),
            "score" : response
        }

        return responseBody, 200

user = employeeAttrition.user

class Login(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username')
        parser.add_argument('password')

        args = parser.parse_args()
        print(args)

        username = args['username']
        password = args['password']
        userFound = user.find_one({"username": username})

        print(userFound)
        if userFound['password'] == password:
            return '', 200
        else:
            return '', 401


class Employee(Resource):
    def get(self):
        empls = employee.find()

        if empls:
            return JSONEncoder().encode(list(empls)), 200
        else:
            return 'Nothing', 404

api.add_resource(Attrition, "/attrition")
api.add_resource(Employee, "/employees")
api.add_resource(Login,"/login")


app.run(debug=True, port=5000)        