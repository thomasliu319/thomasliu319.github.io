#  Dynamic Template和Index Template

##  课程Demo



```
#数字字符串被映射成text,日期字符串被映射成日期
PUT template/_doc/1
{
	"someNumber":"1",
	"someDate":"2019/01/01"
}

GET template/_mapping

#Create a default template
PUT _template/template_default
{
	"index_patterns": ["*"],
	"order": 0,
	"version":1,
	"settings":{
		"number_of_shards": 1,
		"number_of_replicas": 1
	}
	
}

PUT /_template/template_test
{
	"index_patterns": ["test*"],
	"order": 1,
	"settings":{
		"number_of_shards": 1,
		"number_of_replicas": 2
	},
	"mappings":{
		"date_detection": false,
		"numeric_detection": true
	}
}

#查看template信息
GET /_template/template_default

GET /_template/temp*


#写入新数据，index以test开头
PUT testtemplate/_doc/1
{
	"someNumber":"1",
	"someDate":"2019/01/01"
}

GET testtemplate/_mapping
GET testtemplate/_settings

PUT testmy
{
	"settings":{
		"numbers_of_replica":5
	}
}

PUT testmy/_doc/1
{
	"key":"value"
}

GET testmy/_settings
DELETE testmy
DELETE /_template/template_default
DELETE /_template/template_test


#Dynamic Mapping 根据类型和字段名
DELETE my_index

PUT my_index/_doc/1
{
	"firstName":"Ruan",
	"isVIP":"true"
}


GET my_index/_mapping
DELETE my_index
PUT my_index
{
	"mappings":{
		"dynamic_templates":[
			{
				"String_as_boolean":{
					"match_mapping_type": "string",
					"match":"is*",
					"mapping":{
						"type": "boolean"
					}
				}
			},
			{
				"strings_as_keywords":{
					"match_mapping_type": "string",
					"mapping":{
						"type": "keyword"
					}
				}
			}
		]
	}
}


DELETE my_index
#结合路径
PUT my_index
{
	"mappings":{
		"dynamic_templates":[
			{
				“full_name”: {
					"path_match": "name.*",
					"patch_unmatch": "*.middle",
					"mapping": {
							"type": "text",
							"copy_to": "full_name"
					}
				}
			}
		]
	}
}



PUT my_index/_doc/1
{
	"name":{
		"first": "John",
		"middle": "Winston",
		"last": "Lennon"
	}
}

GET my_index/_search?q=full_name:John

```



## 相关阅读

- Index Templats https://www.elastic.co/guide/en/elasticsearch/reference/7.1/indices-templates.html
- Dynamic Template https://www.elastic.co/guide/en/elasticsearch/reference/7.1/dynamic-mapping.html