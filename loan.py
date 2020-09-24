import numpy as np 
import pandas as pd 
from datetime import datetime as dt
import utils 
import json
from pprint import pprint
import http.client
from dateutil.relativedelta import relativedelta

class Loan:
    def __init__(
        laanebelop: float, nominellRente: float, terminGebyr: int, utlopsDato: str, 
        saldoDato: str, datoForsteInnbetaling: str):
        
        self.laanebelop = laanebelop
        self.nominellRente = nominellRente
        self.terminGebyr = terminGebyr

        # Requires ISO 8601 formatting for time 
        self.utlopsDato: dt = pd.Timestamp(utlopsDato)
        self.saldoDato: dt = pd.Timestamp(saldoDato)
        self.datoForsteInnbetaling: dt = pd.Timestamp(datoForsteInnbetaling)

        assert self.utlopsDato >= self.datoForsteInnbetaling,\
            "utlopsDato must be later than datoForsteInnbetalnig"


    def get_dates(self):
        n_months, remaining_days = utils.n_monthsdays_between(self.utlopsDato, 
                                                              self.datoForsteInnbetaling)
        
        # The n_months+1 is to include the last month as well 
        dates = [self.datoForsteInnbetaling + relativedelta(months=i) for i in range(n_months+1)]
        dates = [self.saldoDato] + dates 
        
        # If any remaining days, then add the last entry
        if remaining_days > 0:
            dates.append(dates[-1] + relativedelta(days=remaining_days))

        return dates


    def get_schedule(self):
        datos = self.get_dates()
        paymentvalue = utils.pmt()

        gebyrs = np.full(shape=len(dates), fill_value=self.terminGebyr)
        gebyrs[0] = 0

        restgjelds = []
        innbetalings = []
        renters = []
        totals = []

if __name__ == '__main__':
    utlopsstring = "2030-10-14"
    saldostring = "2020-01-01"
    datoforstestring = "2020-12-18"

    utlopsstring = "2021-02-01"
    saldostring = "2020-01-01"
    datoforstestring = "2020-02-01"

    loan(
        laanebelop = 2000000, 
        nominellRente = 5, 
        terminGebyr = 30, 
        utlopsDato = utlopsstring,
        saldoDato =  saldostring,
        datoForsteInnbetaling = datoforstestring
    )

    def get_sample():
        from matplotlib import pyplot as plt

        conn = http.client.HTTPSConnection("visningsrom.stacc.com")

        payload_dict = {
            "laanebelop": 1000000, 
            "nominellRente":5, 
            "terminGebyr":0, 
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

        # y_bottom = df.loc[1:].total.mean() - 200
        # y_top = df.loc[1:].total.mean() + 5
        # plt.bar(df.dato, df.innbetaling)
        # plt.bar(df.dato, df.renter, bottom=df.innbetaling)
        # plt.ylim(y_bottom, y_top)
        # plt.show()

    get_sample()