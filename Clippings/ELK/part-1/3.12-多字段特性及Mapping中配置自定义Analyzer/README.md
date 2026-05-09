# 多字段特性及Mapping中配置自定义Analyzer

##  课程Demo



```
PUT logs/_doc/1
{
  "level":"DEBUG"
}

GET logs/_mapping

GET _analyze
{
	"tokenizer": "keyword",
	"char_filter": ["html_strip"],
	"text": "<b>hello world</b>"
}

GET _analyze
{               
	"tokenizer": "path_hierarchy",
	"text":"/Users/thomasliu/a/b/c/d/e"
}

#char filter 替换表情符号
GET _analyze
{
  "tokenizer": "standard",
  "char_filter": [{
    "type":"mapping",
    "mappings":[":) => happy" , ":( => sad"]
  }],
  "text":["I am felling :)", "felling :( today"]
}

#white space and snowball
GET _analyze
{
  "tokenizer": "whitespace",
  "filter": ["stop","snowball"],
  "text": ["The girls in china is playing this game!"]
}

#whitespace与stop
GET _analyze
{
  "tokenizer": "whitespace",
  "filter": ["stop","snowball"],
  "text": ["The rain in spain falls mainly on the plain."]
}

#remove 加入lowercase后，The被当成 stopword删除
GET _analyze
{
	"tokenizer": "whitespace",
	"filter": ["lowercase","stop","snowball"],
	"text": ["The girls in china is playing this game!"]
}


#正则表达式
GET _analyze
{
	"tokenizer": "standard",
	"char_filter":[
		{
			"type":"pattern_replace",
			"pattern": "http://(.*)",
			"replacement": "$1"
		}
	],
	"text" :"http://www.elastic.co"
}

```



## 相关阅读

