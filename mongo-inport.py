import pandas as pd
from pymongo import MongoClient

mongoUrl = "mongodb://localhost:27017/employee_attrition"
client = MongoClient(mongoUrl)
employeeAttrition = client.employee_attrition
employee = employeeAttrition.employee

sf = pd.read_csv('src/assets/employees_good.csv')
for i in sf.iterrows():
    emp = {
        "age": i[1].Age,
        "attrition" : i[1].Attrition,
        "distance_from_home" : i[1].DistanceFromHome,
        "education": i[1].Education,
        "job_level": i[1].JobLevel,
        "monthly_income": i[1].MonthlyIncome,
        "num_companies_worked": i[1].NumCompaniesWorked,
        "total_working_years": i[1].TotalWorkingYears,
        "training_times_last_year" : i[1].TrainingTimesLastYear,
        "years_at_company": i[1].YearsAtCompany,
        "years_since_last_promotion": i[1].YearsSinceLastPromotion
    }
    employee.insert_one(emp)
