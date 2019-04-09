################ Data preparation ################

import pandas as pd
sf = pd.read_csv('data/employees_good.csv')

def get_distance(x):
    if x <= 10:
        return 1
    elif x > 10 and x <= 20:
        return 2
    else:
        return 3

def get_monthly_income(x):
    if x <= 5000:
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

sf['Distance'] = sf.DistanceFromHome.apply(get_distance)
sf['Income'] = sf.MonthlyIncome.apply(get_monthly_income)
sf['twy'] = sf.TotalWorkingYears.apply(get_twy)
sf['AgeIndex'] = sf.Age.apply(get_age)

sf = sf.drop(['MonthlyIncome', 'DistanceFromHome', 'TotalWorkingYears', 'Age'], axis=1)


sf = sf.rename(index=str, columns = {"Distance" : "DistanceFromHome", "Income" : "MonthlyIncome",
                                     "twy" : "TotalWorkingYears", 'AgeIndex': 'Age'})

# print(sf.head())

X = sf[['Age', 'Education', 'JobLevel', 'NumCompaniesWorked', 'TrainingTimesLastYear',
       'YearsAtCompany', 'YearsSinceLastPromotion', 'DistanceFromHome', 'MonthlyIncome', 'TotalWorkingYears']]
Y = sf['Attrition']

################# Training Classifier ################
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
import time


X_train, X_test = train_test_split(sf, test_size=0.5, random_state=int(time.time()))
used_features = ['Age', 'Education', 'JobLevel', 'NumCompaniesWorked', 'TrainingTimesLastYear',
       'YearsAtCompany', 'YearsSinceLastPromotion', 'DistanceFromHome', 'MonthlyIncome', 'TotalWorkingYears']

# gnb = GaussianNB()
gnb = GradientBoostingClassifier()

gnb.fit(X_train[used_features].values, X_train['Attrition'])

y_pred = gnb.predict(X_test[used_features])
print("Number of mislabeled points out of a total {} points : {}, performance {:05.2f}%"
      .format(
          X_test.shape[0],
          (X_test["Attrition"] != y_pred).sum(),
          100*(1-(X_test["Attrition"] != y_pred).sum()/X_test.shape[0])
))

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

api.add_resource(Attrition, "/attrition")

app.run(debug=True, port=5000)        