import { Component } from "react";
import NewsItem from "./NewsItem";
import { Spinner } from "./Spinner";
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

export class News extends Component {
    static defaultProps = {
        country:'in',
        pageSize:15,
        category:'general'
    }
    static propTypes = {
        country:PropTypes.string,
        pageSize:PropTypes.number,
        category:PropTypes.string
    }
    articles = [];
    constructor(props){
        super(props);
        this.state = {
            articles: [],
            loading:false,
            page:1,
            totalResults:0
        }
        document.title = `${this.capitalizeFirstLatter(this.props.category)} - NewsMonkey`;
    }
    capitalizeFirstLatter = (string)=> {
        return string.charAt(0).toUpperCase()+ string.slice(1);
    }
    async updateNews(){
        this.props.setProgress(10);
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        this.setState({loading:true})
        let data = await fetch(url);
        this.props.setProgress(30);
        let parseData = await data.json();
        this.props.setProgress(70);
        this.setState({
            articles:parseData.articles,
            totalResults:parseData.totalResults,
            loading:false
        })
        this.props.setProgress(100);
    }
    async componentDidMount(){
        this.updateNews();
    }
    handlePreviousClick = async()=>{
        this.setState({page:this.state.page-1});
        this.updateNews();
    }
    handleNextClick = async ()=>{
        this.setState({page:this.state.page+1});
        this.updateNews();
    }
    fetchMoreData = async () => {
        this.setState({page:this.state.page+1});
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        let data = await fetch(url);
        let parseData = await data.json();
        this.setState({
            articles:this.state.articles.concat(parseData.articles),
            totalResults:parseData.totalResults,
            loading:false
        })    
    }
        
    render() {
        return (
            <>
                <h2 className="text-center my-3">NewsMonkey - Top {this.capitalizeFirstLatter(this.props.category)} Headlines</h2>
                {this.state.loading && <Spinner />}
                <InfiniteScroll
                    dataLength={this.state.articles.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.articles.length!==this.state.totalResults}
                    loader={<Spinner />}>
                    <div className="container my-4">
                        <div className="row">
                            {this.state.articles.map((element) =>{
                                return <div className="col-md-4" key={element.url}>
                                            <NewsItem title={element.title} description={element.description} imageUrl={element.urlToImage} 
                                                newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
                                        </div>
                                        })
                            } 
                        </div>
                    </div>
                </InfiniteScroll>
            </>
        )
    }
}

export default News