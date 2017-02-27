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
		this.handleRowClick = this.handleRowClick.bind(this);
		this.openImageUrl = this.openImageUrl.bind(this);
		this.state = {activeClass: "videos", data: [], maxRows: 5, clickedRows: []};
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

	handleRowClick(row) {
		let clickedRows = this.state.clickedRows;
		if(clickedRows.indexOf(row) > -1) {
			clickedRows.splice(clickedRows.indexOf(row), 1);
		}
		else {
			clickedRows.push(row);
		}
		this.setState({clickedRow: clickedRows});
	}

	openImageUrl(url) {
		window.open(url, '_tab');
	}

	componentDidMount() {
		axios.get('http://ign-apis.herokuapp.com/' + (this.state.activeClass==='videos'?'videos':'articles') + '?startIndex=30\u0026count='+this.state.maxRows)
       	.then(data => {
        	this.setState({data: data.data.data});
       	});
  	}

	render() {
		let rows = [];
		let count = 1;
		for(var i = 0; i < this.state.data.length; i++) {
			var row = this.state.data[i];
			rows.push(
				<tr onClick={this.handleRowClick.bind(this, i)}>
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
			if(this.state.clickedRows.indexOf(i) > -1) {
				rows.push(	
					 	<tr>
							<td onClick={this.openImageUrl.bind(this, row.metadata.url)} style={{cursor: 'pointer',height: row.thumbnails[0].height+'px', width: row.thumbnails[0].width+'px',backgroundImage: "url("+row.thumbnails[0].url+")", backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'}} colSpan="4"></td>
						</tr>
					
				);
			}
		}
		return (
			<div id="center">
				<div id="content">
					<div id="header">
						<div onClick={this.retrieveVideos} id="videos" className={this.state.activeClass === "videos"? "active-header":"unactive-header"}>VIDEOS</div>
						<div onClick={this.retrieveArticles} id="articles" className={this.state.activeClass === "articles"? "active-header":"unactive-header"}>ARTICLES</div>
					</div>
					<table className="table">
						<tbody>
    						{rows}
    					</tbody>
			        </table>
			        <div onClick={this.loadMoreData} id="load">{"SEE MORE " + (this.state.activeClass==="videos"? "VIDEOS...":"ARTICLES...")}</div>
				</div>
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('app'));