# Logstash安装与测试数据导入

## 课程Demo

​	安装Logstas，并且导入Movielen s的测试数据集

 - Small：100000 ratings  and 3600 tag applications applied to 9000 movies by 600 users. Last updated 9/2018

 - movielens/ml-latest-small/movies.csv movie数据

 - movielens/logstash.conf //logstash 7.x 配置文件，

 - movielens/logstash6.conf  //logstash 6.x 配置文件

```
#下载与ES相同版本号的logstash,(7.1.0),并解压到相应目录
#修改movielens目录下的logstash.conf文件
#path修改为，你实际的movies.csv路径
input {
  file {
    path => "YOUR_FULL_PATH_OF_movies.csv"
    start_position => "beginning"
    sincedb_path => "/dev/null"
  }
}

#启动Elasticsearch实例，然后启动logstash,并指定配置文件导入数据
bin/logstash -f /YOUR_PATH_of_logstash.conf

bin/logstash -f /Users/thomasliu/Blog/ELK/part-1/2.4-Logstash安装与导入数据/movielens/logstash.conf
```

## 相关阅读

- 下载MovieLens最小测试数据集： https://grouplens.org/datasets/movielens/
- Logstash下载：https://www.elastic.co/cn/downloads/logstash
- Logstash参考文档： https://www.elastic.co/guide/en/logstash/current/index.html
