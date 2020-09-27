import React from "react";
import logo from "./logo.svg";
import "./App.css";
import FormExample from './components/formexample';
import LoanCalc from './components/loancalc'

class App extends React.Component {
    render() {
        return (
            <div id="mainDiv">
                <LoanCalc></LoanCalc>
                {/* <LoanCalc></LoanCalc> */}
                {/* <LoanCalc></LoanCalc> */}
            </div>
        );
    }
}

export default App;
