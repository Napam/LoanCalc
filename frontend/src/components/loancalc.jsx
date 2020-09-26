import React, { Component } from "react";
import axios from "axios";
import {
    LinearChart,
    Line,
    LineChart,
    ResponsiveContainer,
    BarChart,
    YAxis,
    XAxis,
    Tooltip,
    Bar,
} from "recharts";

class LoanCalc extends React.Component {
    state = {
        laanebelop: "2000000",
        nominellRente: "10",
        terminGebyr: "30",
        utlopsDato: "2021-01-01",
        saldoDato: "2020-01-01",
        datoForsteInnbetaling: "2020-02-01",
        plotData: []
    };

    componentDidMount() {
        axios.post('http://localhost:1337/loan', this.getPayload()).then(res => {
            console.log(res.data['nedbetalingsplan']['innbetalinger']);
            this.setState({plotData: res.data['nedbetalingsplan']['innbetalinger']});
        })
    }

    getPayload() {
        // Pick out wanted stuff from state
        let payload = (({
            laanebelop,
            nominellRente,
            terminGebyr,
            utlopsDato,
            saldoDato,
            datoForsteInnbetaling,
        }) => ({
            laanebelop,
            nominellRente,
            terminGebyr,
            utlopsDato,
            saldoDato,
            datoForsteInnbetaling,
        }))(this.state);

        // Handle string to integers
        ['laanebelop', 'nominellRente', 'terminGebyr'].forEach(key => {
            payload[key] = parseFloat(payload[key])
        })

        return payload;
    }

    updatePlotData() {
        axios.post('http://localhost:1337/loan', this.getPayload()).then(res => {
            console.log(res.data['nedbetalingsplan']['innbetalinger']);
            this.setState({plotData: res.data['nedbetalingsplan']['innbetalinger']});
        })
    }

    /*
    *
     * Given event and key, update state with those
     * @param {SyntheticEvent} event
     * @param {String} key
     */
    stateSetter = (event, key) => {
        let temp = {};
        temp[key] = event.target.value;
        this.setState(temp);
        this.updatePlotData();
    };

    /**
     * Decorator for stateSetter
     * @param {String} key
     * @param {Function} hook
     */
    getStateSetter(key) {
        return (event) => this.stateSetter(event, key);
    }


    render() {
        const data = [
            { name: "NE Send", completed: 230, failed: 335, inprogress: 453 },
            { name: "NE Resend", completed: 335, failed: 330, inprogress: 345 },
            { name: "Miles Orchestrator", completed: 537, failed: 243, inprogress: 2110 },
            { name: "Commissions Payment Orch", completed: 132, failed: 328, inprogress: 540 },
            { name: "Business Integrators", completed: 530, failed: 145, inprogress: 335 },
            { name: "SmartTrack", completed: 538, failed: 312, inprogress: 110 },
        ];

        const data2 = [
            {dato: "2020-01-01", restgjeld: 500, renter: 500,},
            {dato: "2020-01-02", restgjeld: 410, renter: 450},
            {dato: "2020-01-03", restgjeld: 320, renter: 400},
            {dato: "2020-01-04", restgjeld: 230, renter: 350},
            {dato: "2020-01-05", restgjeld: 140, renter: 300},
            {dato: "2020-01-06", restgjeld: 50, renter: 250},
        ];

        // const data = [];

        return (
            <div className="loanComponent">
                <form>
                    <div>
                        <label>
                            <div className="inputLabelText">
                                Lånebeløp:
                                <input
                                    type="number"
                                    value={this.state.laanebelop}
                                    onChange={this.getStateSetter("laanebelop")}
                                />
                            </div>
                        </label>
                    </div>
                    <div>
                        <label>
                            <div className="inputLabelText">
                                Termingebyr:
                                <input
                                    type="number"
                                    min="0"
                                    value={this.state.terminGebyr}
                                    onChange={this.getStateSetter("terminGebyr")}
                                />
                            </div>
                        </label>
                    </div>
                    <div>
                        <label>
                            <div className="inputLabelText">
                                Nominell Rente:
                                <input
                                    type="number"
                                    value={this.state.nominellRente}
                                    onChange={this.getStateSetter("nominellRente")}
                                />
                            </div>
                        </label>
                    </div>
                    <div>
                        <label>
                            <div className="inputLabelText">
                                Saldo dato:
                                <input
                                    type="date"
                                    value={this.state.saldoDato}
                                    onChange={this.getStateSetter("saldoDato")}
                                />
                            </div>
                        </label>
                    </div>
                    <div>
                        <label>
                            <div className="inputLabelText">
                                Første innbetalingsdato:
                                <input
                                    type="date"
                                    value={this.state.datoForsteInnbetaling}
                                    onChange={this.getStateSetter("datoForsteInnbetaling")}
                                />
                            </div>
                        </label>
                    </div>
                    <div>
                        <label>
                            <div className="inputLabelText">
                                Utløps dato:
                                <input
                                    type="date"
                                    value={this.state.utlopsDato}
                                    onChange={this.getStateSetter("utlopsDato")}
                                />
                            </div>
                        </label>
                    </div>
                </form>

                <br></br>
                <ResponsiveContainer width={"100%"} height={500}>
                    <BarChart
                        layout="vertical"
                        // data={this.state.plotData}
                        data={this.state.plotData}
                        margin={{ left: 50, right: 50 }}
                        stackOffset="expand"
                    >
                        <XAxis hide type="number" />
                        <YAxis type="category" dataKey="dato" stroke="black" fontSize="12" />
                        <Tooltip/>
                        <Bar dataKey="restgjeld" fill="#dd7876" stackId="a" />
                        <Bar dataKey="renter" fill="#82ba7f" stackId="a" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    }
}

export default LoanCalc;
