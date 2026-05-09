# Dynamic Mapping和常见类型

Mapping中字段一旦设定后，禁止直接修改。因为倒排索引生成后不允许修改。需要重新建立新的索引，做reindex操作。



类似数据库中的表结构定义，主要作用

- 定义索引下的字段名称
- 定义字段的类型
- 定义倒排索引相关的配置（是否被索引？采用的Analyzer）



对新增字段的处理

true

false

strict



在object下，支持做dynamic的属性的定义



##  课程Demo

```
#写入文档，查看Mapping
PUT mapping_test/_doc/1
{
	"firstName":"chan",
	"lastName":"Jackie",
	"loginDate":"2018-07-24T10:29:48.103Z"
}

#查看 Mapping文件
GET mapping_test/_mapping

#删除索引
DELETE mapping_test


#dynamic mapping,推断字段的类型
PUT mapping_test/_doc/1
{
	"uid":"123",
	"isVip":false,
	"isAdmin":"true",
	"age":19,
	"heigh":180
}

#查看 Dynamic
GET mapping_test/_mapping

#默认Mapping支持dynamic，写入的文档中加入新的字段
PUT dynamic_mapping_test/_doc/1
{
	"newField":"someValue"
}

#修改为dynamic false
PUT dynamic_mapping_test/_mapping
{
	"dynamic": false
}

#新增 anotherField
PUT dynamic_mapping_test/_doc/10
{
	"anotherField":"someValue"
}

#该字段不可以被搜索，因为dynamic已经被设置为false
POST dynamic_mapping_test/_search
{
	"query":{
		"match":{
			"anotherField":"someValue"
		}
	}
}

GET dynamic_mapping_test/_doc/10

#修改为strict
PUT dynamic_mapping_test/_mapping
{
	"dynamic":"strict"
}


#写入数据出错，HTTP Code 400
PUT dynamic_mapping_test/_doc/12
{
	"lastField":"value"
}

DELETE dynamic_mapping_test

```



## 相关阅读

- https://www.elastic.co/guide/en/elasticsearch/reference/7.1/dynamic-mapping.html