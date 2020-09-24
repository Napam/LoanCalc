import numpy as np 
import pandas as pd 
from datetime import datetime as dt
from dateutil.relativedelta import relativedelta

def n_monthsdays_between(date1, date2):
    diff = relativedelta(date1, date2)
    n_months = diff.years*12 + diff.months
    remaining_days = diff.days # for verbosity
    return n_months, remaining_days

def pmt(amount: float, rate: float, n: int):
    assert 0 < rate < 1, "Rate must be between 0 and 1"

    raten = rate**n
    return amount * raten * ((1-rate) / (1-raten))