import React from "react";
import "./App.css";
import LoanCalc from './components/loancalc'

class App extends React.Component {
    render() {
        return (
            <div id="mainDiv">
                <LoanCalc></LoanCalc>
            </div>
        );
    }
}

export default App;
