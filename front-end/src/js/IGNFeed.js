import React from 'react';
import ReactDOM from 'react-dom';

import Bootstrap from 'bootstrap/dist/css/bootstrap.css';

import $ from 'jquery';

export default class IGNFeed extends React.Component {

	constructor(props) {
		super(props);
		this.retrieveVideos = this.retrieveVideos.bind(this);
		this.retrieveArticles = this.retrieveArticles.bind(this);
		this.loadMoreData = this.loadMoreData.bind(this);
		this.handleRowClick = this.handleRowClick.bind(this);
		this.openImageUrl = this.openImageUrl.bind(this);
		this.state = {activeClass: "videos", data: [], maxRows: 0, clickedRow: -1, loaded: false, hasLoadedMoreData: false};
	}

	retrieveVideos() {
		$.ajax({
			url: 'http://ign-apis.herokuapp.com/videos/?startIndex=0&count=10',
			type: 'GET',			
			dataType: 'jsonp'
		}).done(function(data) {
			console.dir(data);
			this.setState({data: data.data, activeClass: "videos", maxRows: 0, clickedRow: -1, loaded: true, hasLoadedMoreData: false});
		}.bind(this))
		.fail(function(data){
			console.log(data);
		});
	}

	retrieveArticles() {
		$.ajax({
			url: 'http://ign-apis.herokuapp.com/articles/?startIndex=0&count=10',
			type: 'GET',
			dataType: 'jsonp',
		}).done(function(data) {
			console.dir(data);
			this.setState({data: data.data, activeClass: "articles", maxRows: 0, clickedRow: -1, loaded: true, hasLoadedMoreData: false});
		}.bind(this))
		.fail(function(data){
			console.log(data);
		});
	}

	loadMoreData() {
		let maxRows = this.state.maxRows + 10;
		$.ajax({
			url: 'http://ign-apis.herokuapp.com/'+(this.state.activeClass==='videos'?'videos':'articles')+'/?startIndex='+maxRows+'&count=10',
			type: 'GET',			
			dataType: 'jsonp'
		}).done(function(data) {
			let newData = this.state.data;
			console.dir(this.state.data);
			newData = newData.concat(data.data);
			console.dir(newData);
			this.setState({data: newData, activeClass: (this.state.activeClass==='videos'?'videos':'articles'), maxRows: maxRows, hasLoadedMoreData: true});
		}.bind(this))
		.fail(function(data){
			console.log(data);
		});
	}

	handleRowClick(row) {
		this.setState({clickedRow: row});
	}

	openImageUrl(url) {
		var open = window.open(url, '_blank');
		open.focus();
	}

	componentDidMount() {
		$.ajax({
			url: 'http://ign-apis.herokuapp.com/videos?startIndex=0&count='+this.state.maxRows,
			type: 'GET',
			dataType: 'jsonp',
			accept: 'application/json, text/javascript, */*; q=0.0'
		}).done(function(data) {
			console.dir(data);
			this.setState({data: data.data, loaded: true});
		}.bind(this))
		.fail(function(data){
			console.log(data);
		});
  	}

	render() {
		let rows = [], count = 1;
		for(var i = 0; i < this.state.data.length && this.state.loaded; i++) {
			var row = this.state.data[i];
			rows.push(
				<tr style={{'display': this.state.clickedRow === i? 'none':''}} ref={i} key={i} onClick={this.handleRowClick.bind(this, i)}>
					<td className="hover-bar"></td>
					<td className="counter">{(count<10? "0":"")+count++}</td>
					<td className="title">
						<div className="name">{this.state.activeClass==='videos'? row.metadata.name:row.metadata.headline}</div>
						<div className="description">
							{this.state.activeClass==='videos'? row.metadata.description:row.metadata.subHeadline}
						</div>
					</td>
					<td className="duration">{this.state.activeClass==='videos' && Math.floor(row.metadata.duration/60) + ":" + (row.metadata.duration%60<10? "0":"") + row.metadata.duration%60}</td>
				</tr>
			);
			rows.push(	
			 	<tr key={'image-'+i} style={{display: (this.state.clickedRow === i? '':'none')}}>
					<td style={{height: '100%', width: '100%', position: 'relative', backgroundColor: 'black'}} colSpan="4">
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
			<div style={{height: this.state.hasLoadedMoreData? 'auto':'100%'}} id="center">
				<div id="content-background">
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
			</div>
		);
	}
}