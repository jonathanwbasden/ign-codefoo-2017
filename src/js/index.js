import React from 'react';
import ReactDOM from 'react-dom';

import Bootstrap from 'bootstrap/dist/css/bootstrap.css';

import axios from 'axios';

class App extends React.Component {

	constructor(props) {
		super(props);
		this.retrieveVideos = this.retrieveVideos.bind(this);
		this.retrieveArticles = this.retrieveArticles.bind(this);
		this.loadMoreData = this.loadMoreData.bind(this);
		this.state = {activeClass: "videos", data: [], maxRows: 5};
	}

	retrieveVideos() {
		axios.get('http://ign-apis.herokuapp.com/videos/?startIndex=30\u0026count=5')
      	.then(data => {
      		console.dir(data.data.data);
       		this.setState({data: data.data.data, activeClass: "videos", maxRows: 5});
      	});
	}

	retrieveArticles() {
		axios.get('http://ign-apis.herokuapp.com/articles?startIndex=30\u0026count=5')
      	.then(data => {
      		console.dir(data.data.data);
       		this.setState({data: data.data.data, activeClass: "articles", maxRows: 5});
      	});
	}

	loadMoreData() {
		let maxRows = this.state.maxRows + 5;
		axios.get('http://ign-apis.herokuapp.com/'+(this.state.activeClass==='videos'?'videos':'articles') + '?startIndex=30\u0026count=' + maxRows)
      	.then(data => {
       		this.setState({data: data.data.data, maxRows: maxRows});
      	});
	}

	componentDidMount() {
		axios.get('http://ign-apis.herokuapp.com/' + (this.state.activeClass==='videos'?'videos':'articles') + '?startIndex=30\u0026count='+this.state.maxRows)
      	.then(data => {
      		console.dir(data.data.data);
       		this.setState({data: data.data.data});
      	});
  	}

	render() {

		let count = 1;
		let tableContent = this.state.data.map((row) => {
			return (
				<tr>
					<td className="hover-bar"></td>
					<td className="counter">{(count<10? "0":"")+count++}</td>
					<td className="title">
						{this.state.activeClass==='videos'? row.metadata.longTitle:row.metadata.headline}
						<div className="description">
							{this.state.activeClass==='videos'? row.metadata.description:row.metadata.subHeadline}
						</div>
					</td>
					<td className="duration">{this.state.activeClass==='videos' && Math.floor(row.metadata.duration/60) + ":" + (row.metadata.duration%60<10? "0":"") + row.metadata.duration%60}</td>
				</tr>
			);
		});

		return (
			<div id="center">
				<div id="content">
					<div id="header">
						<div onClick={this.retrieveVideos} id="videos" className={this.state.activeClass === "videos"? "active-header":"unactive-header"}>VIDEOS</div>
						<div onClick={this.retrieveArticles} id="articles" className={this.state.activeClass === "articles"? "active-header":"unactive-header"}>ARTICLES</div>
					</div>
					<table className="table">
						<tbody>
    						{tableContent}
    					</tbody>
			        </table>
			        <div onClick={this.loadMoreData} id="load">{"SEE MORE " + (this.state.activeClass==="videos"? "VIDEOS...":"ARTICLES...")}</div>
				</div>
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('app'));