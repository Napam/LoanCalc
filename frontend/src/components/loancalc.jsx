import React, { Component } from "react";
import axios from "axios";
import {
    Line,
    ResponsiveContainer,
    YAxis,
    XAxis,
    Tooltip,
    Bar,
    Legend,
    Brush,
    ComposedChart,
    Label,
} from "recharts";

const API_URL = "http://localhost:1337/loan";

class LoanCalc extends Component {
    state = {
        laanebelop: "2000000",
        nominellRente: "10",
        terminGebyr: "30",
        utlopsDato: "2022-01-01",
        saldoDato: "2020-01-01",
        datoForsteInnbetaling: "2020-02-01",
        plotData: [],
        plotDomain: [0, 1],
    };

    componentDidMount() {
        axios.post(API_URL, this.getPayload()).then((res) => {
            this.setState(
                { plotData: res.data["nedbetalingsplan"]["innbetalinger"] },
                this.setPlotData()
            );
        });
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
        ["laanebelop", "nominellRente", "terminGebyr"].forEach((key) => {
            payload[key] = parseFloat(payload[key]);
        });

        return payload;
    }

    setPlotDomain() {
        let { innbetaling, renter } = this.state.plotData[1];
        
        let proportion = innbetaling / (innbetaling + renter);
        let lowerbound = 0;

        if (proportion > 0.6) {
            lowerbound = 0.5;
        }
        
        this.setState({ plotDomain: [lowerbound, 1] });
    }

    setPlotData() {
        let payload = this.getPayload();
        axios.post(API_URL, payload).then((res) => {
            this.setState({ plotData: res.data["nedbetalingsplan"]["innbetalinger"] }, () => {
                this.setPlotDomain();
            });
        });
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
        this.setState(temp, () => {
            this.setPlotData();
        });
    };

    /**
     * Decorator for stateSetter
     * @param {String} key
     */
    getStateSetter(key) {
        return (event) => this.stateSetter(event, key);
    }

    render() {
        return (
            <div className="loanComponent">
                <div id="loanCalcTitle">$$$ LÅNEKALKULATOR $$$</div>

                <form id="inputForm">
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

                <div className="chartTitle">Nedbetalingsplan</div>

                <ResponsiveContainer width={"100%"} height={500}>
                    <ComposedChart
                        syncId="syncId1"
                        data={this.state.plotData.slice(1)}
                        margin={{ left: 50, right: 50 }}
                        stackOffset="expand"
                    >
                        <XAxis dataKey="dato">
                            <Label value="Innbetalingsdatoer" position="bottom" />
                        </XAxis>

                        <YAxis
                            yAxisId="left"
                            orientation="left"
                            domain={this.state.plotDomain}
                            allowDataOverflow
                        >
                            <Label value="Andel innbetaling og renter" angle={-90} dx={-30} />
                        </YAxis>

                        <YAxis yAxisId="right" orientation="right" allowDataOverflow>
                            <Label value="Restgjeld" angle={90} dx={60} />
                        </YAxis>

                        <Tooltip />
                        <Legend verticalAlign="top" />
                        <Bar yAxisId="left" dataKey="innbetaling" fill="#82ba7f" stackId="a" />
                        <Bar yAxisId="left" dataKey="renter" fill="#dd7876" stackId="a" />
                        <Line
                            yAxisId="right"
                            dataKey="restgjeld"
                            type="monotone"
                            strokeWidth={3}
                            dot={false}
                        />
                        <Brush dataKey="dato" height={30} />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        );
    }
}

export default LoanCalc;
