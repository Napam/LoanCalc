from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from flask_cors import CORS
import loan
import random
from typing import Tuple
import pandas as pd


app = Flask(__name__)
# cors = CORS(app, resources={r"*": {"origins": "*"}})
api = Api(app)


def get_loan(payload: dict) -> dict:
    wanted_kwargs = {
        'laanebelop',
        'nominellRente',
        'terminGebyr',
        'utlopsDato',
        'saldoDato',
        'datoForsteInnbetaling'
    }

    # TODO: Sanity check that shit is right

    kwargs = {key:payload[key] for key in payload if key in wanted_kwargs}

    loan_object = loan.Loan(**kwargs)
    schedule: pd.DataFrame = loan_object.get_schedule()
    
    schedule['dato'] = schedule['dato'].astype(str)
    
    body = {
        'nedbetalingsplan': {'innbetalinger': schedule.to_dict(orient='records')},
        "aarligGruppertInnbetalinger": None,
        "metadata": None,
        "valideringsfeilmeldinger": None
    }

    return body


class LoanSchedule(Resource):
    '''
    API for loan stuff
    '''

    def post(self):
        payload = request.json
        body = get_loan(payload)
        return body

api.add_resource(LoanSchedule, '/loan')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80, debug=True)
    # app.run(port=1337, debug=True)