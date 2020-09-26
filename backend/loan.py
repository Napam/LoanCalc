import numpy as np 
import pandas as pd 
from datetime import datetime as dt
import utils 
import json
from pprint import pprint
import http.client
from dateutil.relativedelta import relativedelta
from typing import List


class Loan:
    '''
    Class for calculating loan schedule for annuity loan
    '''
    def __init__(
        self, laanebelop: float, nominellRente: float, terminGebyr: float, utlopsDato: str, 
        saldoDato: str, datoForsteInnbetaling: str):
        """Class for caclulating loan scheudle for annuity loan

        Parameters
        ----------
        laanebelop : float
            Total loan amount
        nominellRente : float
            Nominal interest rate pr year. Should be given a percentage.
        terminGebyr : float
            Fee for paying down loan 
        utlopsDato : str
            Date for last down payment. Should be formatted in ISO 8601 datetime.
        saldoDato : str
            Date for when money is transfered to account. Should be formatted in ISO 8601 datetime.
        datoForsteInnbetaling : str
            Date for first down payment. Should be formatted in ISO 8601 datetime.
        """        
        
        self.laanebelop = laanebelop
        self.nominellRente = nominellRente / 100
        self.monthlyRate = self.nominellRente / 12
        self.terminGebyr = terminGebyr

        # Requires ISO 8601 formatting for time 
        self.utlopsDato: dt = pd.Timestamp(utlopsDato)
        self.saldoDato: dt = pd.Timestamp(saldoDato)
        self.datoForsteInnbetaling: dt = pd.Timestamp(datoForsteInnbetaling)

        assert self.utlopsDato >= self.datoForsteInnbetaling,\
            "utlopsDato must be later than datoForsteInnbetaling"

        # Will be set when schedule is generated
        self.paymentvalue: float = None


    def get_dates(self) -> List[pd.Timestamp]:
        """Get downpayment dates

        Returns
        -------
        List[pd.Timestamp]
            List of pd.Timestamp objects
        """        
        n_months, remaining_days = utils.n_monthsdays_between(self.utlopsDato, 
                                                              self.datoForsteInnbetaling)
        
        # The n_months+1 is to include the last month as well 
        dates = [self.datoForsteInnbetaling + relativedelta(months=i) for i in range(n_months+1)]
        dates = [self.saldoDato] + dates 
        
        # If any remaining days, then add the last entry
        if remaining_days > 0:
            dates.append(dates[-1] + relativedelta(days=remaining_days))

        return dates


    def get_schedule(self) -> pd.DataFrame:
        """Gets downpayment schedule for annuity loan

        Returns
        -------
        pd.DataFrame
            Dataframe containing donwpayment infromation. The format is similar to Stacc's 
            API response
        """        

        datos = self.get_dates()
        self.paymentvalue = utils.pmt(
            loan=self.laanebelop,
            rate=self.monthlyRate,
            n=len(datos)-1 # Datos include the "zeroth" term, hence remove 1
        )

        gebyrs = np.full(shape=len(datos), fill_value=self.terminGebyr)
        gebyrs[0] = 0

        # Remember to add gebyr afterwards
        totals = np.full(shape=len(datos), fill_value=self.paymentvalue) 
        totals[0] = 0

        restgjelds = np.zeros_like(totals)
        restgjelds[0] = self.laanebelop

        innbetalings = np.zeros_like(totals)
        renters = np.zeros_like(totals)

        for i in range(1, len(totals)):
            renters[i] = restgjelds[i-1]*self.monthlyRate
            innbetalings[i] = totals[i] - renters[i] 
            restgjelds[i] = restgjelds[i-1] - innbetalings[i]

        # Remembering to add gebyrs afterwards
        totals += gebyrs

        df = pd.DataFrame({
            'restgjeld':restgjelds.round(0),
            'dato':datos,
            'innbetaling':innbetalings.round(0),
            'gebyr':gebyrs.round(0),
            'renter':renters.round(0),
            'total':totals.round(0)
        })

        return df

if __name__ == '__main__':
    '''
    Ad hoc testing :^)
    '''
    utlopsstring = "2030-10-14"
    saldostring = "2020-01-01"
    datoforstestring = "2020-12-18"

    utlopsstring = "2021-02-01"
    saldostring = "2020-01-01"
    datoforstestring = "2020-02-01"
    gebyr = 30

    loan = Loan(
        laanebelop = 1000000, 
        nominellRente = 5, 
        terminGebyr = gebyr, 
        utlopsDato = utlopsstring,
        saldoDato =  saldostring,
        datoForsteInnbetaling = datoforstestring
    )

    df = loan.get_schedule()
    print(df)

    def get_sample():
        '''
        For testing and sanity checking
        '''
        from matplotlib import pyplot as plt

        conn = http.client.HTTPSConnection("visningsrom.stacc.com")

        payload_dict = {
            "laanebelop": 1000000, 
            "nominellRente":5, 
            "terminGebyr":gebyr, 
            "utlopsDato":utlopsstring, 
            "saldoDato":saldostring, 
            "datoForsteInnbetaling":datoforstestring, 
            "ukjentVerdi":"TERMINBELOP"
        }

        payload = json.dumps(payload_dict)

        headers = {
            'content-type': "application/json",
            'cache-control': "no-cache",
            'postman-token': "b0127b0e-be6c-ac87-5df5-b37941800807"
        }

        conn.request("POST", "/dd_server_laaneberegning/rest/laaneberegning/v1/nedbetalingsplan", 
                     payload, headers)

        res = conn.getresponse()
        data = res.read()

        data = json.loads(data.decode("utf-8"))
        df = pd.DataFrame(data['nedbetalingsplan']['innbetalinger'])

        # with pd.option_context('max_columns', None):
        print(df)
        # pprint(json.loads(df.to_json(orient='records')))

        # y_bottom = df.loc[1:].total.mean() - 200
        # y_top = df.loc[1:].total.mean() + 5
        # plt.bar(df.dato, df.innbetaling)
        # plt.bar(df.dato, df.renter, bottom=df.innbetaling)
        # plt.ylim(y_bottom, y_top)
        # plt.show()

    get_sample()