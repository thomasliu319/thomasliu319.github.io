# 显式Mapping设置与常见参数介绍

## 课程Demos

```
#设置 index为false
DELETE users

PUT users
{
		"mappings":{
			"properties":{
					"firstName":{
						"type": "text"
					},
					"lastName":{
						 "type": "text"
					},
					"mobile":{
							"type": "text",
							"index": false
					}
			}
		}
}


PUT users/_doc/1
{
	"firstName":"Ruan",
	"lastName": "Yiming",
	"mobile": "12345678"
}

POST /users/_search
{
	"query":{
		"match":{
			"mobile":"12345678"
		}
	}
}

#设定Null_value
DELETE users
PUT users
{
	"mappings":{
			"properties":{
					"firstName":{
						"type": "text"
					},
					"lastName":{
						 "type": "text"
					},
					"mobile":{
							"type": "keyword",
							"null_value": "NULL"
					}
			}
		}
}


PUT users/_doc/1
{
	"firstName":"Ruan",
	"lastName":"Yiming",
	"mobile": null
}

PUT users/_doc/2
{
	"firstName": "Ruan2",
	"lastName": "Yiming2"
}


GET users/_search
{
  "query":{
    "match":{
      "mobile":"NULL"
    }
  }
}


#设置 Copyto
DELETE users
PUT users
{
	"mappings":{
			"properties":{
					"firstName":{
						"type": "text",
						"copy_to": "fullName"
					},
					"lastName":{
						 "type": "text",
						 "copy_to": "fullName"
					}
			}
		}
}

PUT users/_doc/1
{
	"firstName":"Ruan",
	"lastName": "Yiming"
}

GET users/_search?q=fullName:(Ruan Yiming)

POST users/_search
{
	"query":{
		"match":{
			"fullName":{
				"query": "Ruan Yiming",
				"operator": "and"
			}
		}
	}
}


#数组类型
PUT users/_doc/1
{
	"name":"onebird",
	"interests":"reading"
}


PUT users/_doc/1
{
	"name":"twobirds",
	"interests":["reading","music"]
}

POST users/_search
{
  "query":{
    "match_all": {}
  }
}

GET users/_mapping


阮老师，您好！问两个问题。
1、在此节课中，定义一个字段可以定义成“keyword"，当时在讲数据类型时，对象或基本类型也并没有包括这个keyword，如果将keyword做为一种数据类型，可以将其理解成text类型的别名版了？
2、另外这里的keyword与text类型的子字段的keyword在作用上是有区别还是没有区别？
作者回复: 不好意思，让我来对这个做一下解释。应该包含两个概念。
1.text类型和keyword类型
2. 多字段定义

一切文本类型的字符串可以定义成 “text”或“keyword”两种类型。区别在于，text类型会使用默认分词器分词，当然你也可以为他指定特定的分词器。如果定义成keyword类型，那么默认就不会对其进行分词。

es对字符串类型的mappong设定，会将其定义成text，同时为他定义一个叫做keyword的子字段。keyword只是他的名字，你也可以定义成kw。这个字段的类型是keyword（这是一个类型的关键字）

多字段类型情况下，你可以查询 title，也可以查询title.keyword查询类型为keyword的子字段

```



## 补充阅读

- Mapping Parameters https://www.elastic.co/guide/en/elasticsearch/reference/7.1/mapping-params.html