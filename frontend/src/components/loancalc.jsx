import React, { Component } from "react";

class LoanCalc extends React.Component {
    state = {
        laanebelop: 2000000, 
        nominellRente: 3, 
        terminGebyr: 30, 
        utlopsDato: '2045-01-01',
        saldoDato: '2020-01-01',
        datoForsteInnbetaling: '2020-02-01'
    }

    render() {
        return (
            <div className="loanComponent">
                <form>
                    <div>
                        <label>
                            Lånebeløp:
                            <input type="number" value={this.state.laanebelop}/>
                        </label>
                    </div>
                    <div>
                        <label>
                            Termingebyr:
                            <input type="number" value={this.state.terminGebyr}/>
                        </label>
                    </div>
                    <div>
                        <label>
                            Nominell Rente:
                            <input type="number" value={this.state.nominellRente}/>
                        </label>
                    </div>
                    <div>
                        <label>
                            Saldo dato:
                            <input type="date" value={this.state.saldoDato}/>
                        </label>
                    </div>
                    <div>
                        <label>
                            Første innbetalingsdato:
                            <input type="date" value={this.state.datoForsteInnbetaling}/>
                        </label>
                    </div>
                    <div>
                        <label>
                            Utløps dato:
                            <input type="date" value={this.state.utlopsDato}/>
                        </label>
                    </div>
                </form>
            </div>
        );
    }
}

export default LoanCalc;
