import React from 'react';
import ReactDOM from 'react-dom';

import Bootstrap from 'bootstrap/dist/css/bootstrap.css';

import $ from 'jquery';

class App extends React.Component {

	constructor(props) {
		super(props);
		this.retrieveVideos = this.retrieveVideos.bind(this);
		this.retrieveArticles = this.retrieveArticles.bind(this);
		this.loadMoreData = this.loadMoreData.bind(this);
		this.handleRowClick = this.handleRowClick.bind(this);
		this.openImageUrl = this.openImageUrl.bind(this);
		this.state = {activeClass: "videos", data: [], maxRows: 5, clickedRows: [], loaded: false};
	}

	retrieveVideos() {
		$.ajax({
			url: 'http://ign-apis.herokuapp.com/videos/?startIndex=0&count=5',
			type: 'GET',			
			headers:{'Access-Control-Allow-Headers': 'x-requested-with'},
			dataType: 'json'
		}).done(function(data) {
			console.dir(data);
			this.setState({data: data.data, activeClass: "videos", maxRows: 5, clickedRows: []});
		}.bind(this))
		.fail(function(data){
			console.log(data);
		});
	}

	retrieveArticles() {
		$.ajax({
			url: 'http://ign-apis.herokuapp.com/articles/?startIndex=0&count=5',
			type: 'GET',			
			headers:{'Access-Control-Allow-Headers': 'x-requested-with'},
			dataType: 'json'
		}).done(function(data) {
			console.dir(data);
			this.setState({data: data.data, activeClass: "articles", maxRows: 5, clickedRows: []});
		}.bind(this))
		.fail(function(data){
			console.log(data);
		});
	}

	loadMoreData() {
		let maxRows = this.state.maxRows+5;
		$.ajax({
			url: 'http://ign-apis.herokuapp.com/'+(this.state.activeClass==='videos'?'videos':'articles')+'/?startIndex=0&count='+maxRows,
			type: 'GET',			
			headers:{'Access-Control-Allow-Headers': 'x-requested-with'},
			dataType: 'json'
		}).done(function(data) {
			console.dir(data);
			this.setState({data: data.data, activeClass: (this.state.activeClass==='videos'?'videos':'articles'), maxRows: maxRows});
		}.bind(this))
		.fail(function(data){
			console.log(data);
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
		$.ajax({
			url: 'http://ign-apis.herokuapp.com/videos?startIndex=0&count='+this.state.maxRows,
			type: 'GET',			
			headers:{'Access-Control-Allow-Headers': 'x-requested-with'},
			dataType: 'json'
		}).done(function(data) {
			console.dir(data);
			this.setState({data: data.data, loaded: true});
		}.bind(this))
		.fail(function(data){
			console.log(data);
		});
  	}

	render() {
		let rows = [];
		let count = 1;
		for(var i = 0; i < this.state.data.length && this.state.loaded; i++) {
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
			rows.push(	
			 	<tr style={{display: (this.state.clickedRows.indexOf(i) > -1? '':'none')}}>
					<td style={{height: '100%', width: '100%', position: 'relative'}} colSpan="4">
						<div style={{cursor: 'pointer'}} onClick={this.openImageUrl.bind(this, this.state.activeClass==='videos'? row.metadata.url:'http://www.ign.com/articles/'+row.metadata.slug)} className="goToIgn">GO TO IGN</div>
						<div className="image-background">
							<div className="image-container">
								<img src={row.thumbnails[0].url}></img>
							</div>
						</div>
					</td>
				</tr>
				
			);	
		}
		return (
			<div id="center">
				<div id="content">
					<div id="header">
						<div onClick={this.retrieveVideos} id="videos" className={this.state.activeClass === "videos"? "active-header":"unactive-header"}>VIDEOS</div>
						<div onClick={this.retrieveArticles} id="articles" className={this.state.activeClass === "articles"? "active-header":"unactive-header"}>ARTICLES</div>
					</div>
					<div id="table-wrapper">
						<table className="table">
							<tbody>
	    						{rows}
	    					</tbody>
				        </table>
				    </div>
			        {this.state.loaded && <div onClick={this.loadMoreData} id="load">{"SEE MORE " + (this.state.activeClass==="videos"? "VIDEOS...":"ARTICLES...")}</div>}
			    	
				</div>
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('app'));