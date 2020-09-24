import numpy as np 
import pandas as pd 
from datetime import datetime as dt
from dateutil.relativedelta import relativedelta
from typing import Tuple


def n_monthsdays_between(date1: pd.Timestamp, date2: pd.Timestamp) -> Tuple[int, int]:
    """Get number of months and days between two dates

    Parameters
    ----------
    date1 : pd.Timestamp
        First date, if this date is larger than the other, the return value will be positive
    date2 : pd.Timestamp
        Second date

    Returns
    -------
    Tuple[int, int]
        (n_months, remaining_days)
    """    
    diff = relativedelta(date1, date2)
    n_months = diff.years*12 + diff.months
    remaining_days = diff.days # for verbosity
    return n_months, remaining_days


def pmt(loan: float, rate: float, n: int) -> float:
    """Equivalent to Excel's pmt function. Gets the payment value
    for annuity loan. Formula is derived from sum of geometric series.

    Parameters
    ----------
    loan : float
        Loan value
    rate : float
        Rate that is between 0 and 1
    n : int
        Number of downpayments

    Returns
    -------
    Float
        Downpayment value for annuity loan
    """    
    assert 0 < rate < 1, "Rate must be between 0 and 1"

    rate = 1+rate
    raten = rate**n
    return loan * raten * ((1-rate) / (1-raten))