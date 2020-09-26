import React, { Component } from 'react';

class FormExample extends React.Component {
    state = {
        username: '',
        comment: '',
        topic: 'React',
    };

    
    handleChangeUsername = (event) => {
        this.setState({username: event.target.value})
    }


    handleChangeComment = (event) => {
        this.setState({comment: event.target.value})
    }

    
    handleTopicChange = (event) => {
        this.setState({topic: event.target.value})
    }


    handleSubmit = (event) => {
        alert(`${this.state.username} ${this.state.comment} ${this.state.topic}`)
        event.preventDefault()
    }


    render() {
        return (
            <React.Fragment>
                <h1>Form example</h1>
                <form>
                    <div>
                        <label>Username</label>
                        <input
                            type="text"
                            value={this.state.username}
                            onChange={this.handleChangeUsername}
                        ></input>
                    </div>
                    <div>
                        <label>Comment</label>
                        <textarea value={this.state.comment} onChange={this.handleChangeComment}></textarea>
                    </div>
                    <div>
                        <label>Topic</label>
                        <select value={this.state.topic} onChange={this.handleTopicChange}>
                            <option value="React">React</option>
                            <option value="Angular">Angular</option>
                            <option value="Vue">Vue</option>
                        </select>
                    </div>
                    <div>
                        <button type="submit" onClick={this.handleSubmit}>Submit</button>
                    </div>
                </form>
            </React.Fragment>
        );
    }
}

export default FormExample;